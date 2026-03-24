"use client";

import { useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { X, ImagePlus } from "lucide-react";
import { HouseSubmitButton } from "@/components/ui/SubmitButton";

const AMENITIES = [
  { value: "bed", label: "Bed" },
  { value: "wardrobe", label: "Wardrobe" },
  { value: "cupboard", label: "Cupboard" },
  { value: "kitchen_cabinet", label: "Kitchen cabinet" },
  { value: "sofa", label: "Sofa" },
  { value: "dining_table", label: "Dining table" },
  { value: "tv_stand", label: "TV stand" },
  { value: "curtains", label: "Curtains" },
] as const;

type Amenity = (typeof AMENITIES)[number]["value"];
type Location = "owa-alero" | "alihame" | "owo-yibo";
type RoomType = "bed_sitter" | "single_room" | "room_and_parlor";
type PropertyType = "fenced_compound" | "bungalow" | "story_building";

type HouseFormValues = {
  title: string;
  description: string;
  content: string;
  price: number;
  contactPhone: string;
  location: Location;
  roomType: RoomType;
  propertyType: PropertyType;
  amenities: Amenity[];
};

export default function CreateListingPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const {
    register,
    control,
    reset,
    formState: { errors },
  } = useForm<HouseFormValues>({
    defaultValues: { amenities: [] },
  });

  const watchedLocation = useWatch({ control, name: "location" });
  const watchedRoomType = useWatch({ control, name: "roomType" });
  const watchedPropertyType = useWatch({ control, name: "propertyType" });
  const watchedAmenities = useWatch({ control, name: "amenities" });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;
    setPreviews((prev) => [
      ...prev,
      ...selected.map((f) => URL.createObjectURL(f)),
    ]);
    setFiles((prev) => [...prev, ...selected]);
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleReset = () => {
    previews.forEach((url) => URL.revokeObjectURL(url));
    setFiles([]);
    setPreviews([]);
    reset();
  };

  return (
    <div className="container mx-auto py-8">
      <Link
        className={buttonVariants({ variant: "outline" })}
        href="/dashboard"
      >
        Go Back
      </Link>

      <div className="flex items-center justify-center mt-6">
        <Card className="max-w-2xl w-full">
          <CardHeader>
            <CardTitle>Create listing</CardTitle>
            <CardDescription>
              Fill in the details below to list your property
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-5">
              {/* Title */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Cozy bed sitter near campus"
                  {...register("title", {
                    required: "Title is required",
                    minLength: {
                      value: 3,
                      message: "Title must be at least 3 characters",
                    },
                  })}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  className="min-h-28 max-h-48 overflow-y-auto resize-none"
                  placeholder="Short description of the property"
                  {...register("description", {
                    required: "Description is required",
                    minLength: {
                      value: 10,
                      message: "Description must be at least 10 characters",
                    },
                  })}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Content */}
              {/* <div className="flex flex-col gap-2">
                <Label htmlFor="content">Full details</Label>
                <Textarea
                  id="content"
                  placeholder="Describe the property in detail — location landmarks, security, utilities..."
                  className="min-h-28 max-h-48 overflow-y-auto resize-none"
                  {...register("content", {
                    required: "Full details are required",
                    minLength: {
                      value: 20,
                      message: "Full details must be at least 20 characters",
                    },
                  })}
                />
                {errors.content && (
                  <p className="text-sm text-destructive">
                    {errors.content.message}
                  </p>
                )}
              </div> */}

              {/* Price & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="price">Price (₦/yr)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="e.g. 80000"
                    min={0}
                    {...register("price", {
                      required: "Price is required",
                      min: {
                        value: 1,
                        message: "Price must be greater than 0",
                      },
                      valueAsNumber: true,
                    })}
                  />
                  {errors.price && (
                    <p className="text-sm text-destructive">
                      {errors.price.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="contactPhone">Contact phone</Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    placeholder="e.g. 08012345678"
                    {...register("contactPhone", {
                      required: "Contact phone is required",
                      minLength: {
                        value: 10,
                        message: "Phone must be at least 10 digits",
                      },
                      pattern: {
                        value: /^[0-9+\s\-()]+$/,
                        message: "Invalid phone number",
                      },
                    })}
                  />
                  {errors.contactPhone && (
                    <p className="text-sm text-destructive">
                      {errors.contactPhone.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Location, Room type, Property type */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Location</Label>
                  <Controller
                    control={control}
                    name="location"
                    rules={{ required: "Please select a location" }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent className="font-sans">
                          <SelectItem value="owa-alero">Owa-Alero</SelectItem>
                          <SelectItem value="alihame">Alihame</SelectItem>
                          <SelectItem value="owo-yibo">Owo-Yibo</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.location && (
                    <p className="text-sm text-destructive">
                      {errors.location.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Room type</Label>
                  <Controller
                    control={control}
                    name="roomType"
                    rules={{ required: "Please select a room type" }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select room type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bed_sitter">Bed sitter</SelectItem>
                          <SelectItem value="single_room">
                            Single room
                          </SelectItem>
                          <SelectItem value="room_and_parlor">
                            Room & parlor
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.roomType && (
                    <p className="text-sm text-destructive">
                      {errors.roomType.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Property type</Label>
                  <Controller
                    control={control}
                    name="propertyType"
                    rules={{ required: "Please select a property type" }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fenced_compound">
                            Fenced compound
                          </SelectItem>
                          <SelectItem value="bungalow">Bungalow</SelectItem>
                          <SelectItem value="story_building">
                            Story building
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.propertyType && (
                    <p className="text-sm text-destructive">
                      {errors.propertyType.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Amenities */}
              <div className="flex flex-col gap-3">
                <Label>Amenities</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Controller
                    control={control}
                    name="amenities"
                    render={({ field }) => (
                      <>
                        {AMENITIES.map(({ value, label }) => (
                          <div key={value} className="flex items-center gap-2">
                            <Checkbox
                              id={value}
                              checked={(field.value ?? []).includes(value)}
                              onCheckedChange={(isChecked) => {
                                const current = field.value ?? [];
                                field.onChange(
                                  isChecked
                                    ? [...current, value]
                                    : current.filter(
                                        (a: string) => a !== value,
                                      ),
                                );
                              }}
                            />
                            <label
                              htmlFor={value}
                              className="text-sm cursor-pointer select-none"
                            >
                              {label}
                            </label>
                          </div>
                        ))}
                      </>
                    )}
                  />
                </div>
              </div>

              {/* Images */}
              <div className="flex flex-col gap-2">
                <Label>Images</Label>
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-muted-foreground/30 rounded-xl p-6 cursor-pointer hover:border-muted-foreground/60 transition-colors"
                >
                  <ImagePlus className="w-7 h-7 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground text-center">
                    Tap to add photos
                    <br />
                    <span className="text-xs">
                      You can select multiple images
                    </span>
                  </p>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>

                {previews.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {previews.map((src, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden group"
                      >
                        <img
                          src={src}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                            Cover
                          </span>
                        )}
                      </div>
                    ))}
                    <label
                      htmlFor="image-upload"
                      className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center cursor-pointer hover:border-muted-foreground/60 transition-colors"
                    >
                      <ImagePlus className="w-5 h-5 text-muted-foreground" />
                    </label>
                  </div>
                )}
              </div>

              {/* Hidden inputs for select values so formData can read them */}
              <input
                type="hidden"
                name="location"
                value={watchedLocation ?? ""}
              />
              <input
                type="hidden"
                name="roomType"
                value={watchedRoomType ?? ""}
              />
              <input
                type="hidden"
                name="propertyType"
                value={watchedPropertyType ?? ""}
              />
              <input
                type="hidden"
                name="amenities"
                value={JSON.stringify(watchedAmenities ?? [])}
              />

              <HouseSubmitButton files={files} onReset={handleReset} />
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
