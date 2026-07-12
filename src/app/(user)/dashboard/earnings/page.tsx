import { serverFetch } from "../../../../lib/serverFetch";
import { TApiResponse } from "../../../../types/apiResponse";
import { TEarningsSummary } from "../../../../features/transactions/types";
import EarningsClient from "../../../../features/transactions/EarningsClient";

export default async function EarningsPage() {
  const res = await serverFetch<TApiResponse<TEarningsSummary>>("/transactions/my-earnings");

  const summary: TEarningsSummary = res.data ?? {
    totalEarnings: 0,
    totalWithdrawn: 0,
    availableBalance: 0,
    history: [],
  };

  return <EarningsClient summary={summary} />;
}
