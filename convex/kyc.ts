import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ── Upload URL ────────────────────────────────────────────────────────────────
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    return await ctx.storage.generateUploadUrl();
  },
});

// ── Submit KYC ────────────────────────────────────────────────────────────────
export const submitKyc = mutation({
  args: {
    fullLegalName: v.string(),
    phoneNumber: v.string(),
    currentAddress: v.string(),
    idType: v.union(
      v.literal("NIN"),
      v.literal("Drivers_License"),
      v.literal("Voters_Card"),
      v.literal("International_Passport"),
    ),
    idNumber: v.string(),
    idFrontStorageId: v.id("_storage"),
    idBackStorageId: v.optional(v.id("_storage")),
    selfieStorageId: v.id("_storage"),
    utilityBillStorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    // Block resubmission if pending or already approved
    const existing = await ctx.db
      .query("kycSubmissions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .first();

    if (existing?.status === "pending") {
      throw new Error(
        "You already have a pending KYC submission. Please wait for a decision.",
      );
    }
    if (existing?.status === "approved") {
      throw new Error("Your KYC has already been approved.");
    }
    // ✅ rejected users CAN resubmit — no error thrown

    await ctx.db.insert("kycSubmissions", {
      userId: user._id,
      clerkId: identity.subject,
      fullLegalName: args.fullLegalName,
      phoneNumber: args.phoneNumber,
      currentAddress: args.currentAddress,
      idType: args.idType,
      idNumber: args.idNumber,
      idFrontStorageId: args.idFrontStorageId,
      idBackStorageId: args.idBackStorageId,
      selfieStorageId: args.selfieStorageId,
      utilityBillStorageId: args.utilityBillStorageId,
      status: "pending",
      submittedAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// ── Get my KYC status ─────────────────────────────────────────────────────────
export const getMyKycStatus = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return null;

    return await ctx.db
      .query("kycSubmissions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .first();
  },
});

// ── Admin: get all submissions by status ──────────────────────────────────────
export const getKycSubmissions = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("approved"),
        v.literal("rejected"),
      ),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const admin = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!admin || admin.role !== "admin") throw new Error("Not authorized");

    const submissions = args.status
      ? await ctx.db
          .query("kycSubmissions")
          .withIndex("by_status", (q) => q.eq("status", args.status!))
          .order("desc")
          .collect()
      : await ctx.db.query("kycSubmissions").order("desc").collect();

    // Resolve storage URLs and user info
    return await Promise.all(
      submissions.map(async (sub) => {
        const user = await ctx.db.get(sub.userId);
        const selfieUrl = await ctx.storage.getUrl(sub.selfieStorageId);
        const idFrontUrl = await ctx.storage.getUrl(sub.idFrontStorageId);
        const idBackUrl = sub.idBackStorageId
          ? await ctx.storage.getUrl(sub.idBackStorageId)
          : null;
        const utilityBillUrl = await ctx.storage.getUrl(
          sub.utilityBillStorageId,
        );

        return {
          ...sub,
          user,
          selfieUrl,
          idFrontUrl,
          idBackUrl,
          utilityBillUrl,
        };
      }),
    );
  },
});

// ── Admin: get single submission ──────────────────────────────────────────────
export const getKycSubmissionById = query({
  args: { submissionId: v.id("kycSubmissions") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const admin = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!admin || admin.role !== "admin") throw new Error("Not authorized");

    const sub = await ctx.db.get(args.submissionId);
    if (!sub) return null;

    const user = await ctx.db.get(sub.userId);
    const selfieUrl = await ctx.storage.getUrl(sub.selfieStorageId);
    const idFrontUrl = await ctx.storage.getUrl(sub.idFrontStorageId);
    const idBackUrl = sub.idBackStorageId
      ? await ctx.storage.getUrl(sub.idBackStorageId)
      : null;
    const utilityBillUrl = await ctx.storage.getUrl(sub.utilityBillStorageId);

    return { ...sub, user, selfieUrl, idFrontUrl, idBackUrl, utilityBillUrl };
  },
});

// ── Admin: approve KYC ────────────────────────────────────────────────────────
export const approveKyc = mutation({
  args: { submissionId: v.id("kycSubmissions") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const admin = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!admin || admin.role !== "admin") throw new Error("Not authorized");

    const sub = await ctx.db.get(args.submissionId);
    if (!sub) throw new Error("Submission not found");
    if (sub.status !== "pending") throw new Error("Submission is not pending");

    // Approve the submission
    await ctx.db.patch(args.submissionId, {
      status: "approved",
      reviewedAt: Date.now(),
      reviewedBy: admin._id,
      updatedAt: Date.now(),
    });

    // Promote user to agent
    await ctx.db.patch(sub.userId, { role: "agent", updatedAt: Date.now() });

    // Notify user
    await ctx.db.insert("notifications", {
      userId: sub.userId,
      type: "kyc_approved",
      message:
        "Your KYC submission has been approved. You are now a verified agent on Ruum.",
      read: false,
      createdAt: Date.now(),
    });
  },
});

// ── Admin: reject KYC ─────────────────────────────────────────────────────────
export const rejectKyc = mutation({
  args: {
    submissionId: v.id("kycSubmissions"),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const admin = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!admin || admin.role !== "admin") throw new Error("Not authorized");

    const sub = await ctx.db.get(args.submissionId);
    if (!sub) throw new Error("Submission not found");
    if (sub.status !== "pending") throw new Error("Submission is not pending");

    await ctx.db.patch(args.submissionId, {
      status: "rejected",
      rejectionReason: args.reason,
      reviewedAt: Date.now(),
      reviewedBy: admin._id,
      updatedAt: Date.now(),
    });

    // Notify user
    await ctx.db.insert("notifications", {
      userId: sub.userId,
      type: "kyc_rejected",
      message: `Your KYC submission was rejected. Reason: ${args.reason}`,
      read: false,
      createdAt: Date.now(),
    });
  },
});
