import { getAllVerifications } from "../../../../features/verification/server";
import AdminVerificationsClient from "../../../../features/verification/AdminVerificationsClient";

// SERVER COMPONENT — row data fetched server-side; filter & page live in the
// URL so the server re-fetches on every navigation.
export const dynamic = "force-dynamic";

export default async function AdminVerificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const filter = sp.filter ?? "ALL";
  const page = Math.max(1, Number(sp.page) || 1);

  const { verifications, meta } = await getAllVerifications(filter, page, 10);

  return (
    <AdminVerificationsClient
      initialRequests={verifications}
      initialFilter={filter}
      initialPage={page}
      initialTotalPages={meta?.totalPages ?? 1}
    />
  );
}