"use client";

import React, { useState } from "react";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
} from "@/components/ui/combobox";
import { InputGroupAddon } from "@/components/ui/input-group";
import HouseCard from "@/components/HouseCard";
import Link from "next/link";
import {
  MapPin,
  BedDouble,
  Trash,
  Trash2,
  Trash2Icon,
  LucideTrash,
  LucideTrash2,
} from "lucide-react";
import HouseCardSkeleton from "@/components/Skeleton";

type Location =
  | "Alihame"
  | "Aliokpu"
  | "Agbor-Obi"
  | "Boji-Boji"
  | "Owa-Alero"
  | "Owo-Oyibu"
  | "Owa-Ekei";
type RoomType = "Bed-Sitter" | "Single-Room" | "Room_and_Parlor";

const LOCATIONS = [
  {
    value: "all-locations",
    label: "All Locations",
    items: [
      { value: "", label: "All Locations" },
      { value: "Alihame", label: "Alihame" },
      { value: "Agbor-Obi", label: "Agbor-Obi" },
      { value: "Aliokpu", label: "Aliokpu" },
      { value: "Boji-Boji", label: "Boji-Boji" },
      { value: "Owa-Alero", label: "Owa-Alero" },
      { value: "Owo-Oyibu", label: "Owo-Oyibu" },
      { value: "Owa-Ekei", label: "Owa-Ekei" },

      // v.literal("Alihame"),
      // v.literal("Owa-Alero"),
      // v.literal("Owo-Oyibu"),
      // v.literal("Owa-Ekei"),
      // v.literal("Agbor-Obi"),
      // v.literal("Boji-Boji"),
      // v.literal("Aliokpu"),
    ],
  },
] as const;

const ROOM_TYPES = [
  {
    value: "all-rooms",
    label: "All Rooms",
    items: [
      { value: "", label: "All Rooms" },
      { value: "Bed-Sitter", label: "Bed Sitter" },
      { value: "Single-Room", label: "Single Room" },
      { value: "Room_and_Parlor", label: "Room & Parlor" },
    ],
  },
] as const;

const Hero = () => {
  const [location, setLocation] = useState<Location | undefined>();
  const [roomType, setRoomType] = useState<RoomType | undefined>();
  const [clearKey, setClearKey] = useState(0);

  const houses = useQuery(api.housePost.getHouses, { location, roomType });
  const deleteHouse = useMutation(api.housePost.deleteHouse);

  return (
    <section className=" mx-auto container max-sm:px-4">
      <div className="mt-10">
        <p className="text-[#7c3aed]">Student Housing Made Easy</p>
        <h1 className="md:text-5xl font-mona  text-3xl font-bold">
          Find your perfect
          <br /> hostel near campus
        </h1>
      </div>

      {/* search inputs */}
      <div className="flex flex-row gap-4 mt-6">
        {/* location filter */}
        <Combobox
          key={`location-${clearKey}`}
          items={LOCATIONS}
          onValueChange={(val) => setLocation((val as Location) || undefined)}
        >
          <ComboboxInput placeholder="Location">
            <InputGroupAddon className="">
              <MapPin className=" text-green-500 text-size-4 " />
            </InputGroupAddon>
          </ComboboxInput>
          <ComboboxContent side="bottom">
            <ComboboxEmpty>No locations found.</ComboboxEmpty>
            <ComboboxList>
              {(group) => (
                <ComboboxGroup key={group.value} items={group.items}>
                  <ComboboxCollection>
                    {(item) => (
                      <ComboboxItem
                        className="font-mona"
                        key={item.value}
                        value={item.value}
                      >
                        {item.label}
                      </ComboboxItem>
                    )}
                  </ComboboxCollection>
                </ComboboxGroup>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>

        {/* room filter */}
        <Combobox
          key={`roomtype-${clearKey}`}
          items={ROOM_TYPES}
          onValueChange={(val) => setRoomType((val as RoomType) || undefined)}
        >
          <ComboboxInput placeholder="Rooms">
            <InputGroupAddon>
              <BedDouble className=" text-blue-500 size-4 " />
            </InputGroupAddon>
          </ComboboxInput>
          <ComboboxContent side="bottom">
            <ComboboxEmpty>No room types found.</ComboboxEmpty>
            <ComboboxList>
              {(group) => (
                <ComboboxGroup key={group.value} items={group.items}>
                  <ComboboxCollection>
                    {(item) => (
                      <ComboboxItem
                        className="font-mona"
                        key={item.value}
                        value={item.value}
                      >
                        {item.label}
                      </ComboboxItem>
                    )}
                  </ComboboxCollection>
                </ComboboxGroup>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>

        <Button
          variant="destructive"
          onClick={() => {
            setLocation(undefined);
            setRoomType(undefined);
            setClearKey((prev) => prev + 1);
          }}
        >
          <span>
            {" "}
            <LucideTrash2 />{" "}
          </span>
          Clear
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 mt-8 gap-4">
        {houses === undefined ? (
          // 🔥 SHOW SKELETON WHILE FETCHING
          Array.from({ length: 6 }).map((_, i) => <HouseCardSkeleton key={i} />)
        ) : houses.length === 0 ? (
          // ❌ EMPTY STATE (important)
          <p className="col-span-full text-center text-gray-500">
            No listings found
          </p>
        ) : (
          // ✅ DATA LOADED
          houses.map((house) => (
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

      {/* <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 mt-8 gap-4">
        {houses?.map((house) => (
          <Link href={`/house/${house._id}`} key={house._id}>
            <HouseCard
              {...house}
              onDelete={async (id) => {
                await deleteHouse({ id });
              }}
            />
          </Link>
        ))}
      </div> */}
    </section>
  );
};

export default Hero;
