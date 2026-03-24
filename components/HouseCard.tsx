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
//   imageUrl?: string;
// };

// const HouseCard = ({
//   title,
//   price,
//   location,
//   roomType,
//   imageUrl,
// }: HouseCardProps) => {
//   return (
//     <div className=" bg-white cursor-pointer">
//       {/* Image */}
//       <div className="relative lg:h-56 h-36 sm:h-48 overflow-hidden  rounded-xl lg:rounded-2xl ">
//         <img
//           src={imageUrl}
//           alt={title}
//           className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
//         />
//       </div>

//       {/* Details */}
//       <div className="p-2  sm:p-4">
//         {/* room type + location row */}
//         <div className="flex items-center gap-1 sm:gap-2 text-[11px] sm:text-sm text-gray-500 mb-1">
//           <span className="flex items-center gap-0.5 truncate">
//             <BedDouble className="  text-blue-500/95 w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
//             <span className="truncate capitalize font-sans">
//               {roomType.replaceAll("_", " ")}
//             </span>
//           </span>
//           <span>·</span>
//           <span className="flex items-center gap-0.5 truncate">
//             <MapPin className=" text-green-600 w-3 h-3 sm:w-4 sm:h-4 shrink-0 " />
//             <span className="truncate capitalize">
//               {location.replaceAll("-", " ")}
//             </span>
//           </span>
//         </div>

//         {/* Title */}
//         <h3 className=" font-mona text-sm sm:text-base leading-snug line-clamp-1">
//           {title}
//         </h3>

//         {/* Price */}
//         <p className="font-bold text-slate-900/90 text-sm sm:text-base mt-0.5">
//           ₦{price.toLocaleString()}
//           <span className="text-gray-400 text-xs font-normal"> /yr</span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default HouseCard;

// "use client";

// import React, { useState } from "react";
// import { MapPin, BedDouble, Trash2, Heart } from "lucide-react";
// import { useAuth } from "@clerk/nextjs";

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
//   authorId: string; // ← add this
//   imageUrl?: string;
//   isAdmin?: boolean; // ← add this
//   onDelete?: (id: string) => void; // ← add this
// };

// const HouseCard = ({
//   _id,
//   title,
//   price,
//   location,
//   roomType,
//   imageUrl,
//   authorId,
//   isAdmin,
//   onDelete,
// }: HouseCardProps) => {
//   const { isSignedIn, userId } = useAuth();
//   const [liked, setLiked] = useState(false);

//   const canDelete = isSignedIn && isAdmin && userId === authorId;

//   return (
//     <div className="bg-white cursor-pointer">
//       {/* Image */}
//       <div className="relative lg:h-56 h-36 sm:h-48 overflow-hidden rounded-xl lg:rounded-2xl">
//         <img
//           src={imageUrl}
//           alt={title}
//           className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
//         />

//         {/* Delete button — top left */}
//         {canDelete && (
//           <button
//             onClick={(e) => {
//               e.preventDefault(); // prevent Link navigation
//               onDelete?.(_id);
//             }}
//             className="absolute top-2 left-2 bg-white/80 hover:bg-red-500 hover:text-white text-red-500 rounded-full p-1.5 transition-colors shadow"
//           >
//             <Trash2 className="w-3.5 h-3.5" />
//           </button>
//         )}

//         {/* Heart button — top right */}
//         <button
//           onClick={(e) => {
//             e.preventDefault();
//             setLiked((prev) => !prev);
//           }}
//           className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1.5 transition-colors shadow"
//         >
//           <Heart
//             className={`w-3.5 h-3.5 transition-colors ${
//               liked ? "fill-red-500 text-red-500" : "text-gray-400"
//             }`}
//           />
//         </button>
//       </div>

//       {/* Details */}
//       <div className="p-2 sm:p-4">
//         <div className="flex items-center gap-1 sm:gap-2 text-[11px] sm:text-sm text-gray-500 mb-1">
//           <span className="flex items-center gap-0.5 truncate">
//             <BedDouble className="text-blue-500/95 w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
//             <span className="truncate capitalize font-sans">
//               {roomType.replaceAll("_", " ")}
//             </span>
//           </span>
//           <span>·</span>
//           <span className="flex items-center gap-0.5 truncate">
//             <MapPin className="text-green-600 w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
//             <span className="truncate capitalize">
//               {location.replaceAll("-", " ")}
//             </span>
//           </span>
//         </div>

//         <h3 className="font-mona text-sm sm:text-base leading-snug line-clamp-1">
//           {title}
//         </h3>

//         <p className="font-bold text-slate-900/90 text-sm sm:text-base mt-0.5">
//           ₦{price.toLocaleString()}
//           <span className="text-gray-400 text-xs font-normal"> /yr</span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default HouseCard;

"use client";

import React, { useState } from "react";
import { MapPin, BedDouble, Trash2, Heart } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { Id } from "@/convex/_generated/dataModel";

type HouseCardProps = {
  _id: Id<"housePost">;
  title: string;
  price: number;
  location: string;
  roomType: string;
  propertyType: string;
  amenities: string[];
  authorName: string;
  authorImage: string;
  authorId: Id<"users">;
  imageUrl?: string;
  onDelete?: (id: Id<"housePost">) => void;
};

const HouseCard = ({
  _id,
  title,
  price,
  location,
  roomType,
  imageUrl,
  authorId,
  onDelete,
}: HouseCardProps) => {
  const { user, isSignedIn } = useUser();
  const [liked, setLiked] = useState(false);

  const role = user?.publicMetadata?.role;
  const isAdmin = role === "agent";
  const isAuthor = user?.id === authorId; // clerk userId vs convex authorId won't match directly — see note below

  const canDelete = isSignedIn && (isAdmin || isAuthor);

  return (
    <div className="bg-white cursor-pointer">
      <div className="relative lg:h-56 h-36 sm:h-48 overflow-hidden rounded-xl lg:rounded-2xl">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />

        {canDelete && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete?.(_id);
            }}
            className="absolute top-2 left-2 bg-white/80 hover:bg-red-500 hover:text-white text-red-500 rounded-full p-1.5 transition-colors shadow"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            setLiked((prev) => !prev);
          }}
          className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1.5 transition-colors shadow"
        >
          <Heart
            className={`w-3.5 h-3.5 transition-colors ${
              liked ? "fill-red-500 text-red-500" : "text-gray-400"
            }`}
          />
        </button>
      </div>

      <div className="p-2 sm:p-4">
        <div className="flex items-center gap-1 sm:gap-2 text-[11px] sm:text-sm text-gray-500 mb-1">
          <span className="flex items-center gap-0.5 truncate">
            <BedDouble className="text-blue-500/95 w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate capitalize font-sans">
              {roomType.replaceAll("_", " ")}
            </span>
          </span>
          <span>·</span>
          <span className="flex items-center gap-0.5 truncate">
            <MapPin className="text-green-600 w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate capitalize">
              {location.replaceAll("-", " ")}
            </span>
          </span>
        </div>

        <h3 className="font-mona text-sm sm:text-base leading-snug line-clamp-1">
          {title}
        </h3>

        <p className="font-bold text-slate-900/90 text-sm sm:text-base mt-0.5">
          ₦{price.toLocaleString()}
          <span className="text-gray-400 text-xs font-normal"> /yr</span>
        </p>
      </div>
    </div>
  );
};

export default HouseCard;
