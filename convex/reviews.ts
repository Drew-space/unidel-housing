import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ── Leave a review ────────────────────────────────────────────────────────────
export const leaveReview = mutation({
  args: {
    agentId: v.id("users"),
    rating: v.number(),
    comment: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const reviewer = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!reviewer) throw new Error("User not found");

    // Must be a logged-in verified user (not the agent themselves)
    if (reviewer._id === args.agentId) {
      throw new Error("You cannot review yourself");
    }

    // Only verified users (role: "user" or "agent") can leave reviews
    // Basically anyone who is logged in and not banned
    const agent = await ctx.db.get(args.agentId);
    if (!agent || agent.role !== "agent") {
      throw new Error("Agent not found");
    }

    // One review per user per agent
    const existing = await ctx.db
      .query("agentReviews")
      .withIndex("by_agent_and_reviewer", (q) =>
        q.eq("agentId", args.agentId).eq("reviewerId", reviewer._id),
      )
      .unique();

    if (existing) {
      // Update existing review instead
      await ctx.db.patch(existing._id, {
        rating: args.rating,
        comment: args.comment,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("agentReviews", {
        agentId: args.agentId,
        reviewerId: reviewer._id,
        reviewerName: reviewer.name,
        reviewerImage: reviewer.imageUrl,
        rating: args.rating,
        comment: args.comment,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      // Notify agent of new review
      await ctx.db.insert("notifications", {
        userId: args.agentId,
        type: "new_review",
        message: `${reviewer.name} left you a ${args.rating}-star review.`,
        read: false,
        createdAt: Date.now(),
      });
    }
  },
});

// ── Get reviews for an agent ──────────────────────────────────────────────────
export const getAgentReviews = query({
  args: { agentId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("agentReviews")
      .withIndex("by_agent", (q) => q.eq("agentId", args.agentId))
      .order("desc")
      .collect();
  },
});

// ── Get agent review stats ────────────────────────────────────────────────────
export const getAgentReviewStats = query({
  args: { agentId: v.id("users") },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("agentReviews")
      .withIndex("by_agent", (q) => q.eq("agentId", args.agentId))
      .collect();

    if (reviews.length === 0) return { average: 0, total: 0 };

    const average =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    return { average: Math.round(average * 10) / 10, total: reviews.length };
  },
});

// ── Check if current user already reviewed an agent ───────────────────────────
export const getMyReviewForAgent = query({
  args: { agentId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const reviewer = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!reviewer) return null;

    return await ctx.db
      .query("agentReviews")
      .withIndex("by_agent_and_reviewer", (q) =>
        q.eq("agentId", args.agentId).eq("reviewerId", reviewer._id),
      )
      .unique();
  },
});
