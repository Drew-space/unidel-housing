"use client";

import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
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
      <div className="mt-10 flex items-start justify-between">
        <div>
          <p className="text-amber-950/90">Your Listings</p>
          <h1 className="md:text-5xl text-3xl font-bold">
            Welcome back,
            <br />
            <span>{user?.username ?? user?.firstName ?? "there"}</span>
          </h1>
        </div>
        <Link href="/dashboard/create-listing" className={buttonVariants()}>
          + Add listing
        </Link>
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
