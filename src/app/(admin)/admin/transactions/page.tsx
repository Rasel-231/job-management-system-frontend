import { getAllTransactions } from "../../../../features/transactions/server";
import AdminTransactionsClient from "../../../../features/transactions/AdminTransactionsClient";

// SERVER COMPONENT — row data fetched server-side; filter & page live in the URL.
export const dynamic = "force-dynamic";

export default async function AdminTransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const filter = sp.filter ?? "ALL";
  const page = Math.max(1, Number(sp.page) || 1);

  const { transactions, meta } = await getAllTransactions(
    filter !== "ALL" ? { type: filter } : undefined,
    page,
    10
  );

  return (
    <AdminTransactionsClient
      initialTransactions={transactions}
      initialFilter={filter}
      initialPage={page}
      initialTotalPages={meta?.totalPages ?? 1}
    />
  );
}