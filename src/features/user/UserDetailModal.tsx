"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { Dialog } from "../../components/ui/dialog";
import ConfirmDialog from "../../components/shared/ConfirmDialog";
import VerifiedBadge from "../../components/shared/VerifiedBadge";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { updateUserAction, deleteUserAction } from "./actions";
import { TUserRow } from "./types";
import { useAppSelector } from "../../redux/hooks";

type TUserDetailModalProps = {
  user: TUserRow | null;
  onOpenChange: (open: boolean) => void;
  onUpdated: (updated: TUserRow) => void;
  onDeleted: (id: string) => void;
};

export default function UserDetailModal({
  user,
  onOpenChange,
  onUpdated,
  onDeleted,
}: TUserDetailModalProps) {
  const currentUserId = useAppSelector((state) => state.auth.user?.id);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"ADMIN" | "USER">("USER");
  const [accountType, setAccountType] = useState<"JOB_SEEKER" | "JOB_POSTER" | "BOTH">("JOB_SEEKER");
  const [status, setStatus] = useState<"PENDING" | "ACTIVE" | "BLOCKED">("ACTIVE");
  const [isVerified, setIsVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const open = !!user;
  const isSelf = !!user && user.id === currentUserId;

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone ?? "");
    setRole(user.role);
    setAccountType(user.accountType);
    setStatus(user.status);
    setIsVerified(user.isVerified);
    setIsPhoneVerified(user.isPhoneVerified);
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const updated = await updateUserAction(user.id, {
        name,
        email,
        phone: phone.trim() || null,
        role,
        accountType,
        status,
        isVerified,
        isPhoneVerified,
      });
      onUpdated(updated);
      onOpenChange(false);
      toast.success("User updated successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save user");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    setIsDeleting(true);
    try {
      await deleteUserAction(user.id);
      onDeleted(user.id);
      setConfirmDelete(false);
      onOpenChange(false);
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange} title="User details" className="max-w-xl">
        {user && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              {user.avatarUrl ? (
                <Image src={user.avatarUrl} alt="" width={44} height={44} className="rounded-full" />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                  {user.name[0]}
                </div>
              )}
              <div className="min-w-0">
                <p className="inline-flex items-center gap-1 font-semibold">
                  {user.name}
                  {user.isVerified && <VerifiedBadge size={13} />}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {user.email} · Joined {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="ml-auto">
                <Badge variant={status === "BLOCKED" ? "destructive" : status === "PENDING" ? "warning" : "success"}>
                  {status}
                </Badge>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Email</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Phone</label>
                <Input value={phone} placeholder="No phone number" onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Account provider</label>
                <Select value={user.authProvider} disabled>
                  <option value={user.authProvider}>{user.authProvider}</option>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Role</label>
                <Select value={role} onChange={(e) => setRole(e.target.value as "ADMIN" | "USER")}>
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Account type</label>
                <Select
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value as "JOB_SEEKER" | "JOB_POSTER" | "BOTH")}
                >
                  <option value="JOB_SEEKER">JOB_SEEKER</option>
                  <option value="JOB_POSTER">JOB_POSTER</option>
                  <option value="BOTH">BOTH</option>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Status</label>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "PENDING" | "ACTIVE" | "BLOCKED")}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="BLOCKED">BLOCKED</option>
                </Select>
              </div>
              <div className="flex items-end gap-4 pb-2">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={isVerified} onChange={(e) => setIsVerified(e.target.checked)} />
                  Verified
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={isPhoneVerified} onChange={(e) => setIsPhoneVerified(e.target.checked)} />
                  Phone verified
                </label>
              </div>
            </div>

            {user.warnings > 0 && (
              <p className="text-xs font-medium text-amber-600">{user.warnings} warning(s) issued</p>
            )}

            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <Button
                variant="destructive"
                disabled={isSelf}
                title={isSelf ? "You cannot delete your own account" : undefined}
                onClick={() => setConfirmDelete(true)}
              >
                Delete
              </Button>
              <Button onClick={handleSave} isLoading={isSaving}>
                {isSaving ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </div>
        )}
      </Dialog>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={(open) => !open && setConfirmDelete(false)}
        title="Delete this user?"
        description={`${user?.name} (${user?.email}) will be permanently removed along with all their jobs, applications, transactions and disputes. This cannot be undone.`}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </>
  );
}