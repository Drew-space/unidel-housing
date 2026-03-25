import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";
import { MapPin, BedDouble, Home, ArrowLeft } from "lucide-react";
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
    _id,
    title,
    price,
    authorUsername,

    location,
    roomType,
    propertyType,
    amenities,
    authorName,
    authorImage,
    description,

    contactPhone,
    imageUrl,
    images: imageArray,
  } = house;

  const images = imageArray?.length ? imageArray : imageUrl ? [imageUrl] : [];
  // bg-[#7c3aed]
  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-4xl px-4 md:px-8 mt-8 pb-24">
        {/* Back button */}
        <div className="mb-4">
          <Link href="/">
            <Button
              variant="outline"
              className="text-white bg-[#7c3aed] flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          </Link>
        </div>

        {/* Image carousel — full width */}
        {images.length > 0 ? (
          <ImageGallery images={images} />
        ) : (
          <div className="w-full h-72 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
            No images available
          </div>
        )}

        {/* All details below image */}
        <div className="mt-8 flex flex-col gap-6">
          {/* Author */}
          <div className="flex items-center gap-3">
            <img
              src={authorImage}
              alt={authorName}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <p className="text-xs text-gray-400">Listed by</p>
              <p className="text-sm font-medium text-gray-700">
                {authorUsername}
              </p>
            </div>
          </div>

          {/* Title + Price */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {title}
            </h1>
            <div className="mt-2">
              <span className="text-2xl font-bold">
                ₦{price.toLocaleString()}
              </span>
              <span className="text-gray-400 text-sm font-normal"> /yr</span>
            </div>
          </div>

          {/* Location, Room type, Property type */}
          <div className="flex flex-wrap gap-4 text-gray-500">
            <div className="flex items-center gap-2">
              <MapPin className=" text-green-600 h-4 w-4 shrink-0" />
              <span className="text-sm capitalize">
                {location.replaceAll("-", " ")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BedDouble className=" text-blue-600 h-4 w-4 shrink-0" />
              <span className="text-sm capitalize">
                {roomType.replaceAll("_", " ")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Home className="text-red-500 h-4 w-4 shrink-0" />
              <span className="text-sm capitalize">
                {propertyType.replaceAll("_", " ")}
              </span>
            </div>
          </div>

          {/* Description */}
          {description && (
            <div>
              <h2 className="text-sm font-semibold text-blue-400 mb-1">
                About
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {description}
              </p>
            </div>
          )}

          {/* Full details */}
          {/* {content && (
            <div>
              <h2 className="text-sm font-semibold  mb-1">Full details</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{content}</p>
            </div>
          )} */}

          {/* Amenities */}
          {amenities?.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-2">
                Features
              </h2>
              <div className="flex flex-wrap gap-2">
                {amenities.map((amenity, index) => (
                  <Badge key={index} variant="outline" className="capitalize">
                    {amenity.replaceAll("_", " ")}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Contact */}
          {/* <div className="pt-4 border-t">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">
              Contact landlord
            </h2>
            <a href={`tel:${contactPhone}`}>
              <Button className="w-full sm:w-auto">
                📞 Call {contactPhone}
              </Button>
            </a>
          </div> */}
        </div>
      </div>

      {/* WhatsApp FAB */}
      <a
        href={`https://wa.me/${contactPhone.replace(/^0/, "234")}?text=${encodeURIComponent(
          `Hi, my name is ....... and I'm interested in this listing: ${title}\n\nhttps://ruum-nine.vercel.app/house/${house._id}`,
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="animate-bounce fixed bottom-4 right-6 rounded-full shadow-lg"
      >
        <img
          src="/whatsapp.svg"
          alt="Chat on WhatsApp"
          className="h-12 w-12 rounded-full"
        />
      </a>
    </div>
  );
};

export default HousePage;
