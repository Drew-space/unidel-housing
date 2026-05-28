"use client";

import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import HouseCard from "@/components/HouseCard";
import HouseCardSkeleton from "@/components/Skeleton";
import { BadgeCheck, Plus, Home, Star } from "lucide-react";

export default function DashboardPage() {
  const { user } = useUser();
  const houses = useQuery(api.housePost.getMyHouses);

  const totalListings = houses?.length ?? 0;

  return (
    <section className="mx-auto container max-sm:px-4 pb-16">
      {/* ── Agent header ── */}
      <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative shrink-0">
            <img
              src={user?.imageUrl || "/default-avatar.png"}
              alt={user?.username ?? user?.firstName ?? "User"}
              className="w-14 h-14 rounded-full object-cover border-2 border-border"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#7c3aed] border-2 border-white flex items-center justify-center">
              <BadgeCheck className="w-3 h-3 text-white" />
            </div>
          </div>

          {/* Name + badge */}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-bold font-mona">
                Hey, {user?.username ?? user?.firstName ?? "there"} 👋
              </h1>
              <Badge className="bg-[#7c3aed] text-white text-xs px-2 py-0.5">
                Agent
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage your listings and track your performance
            </p>
          </div>
        </div>

        {/* Add listing button */}
        <Link href="/dashboard/create-listing" className="shrink-0">
          <Button className="bg-[#7c3aed] hover:bg-[#7c3aed]/80 gap-1.5">
            <Plus className="w-4 h-4" />
            Add listing
          </Button>
        </Link>
      </div>

      {/* ── Stats row ── */}
      <div className="flex gap-4 mt-6 flex-wrap">
        <div className="flex items-center gap-2 bg-[#ede9fe] text-[#7c3aed] rounded-xl px-4 py-3 min-w-[120px]">
          <Home className="w-4 h-4 shrink-0" />
          <div>
            <p className="text-xs font-medium">Listings</p>
            <p className="text-xl font-bold leading-tight">{totalListings}</p>
          </div>
        </div>
      </div>

      <Separator className="mt-6" />

      {/* ── Listings section ── */}
      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
          Your listings
        </h2>
        {totalListings > 0 && (
          <Link href="/dashboard/create-listing">
            <Button variant="outline" size="sm" className="text-xs h-7 gap-1">
              <Plus className="w-3 h-3" />
              New
            </Button>
          </Link>
        )}
      </div>

      {/* Loading */}
      {houses === undefined && (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 mt-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <HouseCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {houses?.length === 0 && (
        <div className="mt-10 flex flex-col items-center gap-3 text-center py-16 border border-dashed border-border rounded-xl">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <Home className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium">No listings yet</p>
          <p className="text-xs text-muted-foreground max-w-xs">
            You haven&apos;t posted any listings yet. Create your first one and
            start getting tenants.
          </p>
          <Link href="/dashboard/create-listing">
            <Button
              size="sm"
              className="bg-[#7c3aed] hover:bg-[#7c3aed]/80 mt-1 gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Create your first listing
            </Button>
          </Link>
        </div>
      )}

      {/* Grid */}
      {houses && houses.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 mt-6 gap-4">
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
