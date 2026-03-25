"use client";
import { useQuery } from "convex/react";
import { UserAvatar, useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import HouseCard from "@/components/HouseCard";
import { BadgeCheck, ImageOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const { user } = useUser();
  const houses = useQuery(api.housePost.getMyHouses);

  return (
    <section className="mx-auto container max-sm:px-4">
      {/* Header */}
      <div>
        <div className="flex items-center   justify-between">
          <img
            src={user?.imageUrl || "/default-avatar.png"}
            alt={user?.username ?? user?.firstName ?? "User"}
            className=" relative   w-12 h-12 rounded-full object-cover"
          />
          <BadgeCheck className="text-green-400 absolute z-10 right-2 -bottom-2" />
        </div>
        <div className="flex justify-between mt-4  items-center">
          <div className="flex items-center">
            <h1 className="md:text-5xl relative font-bold font-mona">
              Hey {user?.username ?? user?.firstName ?? "there"}{" "}
              <Badge className="bg-[#4ba2e9] ring ring-pink-50">Agent</Badge>
            </h1>
          </div>
          <div>
            <Link href="/dashboard/create-listing">
              <Button variant={"outline"}>+ Add listing</Button>
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
              <HouseCard showActions {...house} />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
