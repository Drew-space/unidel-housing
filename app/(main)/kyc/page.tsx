"use client";

import { useState, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Upload,
  CheckCircle2,
  Clock,
  XCircle,
  Camera,
} from "lucide-react";

type IdType =
  | "NIN"
  | "Drivers_License"
  | "Voters_Card"
  | "International_Passport";

const ID_LABELS: Record<IdType, string> = {
  NIN: "NIN (National Identification Number)",
  Drivers_License: "Driver's License",
  Voters_Card: "Voter's Card (PVC)",
  International_Passport: "International Passport",
};

function FileUploadField({
  label,
  hint,
  onChange,
  uploaded,
}: {
  label: string;
  hint?: string;
  onChange: (file: File) => void;
  uploaded: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      <div
        onClick={() => ref.current?.click()}
        className={`flex items-center justify-center gap-2 border border-dashed rounded-md h-24 cursor-pointer transition-colors text-sm
          ${uploaded ? "border-green-500 bg-green-50 text-green-700" : "border-border hover:border-foreground/40 text-muted-foreground"}`}
      >
        {uploaded ? (
          <>
            <CheckCircle2 className="w-4 h-4" />
            File uploaded
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            Click to upload
          </>
        )}
      </div>
      <input
        ref={ref}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onChange(file);
        }}
      />
    </div>
  );
}

function SelfieUploadField({
  onChange,
  uploaded,
}: {
  onChange: (file: File) => void;
  uploaded: boolean;
}) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onChange(file);
  };

  return (
    <div className="space-y-1.5">
      <Label className="text-sm">Selfie</Label>
      <p className="text-xs text-muted-foreground">
        A clear photo of your face. Must match your ID.
      </p>

      {uploaded ? (
        <div className="flex items-center justify-center gap-2 border border-green-500 bg-green-50 text-green-700 rounded-md h-24 text-sm">
          <CheckCircle2 className="w-4 h-4" />
          Selfie uploaded
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {/* Take photo — uses front camera on mobile */}
          <div
            onClick={() => cameraRef.current?.click()}
            className="flex flex-col items-center justify-center gap-1.5 border border-dashed rounded-md h-24 cursor-pointer transition-colors text-sm text-muted-foreground hover:border-foreground/40"
          >
            <Camera className="w-5 h-5" />
            <span className="text-xs">Take photo</span>
          </div>

          {/* Upload from gallery */}
          <div
            onClick={() => galleryRef.current?.click()}
            className="flex flex-col items-center justify-center gap-1.5 border border-dashed rounded-md h-24 cursor-pointer transition-colors text-sm text-muted-foreground hover:border-foreground/40"
          >
            <Upload className="w-5 h-5" />
            <span className="text-xs">Upload photo</span>
          </div>
        </div>
      )}

      {/* Camera input — front-facing camera on mobile */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="user"
        className="hidden"
        onChange={handleFile}
      />
      {/* Gallery input — file picker */}
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}

function KycStatusBanner({
  status,
  reason,
}: {
  status: "pending" | "approved" | "rejected";
  reason?: string;
}) {
  if (status === "pending") {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <Clock className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-amber-800">KYC Under Review</p>
          <p className="text-xs text-amber-700 mt-0.5">
            Your submission is being reviewed. You&lsquo;ll be notified once a
            decision is made.
          </p>
        </div>
      </div>
    );
  }

  if (status === "approved") {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
        <ShieldCheck className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-green-800">KYC Approved</p>
          <p className="text-xs text-green-700 mt-0.5">
            You are now a verified agent on Ruum.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
      <XCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
      <div>
        <p className="text-sm font-medium text-red-800">KYC Rejected</p>
        {reason && (
          <p className="text-xs text-red-700 mt-0.5">Reason: {reason}</p>
        )}
        <p className="text-xs text-red-700 mt-1">
          Please contact support for further assistance.
        </p>
      </div>
    </div>
  );
}

