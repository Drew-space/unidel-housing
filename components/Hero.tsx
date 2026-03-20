"use client";

import React, { useState } from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "./ui/combobox";
import { Button } from "./ui/button";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import HouseCard from "./HouseCard";

type Location = "owa-alero" | "alihame" | "owo-yibo";
type RoomType = "bed_sitter" | "single_room" | "room_and_parlor";

const Hero = () => {
  const [location, setLocation] = useState<Location | undefined>();
  const [roomType, setRoomType] = useState<RoomType | undefined>();

  const houses = useQuery(api.housePost.getHouses, {
    location,
    roomType,
  });

  const LOCATIONS: { value: Location; label: string }[] = [
    { value: "owa-alero", label: "Owa-Alero" },
    { value: "alihame", label: "Alihame" },
    { value: "owo-yibo", label: "Owo-Yibo" },
  ];

  const ROOM_TYPES: { value: RoomType; label: string }[] = [
    { value: "bed_sitter", label: "Bed Sitter" },
    { value: "single_room", label: "Single Room" },
    { value: "room_and_parlor", label: "Room & Parlor" },
  ];
  return (
    <section className="mx-auto container max-sm:px-4">
      <div className="mt-14 ">
        <p className="text-amber-950/90">Student Housing Made Easy</p>
        <h1 className="md:text-5xl text-3xl font-bold">
          Find your perfect
          <br /> hostel near campus
        </h1>
      </div>

      {/* search inputs */}
      <div className="flex flex-col md:flex-row gap-4 mt-6 ">
        <div className="">
          <Combobox items={LOCATIONS}>
            <ComboboxInput placeholder="Location" />
            <ComboboxContent>
              <ComboboxEmpty>No items found.</ComboboxEmpty>
              <ComboboxList>
                {LOCATIONS.map((item, index) => (
                  <ComboboxItem key={index} value={item}>
                    {item.label}
                  </ComboboxItem>
                ))}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
        {/*  */}
        <div className="">
          <Combobox items={ROOM_TYPES}>
            <ComboboxInput placeholder="Room type" />
            <ComboboxContent>
              <ComboboxEmpty>No items found.</ComboboxEmpty>
              <ComboboxList>
                {ROOM_TYPES.map((item, index) => (
                  <ComboboxItem key={index} value={item}>
                    {item.label}
                  </ComboboxItem>
                ))}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
        <Button variant="outline">Clear</Button>
      </div>

      <HouseCard />
    </section>
  );
};

export default Hero;

// "use client";

// import { useQuery } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { useState } from "react";
// import Link from "next/link";

// type Location = "owa-alero" | "alihame" | "owo-yibo";
// type RoomType = "bed_sitter" | "single_room" | "room_and_parlor";

// const LOCATIONS: { value: Location; label: string }[] = [
//   { value: "owa-alero", label: "Owa-Alero" },
//   { value: "alihame", label: "Alihame" },
//   { value: "owo-yibo", label: "Owo-Yibo" },
// ];

// const ROOM_TYPES: { value: RoomType; label: string }[] = [
//   { value: "bed_sitter", label: "Bed Sitter" },
//   { value: "single_room", label: "Single Room" },
//   { value: "room_and_parlor", label: "Room & Parlor" },
// ];

// const PROPERTY_LABELS: Record<string, string> = {
//   fenced_compound: "Fenced Compound",
//   bungalow: "Bungalow",
//   story_building: "Story Building",
// };

// const AMENITY_LABELS: Record<string, string> = {
//   bed: "🛏 Bed",
//   wardrobe: "🚪 Wardrobe",
//   cupboard: "🗄 Cupboard",
//   kitchen_cabinet: "🍳 Kitchen Cabinet",
//   sofa: "🛋 Sofa",
//   dining_table: "🍽 Dining Table",
//   tv_stand: "📺 TV Stand",
//   curtains: "🪟 Curtains",
// };

