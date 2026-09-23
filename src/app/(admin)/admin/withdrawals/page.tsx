import { getAllWithdrawals } from "../../../../features/transactions/server";
import AdminWithdrawalsClient from "../../../../features/transactions/AdminWithdrawalsClient";

// SERVER COMPONENT — row data fetched server-side; filter & page live in the URL.
export const dynamic = "force-dynamic";

export default async function AdminWithdrawalsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const filter = sp.filter ?? "PENDING";
  const page = Math.max(1, Number(sp.page) || 1);

  const { withdrawals, meta } = await getAllWithdrawals(filter, page, 10);

  return (
    <AdminWithdrawalsClient
      initialWithdrawals={withdrawals}
      initialFilter={filter}
      initialPage={page}
      initialTotalPages={meta?.totalPages ?? 1}
    />
  );
}