"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, MapPin, BedDouble, Trash2 } from "lucide-react";

export default function AdminListingsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const listings = useQuery(api.admin.getAllListings);
  const deleteHouse = useMutation(api.housePost.deleteHouseAdmin);

  const filtered =
    listings?.filter(
      (l) =>
        l.title.toLowerCase().includes(search.toLowerCase()) ||
        l.location.toLowerCase().includes(search.toLowerCase()) ||
        l.authorName.toLowerCase().includes(search.toLowerCase()),
    ) ?? [];

  async function handleDelete(id: Id<"housePost">) {
    try {
      await deleteHouse({ id });
      toast.success("Listing removed");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <CardTitle className="text-sm font-medium">
              All Listings ({filtered.length})
            </CardTitle>
            <div className="relative max-w-xs w-full sm:w-auto">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder="Search by title, location, agent..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 text-xs"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-2 max-h-[70vh] overflow-y-auto pr-1">
            {!listings ? (
              <p className="text-sm text-muted-foreground text-center py-10">
                Loading...
              </p>
            ) : filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-10">
                {search ? "No listings match your search." : "No listings yet."}
              </p>
            ) : (
              filtered.map((listing) => (
                <div
                  key={listing._id}
                  className="flex items-center gap-3 border rounded-md p-3 hover:bg-muted/50 transition-colors"
                >
                  {/* Thumbnail */}
                  {listing.imageUrl ? (
                    <img
                      src={listing.imageUrl}
                      alt={listing.title}
                      className="w-12 h-12 rounded-md object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-md bg-muted shrink-0" />
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {listing.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {listing.location}
                      </span>
                      <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                        <BedDouble className="w-3 h-3" />
                        {listing.roomType.replaceAll("_", " ")}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        by {listing.authorName}
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <p className="text-sm font-semibold shrink-0 hidden sm:block">
                    ₦{listing.price.toLocaleString()}
                    <span className="text-xs font-normal text-muted-foreground">
                      /yr
                    </span>
                  </p>

                  {/* Actions */}
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-7 shrink-0"
                    onClick={() => router.push(`/house/${listing._id}`)}
                  >
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(listing._id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
