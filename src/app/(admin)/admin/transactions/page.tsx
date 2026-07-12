import { serverFetch } from "../../../../lib/serverFetch";
import { TApiResponse } from "../../../../types/apiResponse";
import { TTransaction } from "../../../../features/transactions/types";
import AdminTransactionsClient from "../../../../features/transactions/AdminTransactionsClient";

export default async function AdminTransactionsPage() {
  const res = await serverFetch<TApiResponse<TTransaction[]>>("/transactions", { params: { page: 1, limit: 10 } });

  return <AdminTransactionsClient initialTransactions={res.data ?? []} />;
}
