"use client";
import { useQuery } from "convex/react";
import { UserAvatar, useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import HouseCard from "@/components/HouseCard";
import { ImageOff } from "lucide-react";

export default function DashboardPage() {
  const { user } = useUser();
  const houses = useQuery(api.housePost.getMyHouses);

  return (
    <section className="mx-auto container max-sm:px-4">
      {/* Header */}
      <div>
        <div className=" flex items-center justify-between">
          <img
            src={user?.imageUrl || "/default-avatar.png"}
            alt={user?.username ?? user?.firstName ?? "User"}
            className="w-12 h-12 rounded-full object-cover"
          />
        </div>
        <div className="flex justify-between  items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold font-mona">
              Hey {user?.username ?? user?.firstName ?? "there"}{" "}
            </h1>
            <span className=" text-[10px] mt-2 bg-purple-400 text-white  rounded-sm px-2">
              Agent
            </span>
          </div>
          <div>
            <Link href="/dashboard/create-listing" className={buttonVariants()}>
              + Add listing
            </Link>
          </div>
        </div>
      </div>

      {/* Loading */}
      {houses === undefined && (
        <p className="text-muted-foreground text-sm mt-8">
          Loading your listings...
        </p>
      )}

      {/* Empty state */}
      {houses?.length === 0 && (
        <div className="mt-8">
          <p className="text-muted-foreground text-sm">
            You haven&apos;t posted any listings yet.
            <Link
              href="/dashboard/create-listing"
              className="underline text-foreground font-medium"
            >
              Create your first one.
            </Link>
          </p>
        </div>
      )}

      {/* Grid */}
      {houses && houses.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 mt-8 gap-4">
          {houses.map((house) => (
            <Link href={`/house/${house._id}`} key={house._id}>
              <HouseCard {...house} />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
