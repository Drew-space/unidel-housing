import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// helper to verify caller is admin
async function requireAdmin(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");
  const admin = await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q: any) => q.eq("clerkId", identity.subject))
    .unique();
  if (!admin || admin.role !== "admin") throw new Error("Not authorized");
  return admin;
}

// ── Get all users ─────────────────────────────────────────────────────────────
export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db.query("users").order("desc").collect();
  },
});

// ── Get all listings ──────────────────────────────────────────────────────────
export const getAllListings = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db.query("housePost").order("desc").collect();
  },
});

// ── Set user role ─────────────────────────────────────────────────────────────
export const setUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("user"), v.literal("agent"), v.literal("admin")),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.userId, { role: args.role, updatedAt: Date.now() });
  },
});

// ── Delete user ───────────────────────────────────────────────────────────────
export const deleteUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    // Delete their house posts
    const posts = await ctx.db
      .query("housePost")
      .withIndex("by_author", (q) => q.eq("authorId", args.userId))
      .collect();
    await Promise.all(posts.map((p) => ctx.db.delete(p._id)));
    // Delete their KYC
    const kyc = await ctx.db
      .query("kycSubmissions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    await Promise.all(kyc.map((k) => ctx.db.delete(k._id)));
    // Delete the user
    await ctx.db.delete(args.userId);
  },
});
