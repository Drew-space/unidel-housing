import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ── Submit a report ───────────────────────────────────────────────────────────
export const submitReport = mutation({
  args: {
    agentId: v.id("users"),
    reporterName: v.string(),
    reporterEmail: v.string(),
    reporterPhone: v.string(),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("agentReports", {
      agentId: args.agentId,
      reporterName: args.reporterName,
      reporterEmail: args.reporterEmail,
      reporterPhone: args.reporterPhone,
      reason: args.reason,
      createdAt: Date.now(),
    });
  },
});

// ── Get reports for an agent (admin only) ─────────────────────────────────────
export const getAgentReports = query({
  args: { agentId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const admin = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!admin || admin.role !== "admin") throw new Error("Not authorized");

    return await ctx.db
      .query("agentReports")
      .withIndex("by_agent", (q) => q.eq("agentId", args.agentId))
      .order("desc")
      .collect();
  },
});

// ── Get all reports (admin only) ──────────────────────────────────────────────
export const getAllReports = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const admin = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!admin || admin.role !== "admin") throw new Error("Not authorized");

    const reports = await ctx.db.query("agentReports").order("desc").collect();

    return await Promise.all(
      reports.map(async (r) => {
        const agent = await ctx.db.get(r.agentId);
        return { ...r, agent };
      }),
    );
  },
});

// ── Dismiss a report (admin only) ─────────────────────────────────────────────
export const dismissReport = mutation({
  args: { reportId: v.id("agentReports") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const admin = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!admin || admin.role !== "admin") throw new Error("Not authorized");

    await ctx.db.delete(args.reportId);
  },
});
