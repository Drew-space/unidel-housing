import React from "react";

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
  imageUrl: string; // 👈 add
  isAvailable: boolean; // 👈 add
};

const PROPERTY_LABELS: Record<string, string> = {
  fenced_compound: "Fenced Compound",
  bungalow: "Bungalow",
  story_building: "Story Building",
};

const AMENITY_LABELS: Record<string, string> = {
  bed: "🛏 Bed",
  wardrobe: "🚪 Wardrobe",
  cupboard: "🗄 Cupboard",
  kitchen_cabinet: "🍳 Kitchen Cabinet",
  sofa: "🛋 Sofa",
  dining_table: "🍽 Dining Table",
  tv_stand: "📺 TV Stand",
  curtains: "🪟 Curtains",
};

const HouseCard = ({
  title,
  price,
  location,
  roomType,
  propertyType,
  amenities,
  authorName,
  authorImage,
  imageUrl,
  isAvailable,
}: HouseCardProps) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition">
      {/* Image */}
      <div className="relative h-48">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        <span
          className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full text-white font-semibold ${
            isAvailable ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {isAvailable ? "Available" : "Taken"}
        </span>
      </div>

      {/* Details */}
      <div className="p-4">
        <h3 className="font-bold text-lg">{title}</h3>
        <p>Location: {location.replace("-", " ")}</p>
        <p>Room type: {roomType.replaceAll("_", " ")}</p>
        <p>Property type: {PROPERTY_LABELS[propertyType]}</p>
        <p className="font-bold text-amber-800">₦{price.toLocaleString()}/yr</p>

        <div className="mt-2 text-sm text-gray-500">
          Amenities:{" "}
          {amenities
            .slice(0, 3)
            .map((a) => AMENITY_LABELS[a])
            .join(", ")}
          {amenities.length > 3 && ` +${amenities.length - 3} more`}
        </div>

        {/* Author */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t">
          <img
            src={authorImage}
            alt={authorName}
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="text-sm text-gray-500">{authorName}</span>
        </div>
      </div>
    </div>
  );
};

export default HouseCard;
