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
    <div className=" bg-white cursor-pointer">
      {/* Image */}
      <div className="relative lg:h-56 h-36 sm:h-48 overflow-hidden  rounded-xl lg:rounded-2xl ">
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
