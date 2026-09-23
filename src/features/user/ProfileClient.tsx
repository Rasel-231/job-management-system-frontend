"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import { updateProfileAction } from "../auth/actions";
import { setUser } from "../auth/authSlice";
import { useAppDispatch } from "../../redux/hooks";
import { TAccountType, TUser } from "../auth/types";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Select } from "../../components/ui/select";

const accountTypeLabels: Record<string, string> = {
  JOB_SEEKER: "Participant",
  JOB_POSTER: "Client",
  BOTH: "Participant + Client",
};

// CLIENT COMPONENT — user data comes from a server-fetched prop; saving the
// form runs the updateProfileAction Server Action.
export default function ProfileClient({ initialUser }: { initialUser: TUser }) {
  const dispatch = useAppDispatch();

  const [user, setLocalUser] = useState<TUser>(initialUser);

  const [name, setName] = useState(initialUser.name);
  const [phone, setPhone] = useState(initialUser.phone ?? "");
  const [bio, setBio] = useState(initialUser.bio ?? "");
  const [skillTags, setSkillTags] = useState(initialUser.skillTags?.join(", ") ?? "");
  const [avatarUrl, setAvatarUrl] = useState(initialUser.avatarUrl ?? "");
  const [accountType, setAccountType] = useState<TAccountType>(initialUser.accountType);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const tags = skillTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 15);
      const updated = await updateProfileAction({
        name: name.trim(),
        phone: phone.trim() || undefined,
        bio: bio.trim() || undefined,
        skillTags: tags,
        avatarUrl: avatarUrl.trim() || undefined,
        accountType,
      });
      dispatch(setUser(updated));
      setLocalUser(updated);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Profile</h1>

      <div className="card-shadow space-y-5 rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-4">
          {user.avatarUrl ? (
            <Image src={user.avatarUrl} alt="" width={64} height={64} className="rounded-full border border-border" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-xl font-bold text-primary">
              {user.name[0]?.toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-lg font-bold tracking-tight">{user.name}</p>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary">{accountTypeLabels[user.accountType]}</Badge>
              <Badge variant={user.isVerified ? "success" : "outline"}>
                {user.isVerified ? "Verified" : "Unverified"}
              </Badge>
              {user.isPhoneVerified && <Badge variant="info">Phone verified</Badge>}
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required minLength={2} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Phone</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+8801XXXXXXXXX" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Account type</label>
              <Select className="w-full" value={accountType} onChange={(e) => setAccountType(e.target.value as TAccountType)}>
                {Object.entries(accountTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Bio</label>
            <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} maxLength={500} placeholder="Tell others what you do" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Skills (comma separated)</label>
            <Input value={skillTags} onChange={(e) => setSkillTags(e.target.value)} placeholder="Design, Writing, Data entry" />
            <p className="mt-1 text-xs text-muted-foreground">Up to 15 tags, max 40 characters each.</p>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Avatar URL (optional)</label>
            <Input type="url" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://..." />
          </div>
          <Button type="submit" className="w-full" disabled={saving} isLoading={saving}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </div>
    </div>
  );
}