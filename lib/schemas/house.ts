// import { z } from "zod";

// export const houseSchema = z.object({
//   title: z.string().min(3, "Title must be at least 3 characters"),
//   description: z.string().min(10, "Description must be at least 10 characters"),
//   content: z.string().min(20, "Full details must be at least 20 characters"),
//   price: z.coerce
//     .number({ invalid_type_error: "Price must be a number" })
//     .positive("Price must be greater than 0"),
//   contactPhone: z
//     .string()
//     .min(10, "Phone number must be at least 10 digits")
//     .regex(/^[0-9+\s\-()]+$/, "Invalid phone number"),
//   location: z.enum(["owa-alero", "alihame", "owo-yibo"], {
//     required_error: "Please select a location",
//   }),
//   roomType: z.enum(["bed_sitter", "single_room", "room_and_parlor"], {
//     required_error: "Please select a room type",
//   }),
//   propertyType: z.enum(["fenced_compound", "bungalow", "story_building"], {
//     required_error: "Please select a property type",
//   }),
//   amenities: z
//     .array(
//       z.enum([
//         "bed",
//         "wardrobe",
//         "cupboard",
//         "kitchen_cabinet",
//         "sofa",
//         "dining_table",
//         "tv_stand",
//         "curtains",
//       ]),
//     )
//     .optional()
//     .default([]),
// });

// export type HouseFormValues = z.infer<typeof houseSchema>;
