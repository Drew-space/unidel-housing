import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateImageUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const createHousePost = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    content: v.string(),
    price: v.number(),
    contactPhone: v.string(),
    location: v.union(
      v.literal("owa-alero"),
      v.literal("alihame"),
      v.literal("owo-yibo"),
    ),
    roomType: v.union(
      v.literal("bed_sitter"),
      v.literal("single_room"),
      v.literal("room_and_parlor"),
    ),
    propertyType: v.union(
      v.literal("fenced_compound"),
      v.literal("bungalow"),
      v.literal("story_building"),
    ),
    amenities: v.array(
      v.union(
        v.literal("bed"),
        v.literal("wardrobe"),
        v.literal("cupboard"),
        v.literal("kitchen_cabinet"),
        v.literal("sofa"),
        v.literal("dining_table"),
        v.literal("tv_stand"),
        v.literal("curtains"),
      ),
    ),
    imageStorageId: v.id("_storage"),
    extraStorageIds: v.optional(v.array(v.id("_storage"))),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // get the user from the users table
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    // resolve the cover image URL
    const imageUrl = await ctx.storage.getUrl(args.imageStorageId);
    if (!imageUrl) throw new Error("Failed to get image URL");

    // resolve extra image URLs if provided
    let images: string[] | undefined;
    if (args.extraStorageIds?.length) {
      const urls = await Promise.all(
        args.extraStorageIds.map((id) => ctx.storage.getUrl(id)),
      );
      images = urls.filter(Boolean) as string[];
    }

    await ctx.db.insert("housePost", {
      title: args.title,
      description: args.description,
      content: args.content,
      price: args.price,
      contactPhone: args.contactPhone,
      location: args.location,
      roomType: args.roomType,
      propertyType: args.propertyType,
      amenities: args.amenities,
      imageStorageId: args.imageStorageId,
      imageUrl,
      images,
      authorId: user._id,
      authorName: user.name,
      authorImage: user.imageUrl,

      updatedAt: Date.now(),
    });
  },
});

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
        .collect();
    }

    // only location
    if (args.location) {
      return await ctx.db
        .query("housePost")
        .withIndex("by_location", (q) => q.eq("location", args.location!))

        .collect();
    }

    // only roomType
    if (args.roomType) {
      return await ctx.db
        .query("housePost")
        .withIndex("by_roomType", (q) => q.eq("roomType", args.roomType!))

        .collect();
    }

    // no filters — return all house
    return await ctx.db.query("housePost").order("desc").collect();
  },
});

export const getHouseById = query({
  args: { id: v.id("housePost") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
export const getMyHouses = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return [];

    return await ctx.db
      .query("housePost")
      .withIndex("by_author", (q) => q.eq("authorId", user._id))
      .order("desc")
      .collect();
  },
});

// ```

// On the frontend it would just be two dropdowns:
// ```;
// Location: [All] [Owa-Alero] [Alihame] [Owo-Yibo]
// Room Type: [All] [Bed Sitter] [Single Room] [Room & Parlor]
