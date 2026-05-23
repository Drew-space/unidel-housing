"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CheckCircle2, XCircle, Eye } from "lucide-react";

const ID_LABELS: Record<string, string> = {
  NIN: "NIN",
  Drivers_License: "Driver's License",
  Voters_Card: "Voter's Card",
  International_Passport: "International Passport",
};

function statusBadge(status: string) {
  if (status === "pending")
    return (
      <Badge className="bg-amber-50 text-amber-700 border border-amber-200">
        Pending
      </Badge>
    );
  if (status === "approved")
    return (
      <Badge className="bg-green-50 text-green-700 border border-green-200">
        Approved
      </Badge>
    );
  return (
    <Badge className="bg-red-50 text-red-700 border border-red-200">
      Rejected
    </Badge>
  );
}

type Submission = {
  _id: Id<"kycSubmissions">;
  fullLegalName: string;
  idType: string;
  idNumber: string;
  phoneNumber: string;
  currentAddress: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: number;
  rejectionReason?: string;
  selfieUrl?: string | null;
  idFrontUrl?: string | null;
  idBackUrl?: string | null;
  utilityBillUrl?: string | null;
  user?: { name: string; email: string; imageUrl: string } | null;
};

export default function AdminKycPage() {
  const pending = useQuery(api.kyc.getKycSubmissions, { status: "pending" });
  const approved = useQuery(api.kyc.getKycSubmissions, { status: "approved" });
  const rejected = useQuery(api.kyc.getKycSubmissions, { status: "rejected" });

  const approveKyc = useMutation(api.kyc.approveKyc);
  const rejectKyc = useMutation(api.kyc.rejectKyc);

  const [selected, setSelected] = useState<Submission | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleApprove(id: Id<"kycSubmissions">) {
    setLoading(true);
    try {
      await approveKyc({ submissionId: id });
      toast.success("KYC approved — user is now an agent");
      setSelected(null);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleReject(id: Id<"kycSubmissions">) {
    if (!rejectReason.trim())
      return toast.error("Please enter a rejection reason");
    setLoading(true);
    try {
      await rejectKyc({ submissionId: id, reason: rejectReason });
      toast.success("KYC rejected");
      setSelected(null);
      setRejectReason("");
      setShowRejectInput(false);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  function SubmissionsTable({
    submissions,
  }: {
    submissions: Submission[] | undefined;
  }) {
    if (!submissions)
      return (
        <p className="text-sm text-muted-foreground py-6 text-center">
          Loading...
        </p>
      );
    if (submissions.length === 0)
      return (
        <p className="text-sm text-muted-foreground py-6 text-center">
          No submissions.
        </p>
      );

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Applicant</TableHead>
            <TableHead className="hidden sm:table-cell">ID type</TableHead>
            <TableHead className="hidden md:table-cell">Submitted</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((sub) => (
            <TableRow key={sub._id}>
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={sub.user?.imageUrl} />
                    <AvatarFallback>{sub.fullLegalName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{sub.fullLegalName}</p>
                    <p className="text-xs text-muted-foreground">
                      {sub.user?.email}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                {ID_LABELS[sub.idType] ?? sub.idType}
              </TableCell>
              <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                {new Date(sub.submittedAt).toLocaleDateString("en-NG", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </TableCell>
              <TableCell>{statusBadge(sub.status)}</TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs gap-1"
                  onClick={() => setSelected(sub)}
                >
                  <Eye className="w-3 h-3" />
                  Review
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    // ✅ centered, max width, padding
    <div className="flex flex-1 flex-col gap-6 p-4 max-w-4xl w-full mx-auto">
      <div>
        <h1 className="text-lg font-semibold">KYC Queue</h1>
        <p className="text-sm text-muted-foreground">
          Review and approve agent identity submissions
        </p>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending" className="text-xs gap-1.5">
            Pending
            {pending && pending.length > 0 && (
              <span className="bg-amber-500 text-white text-[10px] rounded-full px-1.5">
                {pending.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved" className="text-xs">
            Approved
          </TabsTrigger>
          <TabsTrigger value="rejected" className="text-xs">
            Rejected
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          <Card className="shadow-none border border-border">
            <SubmissionsTable submissions={pending as Submission[]} />
          </Card>
        </TabsContent>
        <TabsContent value="approved" className="mt-4">
          <Card className="shadow-none border border-border">
            <SubmissionsTable submissions={approved as Submission[]} />
          </Card>
        </TabsContent>
        <TabsContent value="rejected" className="mt-4">
          <Card className="shadow-none border border-border">
            <SubmissionsTable submissions={rejected as Submission[]} />
          </Card>
        </TabsContent>
      </Tabs>

      {/* Review dialog */}
      <Dialog
        open={!!selected}
        onOpenChange={(o) => {
          if (!o) {
            setSelected(null);
            setShowRejectInput(false);
            setRejectReason("");
          }
        }}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>KYC Review — {selected?.fullLegalName}</DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Full name</p>
                  <p className="font-medium">{selected.fullLegalName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">ID type</p>
                  <p className="font-medium">{ID_LABELS[selected.idType]}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">ID number</p>
                  <p className="font-medium">{selected.idNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium">{selected.phoneNumber}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="font-medium">{selected.currentAddress}</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Documents
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Selfie", url: selected.selfieUrl },
                    { label: "ID front", url: selected.idFrontUrl },
                    { label: "ID back", url: selected.idBackUrl },
                    { label: "Utility bill", url: selected.utilityBillUrl },
                  ].map(({ label, url }) =>
                    url ? (
                      <div key={label}>
                        <p className="text-xs text-muted-foreground mb-1">
                          {label}
                        </p>
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          <img
                            src={url}
                            alt={label}
                            className="w-full h-32 object-cover rounded-md border border-border hover:opacity-90 transition-opacity"
                          />
                        </a>
                      </div>
                    ) : null,
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground">Status</p>
                {statusBadge(selected.status)}
              </div>
              {selected.rejectionReason && (
                <p className="text-xs text-red-600">
                  Reason: {selected.rejectionReason}
                </p>
              )}

              {showRejectInput && (
                <div className="space-y-1.5">
                  <Label className="text-xs">Rejection reason</Label>
                  <Textarea
                    placeholder="Explain why this submission is being rejected..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={3}
                    className="text-sm resize-none"
                  />
                </div>
              )}
            </div>
          )}

          {selected?.status === "pending" && (
            <DialogFooter className="flex gap-2 flex-wrap">
              {!showRejectInput ? (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => setShowRejectInput(true)}
                  >
                    <XCircle className="w-3.5 h-3.5 mr-1" />
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleApprove(selected._id)}
                    disabled={loading}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    {loading ? "Approving..." : "Approve"}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowRejectInput(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => handleReject(selected._id)}
                    disabled={loading}
                  >
                    {loading ? "Rejecting..." : "Confirm reject"}
                  </Button>
                </>
              )}
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
