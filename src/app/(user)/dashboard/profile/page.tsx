import { requireUser } from "../../../../lib/auth";
import ProfileClient from "../../../../features/user/ProfileClient";

// SERVER COMPONENT — profile data fetched server-side via httpOnly cookie.
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await requireUser();
  return <ProfileClient initialUser={user} />;
}