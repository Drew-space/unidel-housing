"use client";

import React, { useState, useMemo } from "react";
import { api } from "@/convex/_generated/api";
import { useMutation, usePaginatedQuery } from "convex/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import HouseCard from "@/components/HouseCard";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  BedDouble,
  Trash2,
  X,
} from "lucide-react";
import HouseCardSkeleton from "@/components/Skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Location =
  | "Alihame"
  | "Aliokpu"
  | "Agbor-Obi"
  | "Boji-Boji"
  | "Owa-Alero"
  | "Owo-Oyibu"
  | "Owa-Ekei";
type RoomType = "Bed-Sitter" | "Single-Room" | "Room_and_Parlor";

const MIN_PRICE = 0;
const MAX_PRICE = 500000;

const PAGE_SIZE = 6;

function formatPrice(n: number) {
  return "₦" + n.toLocaleString();
}

const Hero = () => {
  const [search, setSearch] = useState("");

  const [location, setLocation] = useState<Location | "" | "all">("");
  const [roomType, setRoomType] = useState<RoomType | "" | "all">("");
  const [minPrice, setMinPrice] = useState(MIN_PRICE);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [applied, setApplied] = useState(false);
  const [page, setPage] = useState(1);

  const deleteHouse = useMutation(api.housePost.deleteHouse);

  const { results, status, loadMore } = usePaginatedQuery(
    api.housePost.getHouses,
    {
      location:
        applied && location && location !== "all"
          ? (location as Location)
          : undefined,
      roomType:
        applied && roomType && roomType !== "all"
          ? (roomType as RoomType)
          : undefined,
    },
    { initialNumItems: PAGE_SIZE },
  );

  // Client-side filter: search + price
  const filtered = useMemo(() => {
    return results.filter((house) => {
      // Price filter (only when applied)
      if (applied) {
        if (house.price < minPrice || house.price > maxPrice) return false;
      }
      // Global search
      if (search.trim()) {
        const q = search.toLowerCase();
        const match =
          house.title?.toLowerCase().includes(q) ||
          house.description?.toLowerCase().includes(q) ||
          house.location?.toLowerCase().includes(q) ||
          house.roomType?.toLowerCase().includes(q) ||
          String(house.price).includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [results, search, minPrice, maxPrice, applied]);

  const hasActiveFilters =
    applied &&
    (!!location || !!roomType || minPrice > MIN_PRICE || maxPrice < MAX_PRICE);
  const hasInputs =
    !!location || !!roomType || minPrice > MIN_PRICE || maxPrice < MAX_PRICE;

  function handleApply() {
    setApplied(true);
    setFiltersOpen(false);
    setPage(1);
  }

  function handleClearAll() {
    setLocation("");
    setRoomType("");
    setMinPrice(MIN_PRICE);
    setMaxPrice(MAX_PRICE);
    setSearch("");
    setApplied(false);
    setPage(1);
  }

  function removeFilter(type: "location" | "room" | "price") {
    if (type === "location") setLocation("");
    if (type === "room") setRoomType("");
    if (type === "price") {
      setMinPrice(MIN_PRICE);
      setMaxPrice(MAX_PRICE);
    }
  }

  const handleNext = () => {
    if (status === "CanLoadMore") {
      loadMore(PAGE_SIZE);
      setPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  return (
    <section className="mx-auto container max-sm:px-4">
      {/* Hero text */}
      <div className="mt-10">
        <p className="text-[#7c3aed]">Student Housing Made Easy</p>
        <h1 className="md:text-5xl font-mona text-3xl font-bold">
          Find your perfect
          <br /> hostel near campus
        </h1>
      </div>

      {/* ── Filter card ── */}
      <div className="mt-6 border border-border rounded-2xl p-4 bg-white shadow-sm space-y-4">
        {/* Global search row */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, location, description..."
              className="pl-9 h-10 text-sm"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 shrink-0"
            onClick={() => setFiltersOpen((v) => !v)}
            aria-label="Toggle filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        </div>

        {/* Expanded filter panel */}
        {filtersOpen && (
          <div className="space-y-4 pt-1">
            {/* Location + Rooms — side by side on desktop, stacked on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Location */}
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-green-500" />
                  Location
                </p>
                <Select
                  value={location}
                  onValueChange={(v) => setLocation(v as Location | "")}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All locations</SelectItem>
                    {[
                      "Alihame",
                      "Agbor-Obi",
                      "Aliokpu",
                      "Boji-Boji",
                      "Owa-Alero",
                      "Owo-Oyibu",
                      "Owa-Ekei",
                    ].map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Rooms */}
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <BedDouble className="w-3.5 h-3.5 text-blue-500" />
                  Rooms
                </p>
                <Select
                  value={roomType}
                  onValueChange={(v) => setRoomType(v as RoomType | "")}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Any rooms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any rooms</SelectItem>
                    <SelectItem value="Bed-Sitter">Bed-Sitter</SelectItem>
                    <SelectItem value="Single-Room">Single Room</SelectItem>
                    <SelectItem value="Room_and_Parlor">
                      Room & Parlour
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price range */}
              <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  Price range
                  <span className="text-[#7c3aed] font-semibold">
                    {formatPrice(minPrice)} —{" "}
                    {maxPrice >= MAX_PRICE
                      ? `${formatPrice(MAX_PRICE)}+`
                      : formatPrice(maxPrice)}
                  </span>
                </p>
                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-6">
                      Min
                    </span>
                    <input
                      type="range"
                      min={MIN_PRICE}
                      max={MAX_PRICE}
                      step={5000}
                      value={minPrice}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setMinPrice(Math.min(v, maxPrice));
                      }}
                      className="flex-1 accent-[#7c3aed]"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-6">
                      Max
                    </span>
                    <input
                      type="range"
                      min={MIN_PRICE}
                      max={MAX_PRICE}
                      step={5000}
                      value={maxPrice}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setMaxPrice(Math.max(v, minPrice));
                      }}
                      className="flex-1 accent-[#7c3aed]"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span className="border border-border rounded px-2 py-0.5">
                      {formatPrice(minPrice)}
                    </span>
                    <span className="border border-border rounded px-2 py-0.5">
                      {maxPrice >= MAX_PRICE
                        ? `${formatPrice(MAX_PRICE)}+`
                        : formatPrice(maxPrice)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Apply button — only shows when user has picked something */}
            {hasInputs && (
              <div className="flex justify-end pt-1">
                <Button
                  className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white w-full sm:w-auto"
                  onClick={handleApply}
                >
                  Apply filters
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Active filters bar ── */}
      {hasActiveFilters && (
        <div className="mt-3 flex flex-wrap items-center gap-2 bg-[#f5f3ff] border border-[#7c3aed]/20 rounded-xl px-4 py-3">
          <span className="text-xs font-medium text-muted-foreground mr-1">
            Active filters:
          </span>

          {location && location !== "all" && (
            <span className="flex items-center gap-1 text-xs bg-white border border-border rounded-full px-3 py-1">
              Location: {location}
              <button
                onClick={() => removeFilter("location")}
                className="ml-1 hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {roomType && roomType !== "all" && (
            <span className="flex items-center gap-1 text-xs bg-white border border-border rounded-full px-3 py-1">
              Rooms: {roomType.replace("_", " ")}
              <button
                onClick={() => removeFilter("room")}
                className="ml-1 hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {(minPrice > MIN_PRICE || maxPrice < MAX_PRICE) && (
            <span className="flex items-center gap-1 text-xs bg-white border border-border rounded-full px-3 py-1">
              Price: {formatPrice(minPrice)} –{" "}
              {maxPrice >= MAX_PRICE
                ? `${formatPrice(MAX_PRICE)}+`
                : formatPrice(maxPrice)}
              <button
                onClick={() => removeFilter("price")}
                className="ml-1 hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={handleClearAll}
            className="ml-auto flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear all
          </button>
        </div>
      )}

      {/* ── House grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 mt-8 gap-4">
        {status === "LoadingFirstPage" ? (
          Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <HouseCardSkeleton key={i} />
          ))
        ) : filtered.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 py-10">
            No listings found
          </p>
        ) : (
          filtered.map((house) => (
            <Link href={`/house/${house._id}`} key={house._id}>
              <HouseCard
                {...house}
                onDelete={async (id) => {
                  await deleteHouse({ id });
                }}
              />
            </Link>
          ))
        )}
      </div>

      {/* ── Pagination ── */}
      <Pagination className="mt-10">
        <PaginationContent>
          <PaginationItem>
            {/* <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (page > 1) handlePrev();
              }}
            /> */}
          </PaginationItem>
          {[...Array(page)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                href="#"
                isActive={page === i + 1}
                onClick={(e) => e.preventDefault()}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNext();
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {status === "Exhausted" && results.length > 0 && (
        <p className="text-center text-gray-400 text-sm mt-6">
          You&apos;ve seen all listings
        </p>
      )}
    </section>
  );
};

export default Hero;
