import { getAllDisputes } from "../../../../features/disputes/server";
import AdminDisputesClient from "../../../../features/disputes/AdminDisputesClient";

// SERVER COMPONENT — row data fetched server-side; filter & page live in the URL.
export const dynamic = "force-dynamic";

export default async function AdminDisputesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const filter = sp.filter ?? "OPEN";
  const page = Math.max(1, Number(sp.page) || 1);

  const { disputes, meta } = await getAllDisputes(filter, page, 10);

  return (
    <AdminDisputesClient
      initialDisputes={disputes}
      initialFilter={filter}
      initialPage={page}
      initialTotalPages={meta?.totalPages ?? 1}
    />
  );
}