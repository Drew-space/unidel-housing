import { v } from "convex/values";
import { query } from "./_generated/server";

export const getHouses = query({
  args: {
    location: v.optional(
      v.union(
        v.literal("owa-alero"),
        v.literal("alihame"),
        v.literal("owo-yibo"),
      ),
    ),
    roomType: v.optional(
      v.union(
        v.literal("bed_sitter"),
        v.literal("single_room"),
        v.literal("room_and_parlor"),
      ),
    ),
  },
  handler: async (ctx, args) => {
    // both filters applied
    if (args.location && args.roomType) {
      return await ctx.db
        .query("housePost")
        .withIndex("by_location_and_roomType", (q) =>
          q.eq("location", args.location!).eq("roomType", args.roomType!),
        )
        .filter((q) => q.eq(q.field("isAvailable"), true))
        .collect();
    }

    // only location
    if (args.location) {
      return await ctx.db
        .query("housePost")
        .withIndex("by_location", (q) => q.eq("location", args.location!))
        .filter((q) => q.eq(q.field("isAvailable"), true))
        .collect();
    }

    // only roomType
    if (args.roomType) {
      return await ctx.db
        .query("housePost")
        .withIndex("by_roomType", (q) => q.eq("roomType", args.roomType!))
        .filter((q) => q.eq(q.field("isAvailable"), true))
        .collect();
    }

    // no filters — return all house
    return await ctx.db.query("housePost").order("desc").collect();
  },
});
// ```

// On the frontend it would just be two dropdowns:
// ```;
// Location: [All] [Owa-Alero] [Alihame] [Owo-Yibo]
// Room Type: [All] [Bed Sitter] [Single Room] [Room & Parlor]
