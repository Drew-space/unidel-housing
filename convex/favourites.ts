import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const toggleFavourite = mutation({
  args: { houseId: v.id("housePost") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject;

    const existing = await ctx.db
      .query("favourites")
      .withIndex("by_user_and_house", (q) =>
        q.eq("userId", userId).eq("houseId", args.houseId),
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
      return false; // unliked
    } else {
      await ctx.db.insert("favourites", { userId, houseId: args.houseId });
      return true; // liked
    }
  },
});

export const getFavourites = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const userId = identity.subject;

    const favs = await ctx.db
      .query("favourites")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // get the full house data for each favourite
    const houses = await Promise.all(
      favs.map((fav) => ctx.db.get(fav.houseId)),
    );

    return houses.filter(Boolean);
  },
});

export const isFavourited = query({
  args: { houseId: v.id("housePost") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;

    const existing = await ctx.db
      .query("favourites")
      .withIndex("by_user_and_house", (q) =>
        q.eq("userId", identity.subject).eq("houseId", args.houseId),
      )
      .unique();

    return !!existing;
  },
});