export default function KycPage() {
  const router = useRouter();
  const kycStatus = useQuery(api.kyc.getMyKycStatus);
  const generateUploadUrl = useMutation(api.kyc.generateUploadUrl);
  const submitKyc = useMutation(api.kyc.submitKyc);

  const [form, setForm] = useState({
    fullLegalName: "",
    phoneNumber: "",
    currentAddress: "",
    idType: "" as IdType | "",
    idNumber: "",
  });

  const [files, setFiles] = useState<{
    idFront?: File;
    idBack?: File;
    selfie?: File;
    utilityBill?: File;
  }>({});

  const [submitting, setSubmitting] = useState(false);
  const [consent, setConsent] = useState({
    data: false,
    terms: false,
  });

  // If KYC already exists, show status screen
  if (kycStatus !== undefined && kycStatus !== null) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 space-y-6">
        <div className="space-y-1">
          <h1 className="text-lg font-semibold">KYC Verification</h1>
          <p className="text-sm text-muted-foreground">
            Agent identity verification
          </p>
        </div>
        <KycStatusBanner
          status={kycStatus.status}
          reason={kycStatus.rejectionReason}
        />
      </div>
    );
  }

  async function uploadFile(file: File): Promise<Id<"_storage">> {
    const uploadUrl = await generateUploadUrl();
    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    if (!response.ok) throw new Error("Upload failed");
    const { storageId } = await response.json();
    return storageId as Id<"_storage">;
  }

  async function handleSubmit() {
    if (!form.fullLegalName.trim())
      return toast.error("Enter your full legal name");
    if (!form.phoneNumber.trim()) return toast.error("Enter your phone number");
    if (!form.currentAddress.trim())
      return toast.error("Enter your current address");
    if (!form.idType) return toast.error("Select an ID type");
    if (!form.idNumber.trim()) return toast.error("Enter your ID number");
    if (!files.idFront) return toast.error("Upload a photo of your ID (front)");
    if (!files.selfie) return toast.error("Upload a selfie");
    if (!files.utilityBill) return toast.error("Upload a utility bill");
    if (!consent.data)
      return toast.error("You must consent to data processing");
    if (!consent.terms)
      return toast.error("You must agree to the platform terms");

    setSubmitting(true);
    try {
      const [idFrontStorageId, selfieStorageId, utilityBillStorageId] =
        await Promise.all([
          uploadFile(files.idFront),
          uploadFile(files.selfie),
          uploadFile(files.utilityBill),
        ]);

      const idBackStorageId = files.idBack
        ? await uploadFile(files.idBack)
        : undefined;

      await submitKyc({
        fullLegalName: form.fullLegalName,
        phoneNumber: form.phoneNumber,
        currentAddress: form.currentAddress,
        idType: form.idType as IdType,
        idNumber: form.idNumber,
        idFrontStorageId,
        idBackStorageId,
        selfieStorageId,
        utilityBillStorageId,
      });

      toast.success("KYC submitted successfully. We'll review it shortly.");
      router.refresh();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#7c3aed]" />
          <h1 className="text-lg font-semibold text-[#7c3aed]">
            Become a Verified Agent
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Submit your KYC documents to list properties on Ruum. All information
          is kept confidential.
        </p>
      </div>

      {/* Personal info */}
      <section className="space-y-4">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Personal Information
        </p>

        <div className="space-y-1.5">
          <Label htmlFor="fullLegalName">Full legal name</Label>
          <Input
            id="fullLegalName"
            placeholder="As it appears on your ID"
            value={form.fullLegalName}
            onChange={(e) =>
              setForm((f) => ({ ...f, fullLegalName: e.target.value }))
            }
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone number</Label>
          <Input
            id="phone"
            placeholder="080xxxxxxxx"
            value={form.phoneNumber}
            onChange={(e) =>
              setForm((f) => ({ ...f, phoneNumber: e.target.value }))
            }
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="address">Current address</Label>
          <Input
            id="address"
            placeholder="Your current residential address"
            value={form.currentAddress}
            onChange={(e) =>
              setForm((f) => ({ ...f, currentAddress: e.target.value }))
            }
          />
        </div>
      </section>

      <Separator />

      {/* ID document */}
      <section className="space-y-4">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Government-Issued ID
        </p>

        <div className="space-y-1.5">
          <Label>ID type</Label>
          <Select
            value={form.idType}
            onValueChange={(v) =>
              setForm((f) => ({ ...f, idType: v as IdType }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select ID type" />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(ID_LABELS) as IdType[]).map((key) => (
                <SelectItem key={key} value={key}>
                  {ID_LABELS[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="idNumber">ID number</Label>
          <Input
            id="idNumber"
            placeholder="Enter your ID number"
            value={form.idNumber}
            onChange={(e) =>
              setForm((f) => ({ ...f, idNumber: e.target.value }))
            }
          />
        </div>

        <FileUploadField
          label="ID front photo"
          hint="Clear photo of the front of your ID"
          uploaded={!!files.idFront}
          onChange={(file) => setFiles((f) => ({ ...f, idFront: file }))}
        />

        <FileUploadField
          label="ID back photo (optional)"
          hint="Required for Driver's License and Voter's Card"
          uploaded={!!files.idBack}
          onChange={(file) => setFiles((f) => ({ ...f, idBack: file }))}
        />
      </section>

      <Separator />

      {/* Selfie + utility bill */}
      <section className="space-y-4">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Supporting Documents
        </p>

        <SelfieUploadField
          uploaded={!!files.selfie}
          onChange={(file) => setFiles((f) => ({ ...f, selfie: file }))}
        />

        <FileUploadField
          label="Utility bill"
          hint="Must be dated within the last 3 months and show your current address"
          uploaded={!!files.utilityBill}
          onChange={(file) => setFiles((f) => ({ ...f, utilityBill: file }))}
        />
      </section>

      <Separator />

      {/* ── Legal consent ── */}
      <section className="space-y-4">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Legal Consent
        </p>

        <div className="rounded-lg border border-border bg-muted/40 p-4 text-xs text-muted-foreground leading-relaxed space-y-2">
          <p className="font-medium text-foreground text-sm">
            Before you submit, please read carefully:
          </p>
          <p>
            By submitting this form, you acknowledge that Ruum is a platform
            that connects prospective tenants with property agents in Delta
            State, Nigeria. You agree that your listings and activities on this
            platform will not be used for any fraudulent, deceptive, or unlawful
            purpose, including but not limited to misrepresentation of
            properties, collection of money under false pretences, or any
            activity that violates Nigerian law.
          </p>
          <p>
            You confirm that all documents, information, and images submitted
            are authentic, accurate, and belong to you. Submission of falsified
            documents is a criminal offence under the Cybercrimes (Prohibition,
            Prevention, Etc.) Act 2015 and may result in immediate account
            termination and referral to law enforcement.
          </p>
          <p>
            Ruum reserves the right to reject, suspend, or permanently ban any
            agent found to be in violation of these terms, without prior notice
            and without liability.
          </p>
        </div>

        <div className="space-y-3">
          {/* Consent 1 — Data */}
          <div className="flex items-start gap-3">
            <Checkbox
              id="consent-data"
              checked={consent.data}
              onCheckedChange={(v) =>
                setConsent((c) => ({ ...c, data: v === true }))
              }
              className="mt-0.5"
            />
            <Label
              htmlFor="consent-data"
              className="text-sm leading-relaxed cursor-pointer font-normal"
            >
              I consent to Ruum collecting, storing, and processing my personal
              information and identity documents for agent verification
              purposes, in accordance with Nigeria&apos;s Data Protection Act
              (NDPA) 2023. I understand my data will not be sold or shared with
              third parties without my explicit permission.
            </Label>
          </div>

          {/* Consent 2 — Terms */}
          <div className="flex items-start gap-3">
            <Checkbox
              id="consent-terms"
              checked={consent.terms}
              onCheckedChange={(v) =>
                setConsent((c) => ({ ...c, terms: v === true }))
              }
              className="mt-0.5"
            />
            <Label
              htmlFor="consent-terms"
              className="text-sm leading-relaxed cursor-pointer font-normal"
            >
              I confirm that all submitted information and documents are genuine
              and accurate. I agree that my listings will not be used for
              fraudulent or unlawful purposes, and I understand that false
              submissions may result in permanent account termination and legal
              action under applicable Nigerian law.
            </Label>
          </div>
        </div>
      </section>

      <Button
        className="w-full bg-[#7c3aed]"
        onClick={handleSubmit}
        disabled={submitting || !consent.data || !consent.terms}
      >
        {submitting ? "Submitting..." : "Submit KYC"}
      </Button>

      <p className="text-xs text-center text-muted-foreground pb-8">
        Once submitted you cannot resubmit while your application is under
        review.
      </p>
    </div>
  );
}