// export default function Hero() {
//   const [location, setLocation] = useState<Location | undefined>();
//   const [roomType, setRoomType] = useState<RoomType | undefined>();

//   const houses = useQuery(api.housePost.getHouses, {
//     location,
//     roomType,
//   });

//   return (
//     <div className="min-h-screen bg-[#faf7f2] font-['Georgia',serif]">
//       {/* Hero Section */}
//       <section className="relative overflow-hidden bg-[#1a1a2e] text-white">
//         {/* Background texture */}
//         <div
//           className="absolute inset-0 opacity-10"
//           style={{
//             backgroundImage: `radial-gradient(circle at 20% 50%, #c9a84c 0%, transparent 50%),
//                               radial-gradient(circle at 80% 20%, #c9a84c 0%, transparent 40%)`,
//           }}
//         />
//         <div className="relative container mx-auto px-6 py-20 md:py-28">
//           <p className="text-[#c9a84c] text-sm tracking-[0.3em] uppercase mb-4 font-sans">
//             Student Housing Made Easy
//           </p>
//           <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
//             Find your perfect
//             <br />
//             <span className="text-[#c9a84c]">hostel</span> near campus
//           </h1>
//           <p className="text-white/60 text-lg max-w-xl mb-10 font-sans font-light">
//             Verified student accommodations in Owa-Alero, Alihame and Owo-Yibo.
//             Filter by location and room type to find your ideal home.
//           </p>

//           {/* Filter Bar */}
//           <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
//             <select
//               value={location ?? ""}
//               onChange={(e) =>
//                 setLocation((e.target.value as Location) || undefined)
//               }
//               className="flex-1 bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 font-sans text-sm focus:outline-none focus:border-[#c9a84c] transition-colors"
//             >
//               <option value="">All Locations</option>
//               {LOCATIONS.map((l) => (
//                 <option key={l.value} value={l.value} className="text-black">
//                   {l.label}
//                 </option>
//               ))}
//             </select>

//             <select
//               value={roomType ?? ""}
//               onChange={(e) =>
//                 setRoomType((e.target.value as RoomType) || undefined)
//               }
//               className="flex-1 bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 font-sans text-sm focus:outline-none focus:border-[#c9a84c] transition-colors"
//             >
//               <option value="">All Room Types</option>
//               {ROOM_TYPES.map((r) => (
//                 <option key={r.value} value={r.value} className="text-black">
//                   {r.label}
//                 </option>
//               ))}
//             </select>

//             {(location || roomType) && (
//               <button
//                 onClick={() => {
//                   setLocation(undefined);
//                   setRoomType(undefined);
//                 }}
//                 className="px-5 py-3 border border-white/30 rounded-lg text-white/70 hover:text-white hover:border-white/60 font-sans text-sm transition-colors"
//               >
//                 Clear
//               </button>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* Listings Section */}
//       <section className="container mx-auto px-6 py-14">
//         <div className="flex items-center justify-between mb-8">
//           <h2 className="text-2xl font-bold text-[#1a1a2e]">
//             {location || roomType ? "Filtered Results" : "Available Listings"}
//           </h2>
//           <span className="text-sm text-gray-500 font-sans">
//             {houses === undefined
//               ? "Loading..."
//               : `${houses.length} listing${houses.length !== 1 ? "s" : ""} found`}
//           </span>
//         </div>

//         {/* Loading */}
//         {houses === undefined && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {[...Array(6)].map((_, i) => (
//               <div
//                 key={i}
//                 className="bg-white rounded-2xl overflow-hidden animate-pulse"
//               >
//                 <div className="h-52 bg-gray-200" />
//                 <div className="p-5 space-y-3">
//                   <div className="h-4 bg-gray-200 rounded w-3/4" />
//                   <div className="h-3 bg-gray-100 rounded w-1/2" />
//                   <div className="h-3 bg-gray-100 rounded w-full" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Empty state */}
//         {houses !== undefined && houses.length === 0 && (
//           <div className="text-center py-24">
//             <p className="text-5xl mb-4">🏠</p>
//             <h3 className="text-xl font-bold text-[#1a1a2e] mb-2">
//               No listings found
//             </h3>
//             <p className="text-gray-500 font-sans text-sm">
//               Try changing your filters to see more results.
//             </p>
//           </div>
//         )}

