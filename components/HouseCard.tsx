// import React from "react";

// type HouseCardProps = {
//   _id: string;
//   title: string;
//   price: number;
//   location: string;
//   roomType: string;
//   propertyType: string;
//   amenities: string[];
//   authorName: string;
//   authorImage: string;
//   imageUrl: string; // 👈 add
//   isAvailable: boolean; // 👈 add
// };

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

// const HouseCard = ({
//   title,
//   price,
//   location,
//   roomType,
//   propertyType,
//   amenities,
//   authorName,
//   authorImage,
//   imageUrl,
//   isAvailable,
// }: HouseCardProps) => {
//   return (
//     <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition">
//       {/* Image */}
//       <div className="relative h-48">
//         <img
//           src={imageUrl}
//           alt={title}
//           className="w-full h-full object-cover"
//         />
//         <span
//           className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full text-white font-semibold ${
//             isAvailable ? "bg-green-500" : "bg-red-500"
//           }`}
//         >
//           {isAvailable ? "Available" : "Taken"}
//         </span>
//       </div>

//       {/* Details */}
//       <div className="p-4">
//         <h3 className="font-bold text-lg">{title}</h3>
//         <p>Location: {location.replace("-", " ")}</p>
//         <p>Room type: {roomType.replaceAll("_", " ")}</p>
//         <p>Property type: {PROPERTY_LABELS[propertyType]}</p>
//         <p className="font-bold text-amber-800">₦{price.toLocaleString()}/yr</p>

//         <div className="mt-2 text-sm text-gray-500">
//           Amenities:{" "}
//           {amenities
//             .slice(0, 3)
//             .map((a) => AMENITY_LABELS[a])
//             .join(", ")}
//           {amenities.length > 3 && ` +${amenities.length - 3} more`}
//         </div>

//         {/* Author */}
//         <div className="flex items-center gap-2 mt-3 pt-3 border-t">
//           <img
//             src={authorImage}
//             alt={authorName}
//             className="w-6 h-6 rounded-full object-cover"
//           />
//           <span className="text-sm text-gray-500">{authorName}</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HouseCard;

// import React from "react";
// import { MapPin, BedDouble } from "lucide-react";

// type HouseCardProps = {
//   _id: string;
//   title: string;
//   price: number;
//   location: string;
//   roomType: string;
//   propertyType: string;
//   amenities: string[];
//   authorName: string;
//   authorImage: string;
//   imageUrl: string;
//   isAvailable: boolean;
// };

// const HouseCard = ({
//   title,
//   price,
//   location,
//   roomType,
//   imageUrl,
//   isAvailable,
// }: HouseCardProps) => {
//   return (
//     <div className="rounded-2xl overflow-hidden  bg-white cursor-pointer">
//       {/* Image */}
//       <div className="relative h-56 overflow-hidden">
//         <img
//           src={imageUrl}
//           alt={title}
//           className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
//         />
//         <span className="absolute top-3 left-3 bg-white text-black text-xs font-semibold px-3 py-1 rounded-full shadow">
//           {isAvailable ? "Available" : "Taken"}
//         </span>
//       </div>

//       {/* Details */}
//       <div className="p-4">
//         {/* room type + location row */}
//         <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
//           <span className="flex items-center gap-1">
//             <BedDouble className="w-4 h-4" />
//             {roomType.replaceAll("_", " ")}
//           </span>
//           <span>·</span>
//           <span className="flex items-center gap-1">
//             <MapPin className="w-4 h-4" />
//             {location.replaceAll("-", " ")}
//           </span>
//         </div>

//         {/* Title */}
//         <h3 className="font-bold text-lg leading-snug">{title}</h3>

//         {/* Price + location */}
//         <div className="flex items-center gap-2 mt-1">
//           <span className="font-bold text-base">₦{price.toLocaleString()}</span>
//           <span className="text-gray-400 text-sm">
//             · {location.replaceAll("-", " ")}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HouseCard;

import React from "react";
import { MapPin, BedDouble } from "lucide-react";

type HouseCardProps = {
  _id: string;
  title: string;
  price: number;
  location: string;
  roomType: string;
  propertyType: string;
  amenities: string[];
  authorName: string;
  authorImage: string;
  imageUrl: string;
  isAvailable: boolean;
};

const HouseCard = ({
  title,
  price,
  location,
  roomType,
  imageUrl,
  isAvailable,
}: HouseCardProps) => {
  return (
    <div className="rounded-xl lg:rounded-2xl overflow-hidden bg-white cursor-pointer">
      {/* Image */}
      <div className="relative lg:h-56 h-36 sm:h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-2 left-2 bg-white text-black text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full shadow">
          {isAvailable ? "Available" : "Taken"}
        </span>
      </div>

      {/* Details */}
      <div className="p-2 sm:p-4">
        {/* room type + location row */}
        <div className="flex items-center gap-1 sm:gap-2 text-[11px] sm:text-sm text-gray-500 mb-1">
          <span className="flex items-center gap-0.5 truncate">
            <BedDouble className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate capitalize">
              {roomType.replaceAll("_", " ")}
            </span>
          </span>
          <span>·</span>
          <span className="flex items-center gap-0.5 truncate">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate capitalize">
              {location.replaceAll("-", " ")}
            </span>
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-sm sm:text-base leading-snug line-clamp-1">
          {title}
        </h3>

        {/* Price */}
        <p className="font-bold text-sm sm:text-base mt-0.5">
          ₦{price.toLocaleString()}
          <span className="text-gray-400 text-xs font-normal"> /yr</span>
        </p>
      </div>
    </div>
  );
};

export default HouseCard;
