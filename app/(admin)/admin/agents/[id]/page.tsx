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
  MessageCircle,
  Flag,
  Star,
} from "lucide-react";
import Link from "next/link";
import HouseCard from "@/components/HouseCard";
import { useMutation } from "convex/react";
import { toast } from "sonner";

function AdminReportsTab({ agentId }: { agentId: Id<"users"> }) {
  const reports = useQuery(api.agentReports.getAgentReports, { agentId });
  const dismiss = useMutation(api.agentReports.dismissReport);

  async function handleDismiss(reportId: Id<"agentReports">) {
    try {
      await dismiss({ reportId });
      toast.success("Report dismissed");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  }

  if (!reports)
    return (
      <p className="text-sm text-muted-foreground text-center py-10">
        Loading...
      </p>
    );
  if (reports.length === 0)
    return (
      <p className="text-sm text-muted-foreground text-center py-10">
        No reports against this agent.
      </p>
    );

  return (
    <div className="space-y-3">
      {reports.map((report) => (
        <div
          key={report._id}
          className="border border-border rounded-md p-3 space-y-2"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-medium">{report.reporterName}</p>
              <p className="text-xs text-muted-foreground">
                {report.reporterEmail} · {report.reporterPhone}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-muted-foreground">
                {new Date(report.createdAt).toLocaleDateString("en-NG", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs border-red-200 text-red-600 hover:bg-red-50"
                onClick={() => handleDismiss(report._id)}
              >
                Dismiss
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground border-t border-border pt-2">
            {report.reason}
          </p>
        </div>
      ))}
    </div>
  );
}

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

function ReportCount({ agentId }: { agentId: Id<"users"> }) {
  const reports = useQuery(api.agentReports.getAgentReports, { agentId });
  const count = reports?.length ?? 0;
  return (
    <span>
      {count} report{count !== 1 ? "s" : ""}
    </span>
  );
}

function ReportCountTab({ agentId }: { agentId: Id<"users"> }) {
  const reports = useQuery(api.agentReports.getAgentReports, { agentId });
  const count = reports?.length ?? 0;
  return <span className="text-red-500">Reports ({count})</span>;
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
      <Card className="shadow-none border border-border">
        <CardContent className="pt-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-wrap">
          <Avatar className="w-14 h-14 border border-border">
            <AvatarImage src={agent.imageUrl} />
            <AvatarFallback className="text-lg">{agent.name[0]}</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-semibold">{agent.name}</h2>
              <Badge className="bg-[#7c3aed]/10 text-[#7c3aed] border border-[#7c3aed]/30 gap-1 text-xs">
                <ShieldCheck className="w-3 h-3" />
                Verified agent
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{agent.email}</p>
            <div className="flex flex-wrap gap-4 pt-1 text-xs">
              <span className="flex items-center gap-1 text-[#7c3aed]">
                <Home className="w-3 h-3" />
                <span>
                  {listings?.length ?? 0} listing
                  {(listings?.length ?? 0) !== 1 ? "s" : ""}
                </span>
              </span>
              <span className="flex items-center gap-1 text-blue-500">
                <MessageCircle className="w-3 h-3" />
                <span>
                  {stats?.total ?? 0} review
                  {(stats?.total ?? 0) !== 1 ? "s" : ""}
                </span>
              </span>
              <span className="flex items-center gap-1 text-red-500">
                <Flag className="w-3 h-3" />
                <ReportCount agentId={id as Id<"users">} />
              </span>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-8"
              onClick={() => router.push(`/admin/kyc`)}
            >
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
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="listings">
        <TabsList className="w-full">
          <TabsTrigger
            value="listings"
            className="flex-1 gap-1.5 text-xs data-[state=active]:text-[#7c3aed]"
          >
            <Home className="w-3.5 h-3.5 text-[#7c3aed]" />
            <span className="text-[#7c3aed]">
              Listings ({listings?.length ?? 0})
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="flex-1 gap-1.5 text-xs data-[state=active]:text-blue-500"
          >
            <MessageCircle className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-blue-500">
              Reviews ({reviews?.length ?? 0})
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="reports"
            className="flex-1 gap-1.5 text-xs data-[state=active]:text-red-500"
          >
            <Flag className="w-3.5 h-3.5 text-red-500" />
            <ReportCountTab agentId={id as Id<"users">} />
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

        {/* Reports */}
        <TabsContent value="reports" className="mt-4">
          <AdminReportsTab agentId={id as Id<"users">} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
