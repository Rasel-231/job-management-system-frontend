import { requireAdmin } from "../../../../lib/auth";
import ProfileClient from "../../../../features/user/ProfileClient";

// SERVER COMPONENT — admin profile data fetched server-side.
export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const admin = await requireAdmin();
  return <ProfileClient initialUser={admin} />;
}