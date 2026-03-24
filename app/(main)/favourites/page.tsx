"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Heart, MapPin, BedDouble } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

export default function FavouritesPage() {
  const houses = useQuery(api.favourites.getFavourites);
  const toggleFavourite = useMutation(api.favourites.toggleFavourite);

  if (houses === undefined) {
    return (
      <div className="container mx-auto max-sm:px-4 mt-10">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-gray-100 animate-pulse h-56"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-sm:px-4 mt-10">
      <div className="mb-8">
        <h1 className="font-mona text-3xl font-bold">Saved homes</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {houses.length} {houses.length === 1 ? "listing" : "listings"} saved
        </p>
      </div>

      {houses.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 mt-24 text-center">
          <div className="bg-red-50 rounded-full p-6">
            <Heart className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="font-mona font-semibold text-xl">
            No saved homes yet
          </h2>
          <p className="text-muted-foreground text-sm max-w-xs">
            Tap the heart on any listing to save it here for later.
          </p>
          <Link
            href="/"
            className="mt-2 text-sm font-medium text-[#7c3aed] underline underline-offset-4"
          >
            Browse listings
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {houses.map((house) => (
            <div key={house!._id} className="relative">
              <Link href={`/house/${house!._id}`}>
                <div className="bg-white cursor-pointer">
                  <div className="relative lg:h-56 h-36 sm:h-48 overflow-hidden rounded-xl lg:rounded-2xl">
                    <img
                      src={house!.imageUrl}
                      alt={house!.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    {/* unfavourite button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavourite({
                          houseId: house!._id as Id<"housePost">,
                        });
                      }}
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow transition-colors"
                    >
                      <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                    </button>
                  </div>

                  <div className="p-2 sm:p-4">
                    <div className="flex items-center gap-1 sm:gap-2 text-[11px] sm:text-sm text-gray-500 mb-1">
                      <span className="flex items-center gap-0.5 truncate">
                        <BedDouble className="text-blue-500/95 w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                        <span className="truncate capitalize font-sans">
                          {house!.roomType.replaceAll("_", " ")}
                        </span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5 truncate">
                        <MapPin className="text-green-600 w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                        <span className="truncate capitalize">
                          {house!.location.replaceAll("-", " ")}
                        </span>
                      </span>
                    </div>

                    <h3 className="font-mona text-sm sm:text-base leading-snug line-clamp-1">
                      {house!.title}
                    </h3>

                    <p className="font-bold text-slate-900/90 text-sm sm:text-base mt-0.5">
                      ₦{house!.price.toLocaleString()}
                      <span className="text-gray-400 text-xs font-normal">
                        {" "}
                        /yr
                      </span>
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
