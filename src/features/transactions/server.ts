import "server-only";
import { serverFetch } from "../../lib/serverFetch";
import { TApiResponse, TMeta } from "../../types/apiResponse";
import { TEarningsSummary, TTransaction, TWithdrawal } from "./types";

// SERVER-SIDE DATA LOADERS for earnings, withdrawals and transactions.

export async function getMyEarnings(): Promise<TEarningsSummary> {
  const res = await serverFetch<TApiResponse<TEarningsSummary>>("/transactions/my-earnings");
  if (!res.data) throw new Error("Failed to load earnings");
  return res.data;
}

export async function getAllTransactions(
  filters?: { userId?: string; type?: string },
  page = 1,
  limit = 10
): Promise<{ transactions: TTransaction[]; meta?: TMeta }> {
  const res = await serverFetch<TApiResponse<TTransaction[]>>("/transactions", {
    params: { ...filters, page, limit },
  });
  return { transactions: res.data ?? [], meta: res.meta };
}

export async function getAllWithdrawals(
  status?: string,
  page = 1,
  limit = 10
): Promise<{ withdrawals: TWithdrawal[]; meta?: TMeta }> {
  const res = await serverFetch<TApiResponse<TWithdrawal[]>>("/transactions/withdrawals", {
    params: { status: status && status !== "ALL" ? status : undefined, page, limit },
  });
  return { withdrawals: res.data ?? [], meta: res.meta };
}