// import { v } from "convex/values";
// import { mutation, query } from "./_generated/server";

// export const generateImageUploadUrl = mutation({
//   args: {},
//   handler: async (ctx) => {
//     return await ctx.storage.generateUploadUrl();
//   },
// });

// export const createHousePost = mutation({
//   args: {
//     title: v.string(),
//     description: v.string(),

//     price: v.number(),
//     contactPhone: v.string(),
//     location: v.union(
//       v.literal("Alihame"),
//       v.literal("Owa-Alero"),
//       v.literal("Owo-Oyibu"),
//       v.literal("Owa-Ekei"),
//       v.literal("Agbor-Obi"),
//       v.literal("Boji-Boji"),
//       v.literal("Aliokpu"),
//     ),
//     roomType: v.union(
//       v.literal("Bed-Sitter"),
//       v.literal("Single-Room"),
//       v.literal("Room_and_Parlor"),
//     ),
//     propertyType: v.union(
//       v.union(v.literal("Bungalow"), v.literal("Story-Building")),
//     ),
//     amenities: v.array(
//       v.union(
//         v.literal("Bed"),
//         v.literal("Wardrobe"),
//         v.literal("Cupboard"),
//         v.literal("Kitchen-Cabinet"),
//         v.literal("Sofa"),
//       ),
//     ),
//     imageStorageId: v.id("_storage"),
//     extraStorageIds: v.optional(v.array(v.id("_storage"))),
//   },
//   handler: async (ctx, args) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) throw new Error("Not authenticated");

//     // get the user from the users table
//     const user = await ctx.db
//       .query("users")
//       .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
//       .unique();
//     if (!user) throw new Error("User not found");

//     // resolve the cover image URL
//     const imageUrl = await ctx.storage.getUrl(args.imageStorageId);
//     if (!imageUrl) throw new Error("Failed to get image URL");

//     // resolve extra image URLs if provided
//     let images: string[] | undefined;
//     if (args.extraStorageIds?.length) {
//       const urls = await Promise.all(
//         args.extraStorageIds.map((id) => ctx.storage.getUrl(id)),
//       );
//       images = urls.filter(Boolean) as string[];
//     }

//     await ctx.db.insert("housePost", {
//       title: args.title,
//       description: args.description,
//       authorUsername: user.username,

//       price: args.price,
//       contactPhone: args.contactPhone,
//       location: args.location,
//       roomType: args.roomType,
//       propertyType: args.propertyType,
//       amenities: args.amenities,
//       imageStorageId: args.imageStorageId,
//       imageUrl,
//       images,
//       authorId: user._id,
//       authorName: user.name,
//       authorImage: user.imageUrl,

//       updatedAt: Date.now(),
//     });
//   },
// });

// export const getHouses = query({
//   args: {
//     location: v.optional(
//       v.union(
//         v.literal("Alihame"),
//         v.literal("Owa-Alero"),
//         v.literal("Owo-Oyibu"),
//         v.literal("Owa-Ekei"),
//         v.literal("Agbor-Obi"),
//         v.literal("Boji-Boji"),
//         v.literal("Aliokpu"),
//       ),
//     ),
//     roomType: v.optional(
//       v.union(
//         v.literal("Bed-Sitter"),
//         v.literal("Single-Room"),
//         v.literal("Room_and_Parlor"),
//       ),
//     ),
//   },
//   handler: async (ctx, args) => {
//     // both filters applied
//     if (args.location && args.roomType) {
//       return await ctx.db
//         .query("housePost")
//         .withIndex("by_location_and_roomType", (q) =>
//           q.eq("location", args.location!).eq("roomType", args.roomType!),
//         )
//         .collect();
//     }

//     // only location
//     if (args.location) {
//       return await ctx.db
//         .query("housePost")
//         .withIndex("by_location", (q) => q.eq("location", args.location!))

//         .collect();
//     }

//     // only roomType
//     if (args.roomType) {
//       return await ctx.db
//         .query("housePost")
//         .withIndex("by_roomType", (q) => q.eq("roomType", args.roomType!))

//         .collect();
//     }

//     // no filters — return all house
//     return await ctx.db.query("housePost").order("desc").collect();
//   },
// });

// export const getHouseById = query({
//   args: { id: v.id("housePost") },
//   handler: async (ctx, args) => {
//     return await ctx.db.get(args.id);
//   },
// });
// export const getMyHouses = query({
//   args: {},
//   handler: async (ctx) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) return [];

//     const user = await ctx.db
//       .query("users")
//       .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
//       .unique();
//     if (!user) return [];

//     return await ctx.db
//       .query("housePost")
//       .withIndex("by_author", (q) => q.eq("authorId", user._id))
//       .order("desc")
//       .collect();
//   },
// });

// export const deleteHouse = mutation({
//   args: { id: v.id("housePost") },
//   handler: async (ctx, args) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) throw new Error("Not authenticated");

//     const user = await ctx.db
//       .query("users")
//       .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
//       .unique();
//     if (!user) throw new Error("User not found");

//     const house = await ctx.db.get(args.id);
//     if (!house) throw new Error("House not found");

//     // only the author can delete
//     if (house.authorId !== user._id) throw new Error("Not authorized");

