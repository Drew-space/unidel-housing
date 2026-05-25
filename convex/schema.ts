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
    role: v.optional(
      v.union(v.literal("user"), v.literal("agent"), v.literal("admin")),
    ),
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
    .index("by_location_and_roomType", ["location", "roomType"]),

  favourites: defineTable({
    userId: v.string(),
    houseId: v.id("housePost"),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_house", ["userId", "houseId"]),

  // ── KYC ──────────────────────────────────────────────────────────────
  kycSubmissions: defineTable({
    userId: v.id("users"),
    clerkId: v.string(),

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

    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
    ),
    rejectionReason: v.optional(v.string()),
    reviewedAt: v.optional(v.number()),
    reviewedBy: v.optional(v.id("users")),

    submittedAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_clerkId", ["clerkId"])
    .index("by_status", ["status"]),

  // ── Agent Reviews ─────────────────────────────────────────────────────
  agentReviews: defineTable({
    agentId: v.id("users"),
    reviewerId: v.id("users"),
    reviewerName: v.string(),
    reviewerImage: v.string(),

    rating: v.number(),
    comment: v.string(),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_agent", ["agentId"])
    .index("by_reviewer", ["reviewerId"])
    .index("by_agent_and_reviewer", ["agentId", "reviewerId"]),

  // agent report

  agentReports: defineTable({
    agentId: v.id("users"),
    reporterName: v.string(),
    reporterEmail: v.string(),
    reporterPhone: v.string(),
    reason: v.string(),
    createdAt: v.number(),
  }).index("by_agent", ["agentId"]),

  // ── Notifications ─────────────────────────────────────────────────────
  notifications: defineTable({
    userId: v.id("users"),
    type: v.union(
      v.literal("kyc_approved"),
      v.literal("kyc_rejected"),
      v.literal("new_review"),
    ),
    message: v.string(),
    read: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_read", ["userId", "read"]),
});