//         {/* House Cards */}
//         {houses !== undefined && houses.length > 0 && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {houses.map((house) => (
//               <Link
//                 href={`/houses/${house._id}`}
//                 key={house._id}
//                 className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
//               >
//                 {/* Image */}
//                 <div className="relative h-52 overflow-hidden">
//                   <img
//                     src={house.imageUrl}
//                     alt={house.title}
//                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                   />
//                   {/* Availability badge */}
//                   <div
//                     className={`absolute top-3 right-3 text-xs font-sans font-semibold px-3 py-1 rounded-full ${
//                       house.isAvailable
//                         ? "bg-green-500 text-white"
//                         : "bg-red-500 text-white"
//                     }`}
//                   >
//                     {house.isAvailable ? "Available" : "Taken"}
//                   </div>
//                   {/* Location badge */}
//                   <div className="absolute top-3 left-3 bg-[#1a1a2e]/80 text-white text-xs font-sans px-3 py-1 rounded-full capitalize">
//                     {house.location.replace("-", " ")}
//                   </div>
//                 </div>

//                 {/* Content */}
//                 <div className="p-5">
//                   <div className="flex items-start justify-between gap-2 mb-2">
//                     <h3 className="font-bold text-[#1a1a2e] text-base leading-snug group-hover:text-[#c9a84c] transition-colors">
//                       {house.title}
//                     </h3>
//                   </div>

//                   <p className="text-gray-500 text-sm font-sans line-clamp-2 mb-4">
//                     {house.description}
//                   </p>

//                   {/* Tags */}
//                   <div className="flex flex-wrap gap-2 mb-4">
//                     <span className="text-xs bg-[#faf7f2] border border-[#e8e0d0] text-[#1a1a2e] px-2 py-1 rounded-md font-sans capitalize">
//                       {house.roomType.replace("_", " ")}
//                     </span>
//                     <span className="text-xs bg-[#faf7f2] border border-[#e8e0d0] text-[#1a1a2e] px-2 py-1 rounded-md font-sans">
//                       {PROPERTY_LABELS[house.propertyType]}
//                     </span>
//                   </div>

//                   {/* Amenities */}
//                   <div className="flex flex-wrap gap-1 mb-4">
//                     {house.amenities.slice(0, 3).map((a) => (
//                       <span
//                         key={a}
//                         className="text-xs text-gray-500 font-sans bg-gray-50 px-2 py-0.5 rounded"
//                       >
//                         {AMENITY_LABELS[a]}
//                       </span>
//                     ))}
//                     {house.amenities.length > 3 && (
//                       <span className="text-xs text-gray-400 font-sans px-2 py-0.5">
//                         +{house.amenities.length - 3} more
//                       </span>
//                     )}
//                   </div>

//                   {/* Footer */}
//                   <div className="flex items-center justify-between pt-4 border-t border-gray-100">
//                     <p className="text-[#c9a84c] font-bold text-lg">
//                       ₦{house.price.toLocaleString()}
//                       <span className="text-gray-400 text-xs font-sans font-normal">
//                         /yr
//                       </span>
//                     </p>
//                     <div className="flex items-center gap-2">
//                       <img
//                         src={house.authorImage}
//                         alt={house.authorName}
//                         className="w-6 h-6 rounded-full object-cover"
//                       />
//                       <span className="text-xs text-gray-500 font-sans">
//                         {house.authorName}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         )}
//       </section>
//     </div>
//   );
// }
