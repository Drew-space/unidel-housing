// app/house/[id]/page.tsx
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";
import {
  MapPin,
  BedDouble,
  Home,
  CheckCircle,
  XCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ImageGallery from "@/components/ImageGallery";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HousePageProps {
  params: Promise<{ id: string }>;
}

const HousePage = async ({ params }: HousePageProps) => {
  const { id } = await params;

  const house = await fetchQuery(api.housePost.getHouseById, {
    id: id as Id<"housePost">,
  });

  if (!house) {
    return <p>House not found</p>;
  }

  const {
    title,
    price,
    location,
    roomType,
    propertyType,
    amenities,
    authorName,
    authorImage,
    isAvailable,
    imageUrl,
    images: imageArray,
  } = house;

  const images = imageArray?.length ? imageArray : imageUrl ? [imageUrl] : [];

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 md:px-8 mt-8">
        <div className="max-w-5xl mx-auto mb-4">
          <Link href="/">
            <Button variant={"outline"} className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              <span>Go Back</span>
            </Button>
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
          {/* Image Gallery */}
          {images.length > 0 ? (
            <ImageGallery images={images} />
          ) : (
            <div className="w-full h-64 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
              No images available
            </div>
          )}

          {/* Details */}
          <div className="md:py-4  px-4 ">
            <div className="flex items-center  mb-3 gap-3  pt-2 ">
              <img
                src={authorImage}
                alt={authorName}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <p className="text-xs text-gray-400">Listed by</p>
                <p className="text-sm font-medium text-gray-700">
                  {authorName}
                </p>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 lg:text-3xl">
              {title}
            </h2>

            {/* Availability */}
            <div className="mt-3">
              {isAvailable ? (
                <Badge className="gap-1 bg-green-100 text-green-700 hover:bg-green-100">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Available
                </Badge>
              ) : (
                <Badge className="gap-1 bg-red-100 text-red-700 hover:bg-red-100">
                  <XCircle className="h-3.5 w-3.5" />
                  Taken
                </Badge>
              )}
            </div>

            {/* Price */}
            <div className="mt-4 mb-4">
              <span className="text-2xl font-bold">
                ₦{price.toLocaleString()}
              </span>
              <span className="text-gray-400 text-sm font-normal"> /yr</span>
            </div>

            {/* Location, Room Type, Property Type */}
            <div className="flex flex-col gap-2 text-gray-500 mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="text-sm capitalize">
                  {location.replaceAll("-", " ")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <BedDouble className="h-4 w-4 shrink-0" />
                <span className="text-sm capitalize">
                  {roomType.replaceAll("_", " ")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 shrink-0" />
                <span className="text-sm capitalize">{propertyType}</span>
              </div>
            </div>

            {/* Amenities */}
            {amenities?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Features
                </h3>
                <div className="flex flex-wrap gap-2">
                  {amenities.map((amenity, index) => (
                    <Badge key={index} variant="outline" className="capitalize">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Author */}
            {/* <div className="flex items-center gap-3 mt-8 pt-6 border-t">
              <img
                src={authorImage}
                alt={authorName}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <p className="text-xs text-gray-400">Listed by</p>
                <p className="text-sm font-medium text-gray-700">
                  {authorName}
                </p>
              </div>
            </div> */}
          </div>
        </div>
      </div>
      <div className="absolute fixed bottom-2 right-2">
        <Button> contact agent</Button>
      </div>
    </div>
  );
};

export default HousePage;
