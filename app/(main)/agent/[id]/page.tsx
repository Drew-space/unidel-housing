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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Star,
  Mail,
  ShieldCheck,
  MessageCircle,
  Flag,
  Home,
} from "lucide-react";
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
  const myReview = useQuery(api.reviews.getMyReviewForAgent, {
    agentId: id as Id<"users">,
  });

  const leaveReview = useMutation(api.reviews.leaveReview);
  const submitReport = useMutation(api.agentReports.submitReport);

  const [rating, setRating] = useState(myReview?.rating ?? 0);
  const [comment, setComment] = useState(myReview?.comment ?? "");
  const [submitting, setSubmitting] = useState(false);

  // Report modal state
  const [reportOpen, setReportOpen] = useState(false);
  const [reportForm, setReportForm] = useState({
    reporterName: "",
    reporterEmail: "",
    reporterPhone: "",
    reason: "",
  });
  const [reporting, setReporting] = useState(false);
  const [reportDone, setReportDone] = useState(false);

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
      await leaveReview({ agentId: id as Id<"users">, rating, comment });
      toast.success(myReview ? "Review updated" : "Review submitted");
      setRating(0);
      setComment("");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmitReport() {
    if (!reportForm.reporterName.trim()) return toast.error("Enter your name");
    if (!reportForm.reporterEmail.trim())
      return toast.error("Enter your email");
    if (!reportForm.reporterPhone.trim())
      return toast.error("Enter your phone number");
    if (!reportForm.reason.trim())
      return toast.error("Please describe the issue");

    setReporting(true);
    try {
      await submitReport({
        agentId: id as Id<"users">,
        reporterName: reportForm.reporterName,
        reporterEmail: reportForm.reporterEmail,
        reporterPhone: reportForm.reporterPhone,
        reason: reportForm.reason,
      });
      setReportDone(true);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to submit report");
    } finally {
      setReporting(false);
    }
  }

  function closeReport() {
    setReportOpen(false);
    setReportDone(false);
    setReportForm({
      reporterName: "",
      reporterEmail: "",
      reporterPhone: "",
      reason: "",
    });
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      {/* ── Agent header ── */}
      <div className="flex flex-col items-center text-center gap-3">
        {/* Avatar + verified badge + report button */}
        <div className="relative w-24 h-24">
          <Avatar className="w-24 h-24 border-2 border-border">
            <AvatarImage src={agent.imageUrl} alt={agent.name} />
            <AvatarFallback className="text-2xl">
              {agent.name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0.5 right-0.5 w-6 h-6 rounded-full bg-[#7c3aed] border-2 border-white flex items-center justify-center shadow">
            <ShieldCheck className="w-3 h-3 text-white" />
          </div>
        </div>

        <div className="space-y-0.5">
          <h1 className="text-xl font-semibold">{agent.name}</h1>
          <p className="text-sm text-muted-foreground">@{agent.username}</p>
        </div>

        <Badge className="bg-[#7c3aed] text-white border border-[#7c3aed]/80 gap-1.5 px-3 py-1 text-xs font-medium">
          <ShieldCheck className="w-3 h-3" />
          Verified Agent
        </Badge>

        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground pt-1">
          <span className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5" />
            {agent.email}
          </span>
        </div>

        {stats && stats.total > 0 && (
          <div className="flex flex-col items-center gap-1 pt-1">
            <span className="text-3xl font-bold">{stats.average}</span>
            <StarRating value={Math.round(stats.average)} />
            <span className="text-xs text-muted-foreground">
              {stats.total} review{stats.total !== 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* Report button */}
        {/* <button
          onClick={() => setReportOpen(true)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-red-500 transition-colors mt-1 border border-border rounded-full px-3 py-1.5 hover:border-red-200 hover:bg-red-50"
        >
          <Flag className="w-3 h-3" />
          Report agent
        </button> */}
        <button
          onClick={() => setReportOpen(true)}
          className="flex items-center gap-1.5 text-xs text-red-500 border border-red-200 bg-red-50 rounded-full px-3 py-1.5 hover:bg-red-100 hover:border-red-300 transition-colors mt-1"
        >
          <Flag className="w-3 h-3" />
          Report agent
        </button>
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
            <MessageCircle className="w-3.5 h-3.5" />
            Reviews ({reviews?.length ?? 0})
          </TabsTrigger>
        </TabsList>

        {/* Listings tab */}
        <TabsContent value="listings" className="mt-6">
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

        {/* Reviews tab */}
        <TabsContent value="reviews" className="mt-6 space-y-6">
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

      {/* ── Report modal ── */}
      <Dialog
        open={reportOpen}
        onOpenChange={(o) => {
          if (!o) closeReport();
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Flag className="w-4 h-4 text-red-500" />
              Report {agent.name}
            </DialogTitle>
          </DialogHeader>

          {reportDone ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm font-medium">Report submitted</p>
              <p className="text-xs text-muted-foreground">
                Thank you for letting us know. Our team will review this report
                and take appropriate action.
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={closeReport}
                className="mt-2"
              >
                Close
              </Button>
            </div>
          ) : (
            <div className="space-y-3 pt-1">
              <p className="text-xs text-muted-foreground">
                Please provide your details and describe the issue with this
                agent.
              </p>

              <div className="space-y-1.5">
                <Label className="text-xs">Your name</Label>
                <Input
                  placeholder="Full name"
                  value={reportForm.reporterName}
                  onChange={(e) =>
                    setReportForm((f) => ({
                      ...f,
                      reporterName: e.target.value,
                    }))
                  }
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Your email</Label>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={reportForm.reporterEmail}
                  onChange={(e) =>
                    setReportForm((f) => ({
                      ...f,
                      reporterEmail: e.target.value,
                    }))
                  }
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Your phone number</Label>
                <Input
                  placeholder="080xxxxxxxx"
                  value={reportForm.reporterPhone}
                  onChange={(e) =>
                    setReportForm((f) => ({
                      ...f,
                      reporterPhone: e.target.value,
                    }))
                  }
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Describe the issue</Label>
                <Textarea
                  placeholder="What happened? Be as specific as possible..."
                  value={reportForm.reason}
                  onChange={(e) =>
                    setReportForm((f) => ({ ...f, reason: e.target.value }))
                  }
                  rows={4}
                  className="resize-none text-sm"
                />
              </div>

              <Button
                className="w-full bg-red-600 hover:bg-red-700 text-white mt-1"
                onClick={handleSubmitReport}
                disabled={reporting}
              >
                {reporting ? "Submitting..." : "Submit report"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
