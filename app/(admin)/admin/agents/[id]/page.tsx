"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useParams, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  ShieldCheck,
  Home,
  MessageSquare,
  AlertTriangle,
  Star,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import HouseCard from "@/components/HouseCard";
import { HugeiconsIcon } from "@hugeicons/react";
import { Home09Icon } from "@hugeicons/core-free-icons";

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className="w-3.5 h-3.5"
          fill={star <= value ? "#f59e0b" : "transparent"}
          stroke={star <= value ? "#f59e0b" : "#9ca3af"}
        />
      ))}
    </div>
  );
}

export default function AdminAgentDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const agent = useQuery(api.users.getUserById, { userId: id as Id<"users"> });
  const listings = useQuery(api.housePost.getMyHousesById, {
    userId: id as Id<"users">,
  });
  const reviews = useQuery(api.reviews.getAgentReviews, {
    agentId: id as Id<"users">,
  });
  const stats = useQuery(api.reviews.getAgentReviewStats, {
    agentId: id as Id<"users">,
  });

  if (agent === undefined) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-5 h-5 rounded-full border-2 border-[#7c3aed] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!agent) {
    return <p className="text-sm text-muted-foreground">Agent not found.</p>;
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 max-w-4xl w-full mx-auto">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to dashboard
      </button>

      {/* Agent info card */}
      {/* Agent info card */}
      <Card className="shadow-none border border-border">
        <CardContent className="pt-5">
          {/* Mobile: column centered | Desktop: row */}
          <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-4 flex-wrap">
            <Avatar className="w-16 h-16 sm:w-14 sm:h-14 border border-border shrink-0">
              <AvatarImage src={agent.imageUrl} />
              <AvatarFallback className="text-xl sm:text-lg">
                {agent.name[0]}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h2 className="text-base font-semibold">{agent.name}</h2>
                <Badge className="bg-[#7c3aed]/10 text-[#7c3aed] border border-[#7c3aed]/30 gap-1 text-xs">
                  <ShieldCheck className="w-3 h-3" />
                  Verified agent
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{agent.email}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 pt-1 text-xs text-muted-foreground">
                <span>{listings?.length ?? 0} listings</span>
                {stats && stats.total > 0 && (
                  <span>
                    {stats.average} avg rating · {stats.total} reviews
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2 flex-wrap justify-center sm:justify-end">
              <Button size="sm" variant="outline" className="text-xs h-8">
                View KYC docs
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-8 border-red-200 text-red-600 hover:bg-red-50"
              >
                Remove agent
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="listings">
        <TabsList className="w-full">
          <TabsTrigger value="listings" className="flex-1 gap-1.5 text-xs">
            <HugeiconsIcon icon={Home09Icon} />
            {/* <Home className="w-3.5 h-3.5" /> */}
            Listings ({listings?.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex-1 gap-1.5 text-xs">
            <MessageCircle className="w-3.5 h-3.5" />
            Reviews ({reviews?.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex-1 gap-1.5 text-xs">
            <AlertTriangle className="w-3.5 h-3.5" />
            Reports (0)
          </TabsTrigger>
        </TabsList>

        {/* Listings */}
        <TabsContent value="listings" className="mt-4">
          {!listings || listings.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-10">
              No listings yet.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {listings.map((house) => (
                <Link key={house._id} href={`/house/${house._id}`}>
                  <HouseCard {...house} />
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Reviews */}
        <TabsContent value="reviews" className="mt-4 space-y-4">
          {!reviews || reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-10">
              No reviews yet.
            </p>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <Avatar className="w-7 h-7">
                    <AvatarImage src={review.reviewerImage} />
                    <AvatarFallback>{review.reviewerName[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    {review.reviewerName}
                  </span>
                  <StarRating value={review.rating} />
                  <span className="text-xs text-muted-foreground ml-auto">
                    {new Date(review.createdAt).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground pl-9">
                  {review.comment}
                </p>
                <Separator className="mt-2" />
              </div>
            ))
          )}
        </TabsContent>

        {/* Reports — placeholder until agentReports table is added */}
        <TabsContent value="reports" className="mt-4">
          <p className="text-sm text-muted-foreground text-center py-10">
            No reports against this agent.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
