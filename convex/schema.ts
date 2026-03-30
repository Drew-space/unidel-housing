import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    username: v.string(),
    clerkId: v.string(),
    imageUrl: v.string(),
    updatedAt: v.number(),
  }).index("by_clerkId", ["clerkId"]),

  housePost: defineTable({
    title: v.string(),
    description: v.string(),
    authorUsername: v.string(),

    imageUrl: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    authorId: v.id("users"),
    authorName: v.string(),
    authorImage: v.string(),
    imageStorageId: v.optional(v.id("_storage")),

    // Required fields
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

    updatedAt: v.number(),
  })
    .index("by_author", ["authorId"])
    .index("by_location", ["location"])
    .index("by_roomType", ["roomType"])
    .index("by_location_and_roomType", ["location", "roomType"]), // combined filter

  favourites: defineTable({
    userId: v.string(), // clerk user id
    houseId: v.id("housePost"),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_house", ["userId", "houseId"]),
});

// bunx convex import --table housePost seed.json
// bunx convex import --table housePost seed.json --replace
