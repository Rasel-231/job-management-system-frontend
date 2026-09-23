import { getMyEarnings } from "../../../../features/transactions/server";
import EarningsClient from "../../../../features/transactions/EarningsClient";

// SERVER COMPONENT — wallet summary (balances, withdrawals, history) is
// fetched server-side via the httpOnly cookie.
export const dynamic = "force-dynamic";

export default async function EarningsPage() {
  const summary = await getMyEarnings();
  return <EarningsClient initialSummary={summary} />;
}