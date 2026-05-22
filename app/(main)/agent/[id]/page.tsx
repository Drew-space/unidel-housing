"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Star, Mail, Home, ShieldCheck, MessageSquare } from "lucide-react";
import HouseCard from "@/components/HouseCard";
import Link from "next/link";

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange?: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          onMouseEnter={() => onChange && setHovered(star)}
          onMouseLeave={() => onChange && setHovered(0)}
          className="transition-colors"
          disabled={!onChange}
        >
          <Star
            className="w-5 h-5"
            fill={star <= (hovered || value) ? "#7c3aed" : "transparent"}
            stroke={star <= (hovered || value) ? "#7c3aed" : "#6b7280"}
          />
        </button>
      ))}
    </div>
  );
}

export default function AgentProfilePage() {
  const { id } = useParams();
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  const agent = useQuery(api.users.getUserById, {
    userId: id as Id<"users">,
  });
  const listings = useQuery(api.housePost.getMyHousesById, {
    userId: id as Id<"users">,
  });
  const reviews = useQuery(api.reviews.getAgentReviews, {
    agentId: id as Id<"users">,
  });
  const stats = useQuery(api.reviews.getAgentReviewStats, {
    agentId: id as Id<"users">,
  });
  const myReview = useQuery(api.reviews.getMyReviewForAgent, {
    agentId: id as Id<"users">,
  });
  const leaveReview = useMutation(api.reviews.leaveReview);

  const [rating, setRating] = useState(myReview?.rating ?? 0);
  const [comment, setComment] = useState(myReview?.comment ?? "");
  const [submitting, setSubmitting] = useState(false);

  if (agent === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-[#7c3aed] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!agent || agent.role !== "agent") {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Agent not found.
      </div>
    );
  }

  async function handleSubmitReview() {
    if (!isSignedIn) {
      openSignIn();
      return;
    }
    if (!rating) return toast.error("Please select a rating");
    if (!comment.trim()) return toast.error("Please write a comment");
    setSubmitting(true);
    try {
      await leaveReview({
        agentId: id as Id<"users">,
        rating,
        comment,
      });
      toast.success(myReview ? "Review updated" : "Review submitted");
      setComment("");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      {/* ── Agent header — centered column ── */}
      <div className="flex flex-col items-center text-center gap-3">
        {/* Avatar with verified badge overlay */}
        <div className="relative w-24 h-24">
          <Avatar className="w-24 h-24 border-2 border-border">
            <AvatarImage src={agent.imageUrl} alt={agent.name} />
            <AvatarFallback className="text-2xl">
              {agent.name[0]}
            </AvatarFallback>
          </Avatar>
          {/* Green verified badge — bottom right of avatar */}
          <div className="absolute bottom-0.5 right-0.5 w-6 h-6 rounded-full bg-[#7c3aed] border-2 border-white flex items-center justify-center shadow">
            <ShieldCheck className="w-3 h-3 text-white" />
          </div>
        </div>

        {/* Name */}
        <div className="space-y-0.5">
          <p className="text-sm text-muted-foreground">{agent.username}</p>
        </div>

        {/* Verified status text badge */}
        <Badge className="bg-[#7c3aed] text-white border border-[#7c3aed]/80 gap-1.5 px-3 py-1 text-xs font-medium">
          <ShieldCheck className="w-3 h-3" />
          Verified Agent
        </Badge>

        {/* Contact */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground pt-1">
          <span className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5" />
            {agent.email}
          </span>
        </div>

        {/* Rating summary */}
        {stats && stats.total > 0 && (
          <div className="flex flex-col items-center gap-1 pt-1">
            <span className="text-3xl font-bold">{stats.average}</span>
            <StarRating value={Math.round(stats.average)} />
            <span className="text-xs text-muted-foreground">
              {stats.total} review{stats.total !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      <Separator />

      {/* ── Tabs ── */}
      <Tabs defaultValue="listings">
        <TabsList className="w-full">
          <TabsTrigger value="listings" className="flex-1 gap-1.5">
            <Home className="w-3.5 h-3.5" />
            Listings ({listings?.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex-1 gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" />
            Reviews ({reviews?.length ?? 0})
          </TabsTrigger>
        </TabsList>

        {/* ── Listings tab ── */}
        <TabsContent value="listings" className="mt-6">
          {!listings || listings.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-10">
              No listings yet.
            </p>
          ) : (
            // Change the grid
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {listings.map((house) => (
                <Link key={house._id} href={`/house/${house._id}`}>
                  <HouseCard {...house} />
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── Reviews tab ── */}
        <TabsContent value="reviews" className="mt-6 space-y-6">
          {/* Leave / update review card */}
          <Card className="border border-border shadow-none">
            <CardContent className="pt-5 space-y-3">
              <p className="text-sm font-medium">
                {myReview ? "Update your review" : "Leave a review"}
              </p>
              <StarRating value={rating} onChange={setRating} />
              <Textarea
                placeholder="Share your experience with this agent..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="resize-none text-sm"
              />
              <Button
                size="sm"
                onClick={handleSubmitReview}
                disabled={submitting}
                className="w-full sm:w-auto bg-[#7c3aed] hover:bg-[#7c3aed]/80"
              >
                {submitting
                  ? "Submitting..."
                  : !isSignedIn
                    ? "Sign in to submit"
                    : myReview
                      ? "Update review"
                      : "Submit review"}
              </Button>
            </CardContent>
          </Card>

          {/* Review list */}
          <div className="space-y-4">
            {reviews?.map((review) => (
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
                <Separator className="mt-3" />
              </div>
            ))}

            {reviews?.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">
                No reviews yet. Be the first to review this agent.
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
