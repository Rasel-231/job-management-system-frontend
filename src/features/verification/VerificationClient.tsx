"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { submitVerificationAction } from "./actions";
import { updateProfileAction, requestOtpAction, verifyOtpAction } from "../auth/actions";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setUser } from "../auth/authSlice";
import { TUser } from "../auth/types";
import { TVerification } from "./types";
import VerifiedBadge from "../../components/shared/VerifiedBadge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { Badge, type TBadgeVariant } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

const statusBadge: Record<TVerification["status"], TBadgeVariant> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "destructive",
};

const IS_DEV = process.env.NODE_ENV !== "production";

// CLIENT COMPONENT — verification history is a server-fetched prop; document
// submissions and phone edits are Server Actions. (OTP request/verify stay
// client-side against the auth endpoints.)
export default function VerificationClient({
  initialRequests,
  initialUser,
}: {
  initialRequests: TVerification[];
  initialUser: TUser | null;
}) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const [requests, setRequests] = useState<TVerification[]>(initialRequests);
  const [phone, setPhone] = useState(initialUser?.phone ?? "");
  const [otpCode, setOtpCode] = useState("");
  const [devOtp, setDevOtp] = useState<string | undefined>(undefined);
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  const [docType, setDocType] = useState<"NID" | "BIRTH_CERTIFICATE">("NID");
  const [docNumber, setDocNumber] = useState("");
  const [docFile, setDocFile] = useState<File | null>(null);
  const [submittingDoc, setSubmittingDoc] = useState(false);

  const handleRequestOtp = async () => {
    if (!phone) {
      toast.error("Phone number required");
      return;
    }
    setSendingOtp(true);
    try {
      const res = await requestOtpAction(phone);
      setOtpSent(true);
      if (IS_DEV && res.devOtp) {
        setDevOtp(res.devOtp);
        toast.info(`Dev OTP: ${res.devOtp}`);
      } else {
        toast.success("OTP sent to your phone");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode) {
      toast.error("Enter the OTP code");
      return;
    }
    setSendingOtp(true);
    try {
      const updated = await verifyOtpAction(phone, otpCode);
      dispatch(setUser(updated));
      toast.success("Phone verified! You now have the verified badge.");
      setOtpSent(false);
      setOtpCode("");
      setDevOtp(undefined);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "OTP verification failed");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleSavePhone = async () => {
    try {
      const updated = await updateProfileAction({ phone, name: user?.name });
      dispatch(setUser(updated));
      toast.success("Phone updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update phone");
    }
  };

  const handleSubmitDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docFile) {
      toast.error("Attach a document image (NID / Birth Certificate)");
      return;
    }
    setSubmittingDoc(true);
    try {
      const created = await submitVerificationAction({ type: docType, documentNumber: docNumber || undefined }, docFile);
      setRequests((prev) => [created, ...prev]);
      toast.success("Verification submitted. Awaiting admin review.");
      setDocFile(null);
      setDocNumber("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit verification");
    } finally {
      setSubmittingDoc(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight">Profile verification</h1>
        {user?.isVerified ? (
          <Badge variant="info" className="gap-1 pr-2.5">
            <VerifiedBadge size={12} /> Verified
          </Badge>
        ) : (
          <Badge variant="secondary">Unverified</Badge>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Mobile OTP path */}
        <section className="card-shadow space-y-4 rounded-xl border border-border bg-card p-5">
          <div>
            <h2 className="font-semibold tracking-tight">Mobile OTP verification</h2>
            <p className="text-xs text-muted-foreground">
              A 6-digit code will be sent to your phone. Verify it to earn the verified badge.
            </p>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Phone</label>
            <div className="flex gap-2">
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+8801XXXXXXXXX"
                disabled={user?.isPhoneVerified}
              />
              {!user?.isPhoneVerified && (
                <Button variant="outline" size="sm" onClick={handleSavePhone} type="button">
                  Save
                </Button>
              )}
            </div>
          </div>

          {user?.isPhoneVerified ? (
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Phone already verified</p>
          ) : (
            <div className="space-y-2">
              <Button type="button" variant="outline" className="w-full" onClick={handleRequestOtp} disabled={sendingOtp} isLoading={sendingOtp}>
                {sendingOtp ? "Sending..." : otpSent ? "Resend OTP" : "Send OTP"}
              </Button>
              {otpSent && (
                <>
                  <Input
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder={IS_DEV && devOtp ? `Dev OTP: ${devOtp}` : "Enter 6-digit OTP"}
                    maxLength={6}
                    inputMode="numeric"
                  />
                  <Button type="button" className="w-full" onClick={handleVerifyOtp} disabled={sendingOtp} isLoading={sendingOtp}>
                    {sendingOtp ? "Verifying..." : "Verify OTP"}
                  </Button>
                </>
              )}
            </div>
          )}
        </section>

        {/* NID / Birth Certificate path */}
        <section className="card-shadow space-y-4 rounded-xl border border-border bg-card p-5">
          <div>
            <h2 className="font-semibold tracking-tight">NID / Birth certificate</h2>
            <p className="text-xs text-muted-foreground">
              Upload a document — an admin will review it. Approval grants the verified badge.
            </p>
          </div>
          <form onSubmit={handleSubmitDoc} className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Document type</label>
              <Select value={docType} onChange={(e) => setDocType(e.target.value as "NID" | "BIRTH_CERTIFICATE")} className="w-full">
                <option value="NID">NID (National ID)</option>
                <option value="BIRTH_CERTIFICATE">Birth Certificate</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Document number (optional)</label>
              <Input value={docNumber} onChange={(e) => setDocNumber(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Document image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setDocFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-muted file:px-3 file:py-2 file:text-sm file:font-medium file:text-foreground hover:file:bg-accent"
              />
            </div>
            <Button type="submit" className="w-full" disabled={submittingDoc} isLoading={submittingDoc}>
              {submittingDoc ? "Submitting..." : "Submit for review"}
            </Button>
          </form>
        </section>
      </div>

      {/* My verification requests */}
      <div className="card-shadow overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Document</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-6 text-center text-muted-foreground">
                  No verification requests yet
                </TableCell>
              </TableRow>
            ) : (
              requests.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.type.replace("_", " ")}</TableCell>
                  <TableCell>
                    <a href={r.documentUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline">
                      View document
                    </a>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusBadge[r.status]}>{r.status}</Badge>
                  </TableCell>
                  <TableCell>{new Date(r.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}