//     // delete the cover image from storage
//     if (house.imageStorageId) {
//       await ctx.storage.delete(house.imageStorageId);
//     }

//     await ctx.db.delete(args.id);
//   },
// });

// export const toggleFavourite = mutation({
//   args: { houseId: v.id("housePost") },
//   handler: async (ctx, args) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) throw new Error("Not authenticated");

//     const userId = identity.subject;

//     const existing = await ctx.db
//       .query("favourites")
//       .withIndex("by_user_and_house", (q) =>
//         q.eq("userId", userId).eq("houseId", args.houseId),
//       )
//       .unique();

//     if (existing) {
//       await ctx.db.delete(existing._id);
//       return false; // unliked
//     } else {
//       await ctx.db.insert("favourites", { userId, houseId: args.houseId });
//       return true; // liked
//     }
//   },
// });

// // export const getFavourites = query({
// //   args: {},
// //   handler: async (ctx) => {
// //     const identity = await ctx.auth.getUserIdentity();
// //     if (!identity) return [];

// //     const userId = identity.subject;

// //     const favs = await ctx.db
// //       .query("favourites")
// //       .withIndex("by_user", (q) => q.eq("userId", userId))
// //       .collect();

// //     // get the full house data for each favourite
// //     const houses = await Promise.all(
// //       favs.map((fav) => ctx.db.get(fav.houseId)),
// //     );

// //     return houses.filter(Boolean);
// //   },
// // });

// // export const isFavourited = query({
// //   args: { houseId: v.id("housePost") },
// //   handler: async (ctx, args) => {
// //     const identity = await ctx.auth.getUserIdentity();
// //     if (!identity) return false;

// //     const existing = await ctx.db
// //       .query("favourites")
// //       .withIndex("by_user_and_house", (q) =>
// //         q.eq("userId", identity.subject).eq("houseId", args.houseId),
// //       )
// //       .unique();

// //     return !!existing;
// //   },
// // });

// // ```

// // On the frontend it would just be two dropdowns:
// // ```;
// // Location: [All] [Owa-Alero] [Alihame] [Owo-Yibo]
// // Room Type: [All] [Bed Sitter] [Single Room] [Room & Parlor]

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

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
    price: v.number(),
    contactPhone: v.string(),
    location: v.union(
      v.literal("Alihame"),
      v.literal("Owa-Alero"),
      v.literal("Owo-Oyibu"),
      v.literal("Owa-Ekei"),
      v.literal("Agbor-Obi"),
      v.literal("Boji-Boji"),
      v.literal("Aliokpu"),
    ),
    roomType: v.union(
      v.literal("Bed-Sitter"),
      v.literal("Single-Room"),
      v.literal("Room_and_Parlor"),
    ),
    propertyType: v.union(v.literal("Bungalow"), v.literal("Story-Building")),
    amenities: v.array(
      v.union(
        v.literal("Bed"),
        v.literal("Wardrobe"),
        v.literal("Cupboard"),
        v.literal("Kitchen-Cabinet"),
        v.literal("Sofa"),
      ),
    ),
    imageStorageId: v.id("_storage"),
    extraStorageIds: v.optional(v.array(v.id("_storage"))),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    const imageUrl = await ctx.storage.getUrl(args.imageStorageId);
    if (!imageUrl) throw new Error("Failed to get image URL");

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
      authorUsername: user.username,
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

// ✅ paginated version
export const getHouses = query({
  args: {
    paginationOpts: paginationOptsValidator,
    location: v.optional(
      v.union(
        v.literal("Alihame"),
        v.literal("Owa-Alero"),
        v.literal("Owo-Oyibu"),
        v.literal("Owa-Ekei"),
        v.literal("Agbor-Obi"),
        v.literal("Boji-Boji"),
        v.literal("Aliokpu"),
      ),
    ),
    roomType: v.optional(
      v.union(
        v.literal("Bed-Sitter"),
        v.literal("Single-Room"),
        v.literal("Room_and_Parlor"),
      ),
    ),
  },
  handler: async (ctx, args) => {
    if (args.location && args.roomType) {
      return await ctx.db
        .query("housePost")
        .withIndex("by_location_and_roomType", (q) =>
          q.eq("location", args.location!).eq("roomType", args.roomType!),
        )
        .order("desc")
        .paginate(args.paginationOpts);
    }
    if (args.location) {
      return await ctx.db
        .query("housePost")
        .withIndex("by_location", (q) => q.eq("location", args.location!))
        .order("desc")
        .paginate(args.paginationOpts);
    }
    if (args.roomType) {
      return await ctx.db
        .query("housePost")
        .withIndex("by_roomType", (q) => q.eq("roomType", args.roomType!))
        .order("desc")
        .paginate(args.paginationOpts);
    }

    return await ctx.db
      .query("housePost")
      .order("desc")
      .paginate(args.paginationOpts);
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

export const deleteHouse = mutation({
  args: { id: v.id("housePost") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    const house = await ctx.db.get(args.id);
    if (!house) throw new Error("House not found");

    if (house.authorId !== user._id) throw new Error("Not authorized");

    if (house.imageStorageId) {
      await ctx.storage.delete(house.imageStorageId);
    }

    await ctx.db.delete(args.id);
  },
});
