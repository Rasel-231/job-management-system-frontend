import { getServerUser } from "../../../../lib/auth";
import { getMyVerifications } from "../../../../features/verification/server";
import VerificationClient from "../../../../features/verification/VerificationClient";

// SERVER COMPONENT — verification history + user are fetched server-side
// (httpOnly cookie); document submissions run as Server Actions.
export const dynamic = "force-dynamic";

export default async function VerificationPage() {
  const [user, requests] = await Promise.all([getServerUser(), getMyVerifications()]);
  return <VerificationClient initialRequests={requests} initialUser={user} />;
}