"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

type Amenity =
  | "bed"
  | "wardrobe"
  | "cupboard"
  | "kitchen_cabinet"
  | "sofa"
  | "dining_table"
  | "tv_stand"
  | "curtains";

type Location = "owa-alero" | "alihame" | "owo-yibo";
type RoomType = "bed_sitter" | "single_room" | "room_and_parlor";
type PropertyType = "fenced_compound" | "bungalow" | "story_building";

interface HouseSubmitButtonProps {
  files: File[];
  onReset: () => void;
}

export function HouseSubmitButton({ files, onReset }: HouseSubmitButtonProps) {
  const router = useRouter();
  const createHouse = useMutation(api.housePost.createHousePost);
  const generateUploadUrl = useMutation(api.housePost.generateImageUploadUrl);
  const [loading, setLoading] = useState(false);

  const uploadFile = async (file: File): Promise<Id<"_storage">> => {
    const uploadUrl = await generateUploadUrl({});
    const result = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    if (!result.ok) throw new Error(`Failed to upload: ${file.name}`);
    const { storageId } = await result.json();
    return storageId as Id<"_storage">;
  };

  return (
    <Button
      type="submit"
      disabled={loading}
      onClick={async (e) => {
        e.preventDefault();
        const form = e.currentTarget.closest("form") as HTMLFormElement;
        const formData = new FormData(form);

        const title = (formData.get("title") as string)?.trim();
        const description = (formData.get("description") as string)?.trim();
        const content = (formData.get("content") as string)?.trim();
        const price = Number(formData.get("price"));
        const contactPhone = (formData.get("contactPhone") as string)?.trim();
        const location = (
          formData.get("location") as string
        )?.trim() as Location;
        const roomType = (
          formData.get("roomType") as string
        )?.trim() as RoomType;
        const propertyType = (
          formData.get("propertyType") as string
        )?.trim() as PropertyType;
        const amenities = JSON.parse(
          (formData.get("amenities") as string) || "[]",
        ) as Amenity[];
        const validImages = files.filter((f) => f.size > 0);

        console.log("[submit] Form values:", {
          title,
          description,
          content,
          price,
          contactPhone,
          location,
          roomType,
          propertyType,
          amenities,
          imageCount: validImages.length,
        });

        if (!title) {
          toast.warning("Please enter a title");
          return;
        }
        if (!description) {
          toast.warning("Please enter a description");
          return;
        }
        if (!content) {
          toast.warning("Please enter the full details");
          return;
        }
        if (!price || price <= 0) {
          toast.warning("Please enter a valid price");
          return;
        }
        if (!contactPhone) {
          toast.warning("Please enter a contact phone");
          return;
        }
        if (!location) {
          toast.warning("Please select a location");
          return;
        }
        if (!roomType) {
          toast.warning("Please select a room type");
          return;
        }
        if (!propertyType) {
          toast.warning("Please select a property type");
          return;
        }
        if (validImages.length === 0) {
          toast.warning("Please add at least one image");
          return;
        }

        try {
          setLoading(true);
          console.log("[submit] Uploading images...");

          const [coverStorageId, ...extraStorageIds] = await Promise.all(
            validImages.map(uploadFile),
          );
          console.log(
            "[submit] Cover:",
            coverStorageId,
            "Extra:",
            extraStorageIds,
          );

          await createHouse({
            title,
            description,
            content,
            price,
            contactPhone,
            location,
            roomType,
            propertyType,
            amenities,
            imageStorageId: coverStorageId,
            extraStorageIds: extraStorageIds.length
              ? extraStorageIds
              : undefined,
          });

          console.log("[submit] Created successfully!");
          form.reset();
          onReset();
          toast.success("Listing created successfully!");
          router.push("/");
        } catch (err) {
          console.error("[submit] Error:", err);
          const message =
            err instanceof Error ? err.message : "Something went wrong";
          toast.error(`Failed to create listing: ${message}`);
        } finally {
          setLoading(false);
        }
      }}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          Creating listing <Loader2 className="w-4 h-4 animate-spin" />
        </span>
      ) : (
        "Create listing"
      )}
    </Button>
  );
}
