import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    clerkId: v.string(),
    imageUrl: v.string(),
    updatedAt: v.number(),
  }).index("by_clerkId", ["clerkId"]),

  housePost: defineTable({
    title: v.string(),
    description: v.string(),
    content: v.string(),
    imageUrl: v.string(),
    authorId: v.id("users"),
    authorName: v.string(),
    authorImage: v.string(),
    imageStorageId: v.optional(v.id("_storage")),

    // Required fields
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
      v.literal("other"),
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

    isAvailable: v.boolean(),
    updatedAt: v.number(),
  })
    .index("by_author", ["authorId"])
    .index("by_location", ["location"])
    .index("by_availability", ["isAvailable"]),
});
