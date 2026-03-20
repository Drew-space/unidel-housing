"use client";

import React, { useState } from "react";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import HouseCard from "@/components/HouseCard";
import Link from "next/link";

type Location = "owa-alero" | "alihame" | "owo-yibo";
type RoomType = "bed_sitter" | "single_room" | "room_and_parlor";

const Hero = () => {
  const [location, setLocation] = useState<Location | undefined>();
  const [roomType, setRoomType] = useState<RoomType | undefined>();
  const [clearKey, setClearKey] = useState(0);

  console.log("location:", location);
  console.log("roomType:", roomType);

  const houses = useQuery(api.housePost.getHouses, {
    location,
    roomType,
  });

  const LOCATIONS: { value: Location | ""; label: string }[] = [
    { value: "", label: "All Locations" },
    { value: "owa-alero", label: "Owa-Alero" },
    { value: "alihame", label: "Alihame" },
    { value: "owo-yibo", label: "Owo-Yibo" },
  ];

  const ROOM_TYPES: { value: RoomType | ""; label: string }[] = [
    { value: "", label: "All Room Types" },
    { value: "bed_sitter", label: "Bed Sitter" },
    { value: "single_room", label: "Single Room" },
    { value: "room_and_parlor", label: "Room & Parlor" },
  ];
  return (
    <section className="mx-auto container max-sm:px-4">
      <div className="mt-10 ">
        <p className="text-amber-950/90">Student Housing Made Easy</p>
        <h1 className="md:text-5xl text-3xl font-bold">
          Find your perfect
          <br /> hostel near campus
        </h1>
      </div>

      {/* search inputs */}
      <div className="flex flex-row  md:flex-row gap-4 mt-6 ">
        {/* location filter */}
        <div>
          <Combobox
            key={`location-${clearKey}`}
            items={LOCATIONS}
            onValueChange={(val) => setLocation((val as Location) || undefined)}
          >
            <ComboboxInput placeholder="Location" />
            <ComboboxContent>
              <ComboboxEmpty>No items found.</ComboboxEmpty>
              <ComboboxList>
                {LOCATIONS.map((item, index) => (
                  <ComboboxItem key={index} value={item.value}>
                    {item.label}
                  </ComboboxItem>
                ))}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>

        {/*  room filter*/}
        <div>
          <Combobox
            key={`location-${clearKey}`}
            items={ROOM_TYPES}
            onValueChange={(val) => setRoomType((val as RoomType) || undefined)}
          >
            <ComboboxInput placeholder="Room type" />
            <ComboboxContent>
              <ComboboxEmpty>No items found.</ComboboxEmpty>
              <ComboboxList>
                {ROOM_TYPES.map((item, index) => (
                  <ComboboxItem key={index} value={item.value}>
                    {item.label}
                  </ComboboxItem>
                ))}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setLocation(undefined);
            setRoomType(undefined);
            setClearKey((prev) => prev + 1);
          }}
        >
          Clear
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 mt-8 gap-4">
        {houses?.map((house) => (
          <Link href={`/house/${house._id}`} key={house._id}>
            <HouseCard {...house} />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Hero;
