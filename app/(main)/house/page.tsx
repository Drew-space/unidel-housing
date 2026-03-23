"use client";

import React, { useState } from "react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
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

type Location = "owa-alero" | "alihame" | "owo-yibo";
type RoomType = "bed_sitter" | "single_room" | "room_and_parlor";

const LOCATIONS = [
  {
    value: "all-locations",
    label: "All Locations",
    items: [
      { value: "", label: "All Locations" },
      { value: "owa-alero", label: "Owa-Alero" },
      { value: "alihame", label: "Alihame" },
      { value: "owo-yibo", label: "Owo-Yibo" },
    ],
  },
] as const;

const ROOM_TYPES = [
  {
    value: "all-rooms",
    label: "All Rooms",
    items: [
      { value: "", label: "All Rooms" },
      { value: "bed_sitter", label: "Bed Sitter" },
      { value: "single_room", label: "Single Room" },
      { value: "room_and_parlor", label: "Room & Parlor" },
    ],
  },
] as const;

const Hero = () => {
  const [location, setLocation] = useState<Location | undefined>();
  const [roomType, setRoomType] = useState<RoomType | undefined>();
  const [clearKey, setClearKey] = useState(0);

  const houses = useQuery(api.housePost.getHouses, { location, roomType });

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
