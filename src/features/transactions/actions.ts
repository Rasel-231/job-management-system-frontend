"use server";

import { revalidatePath } from "next/cache";
import { serverFetch } from "../../lib/serverFetch";
import { TApiResponse } from "../../types/apiResponse";
import { TWithdrawal, TWithdrawalMethod } from "./types";

// SERVER ACTIONS for wallet mutations.

export async function requestWithdrawalAction(payload: {
  amount: number;
  method: TWithdrawalMethod;
  accountHolder: string;
  accountNumber: string;
}): Promise<TWithdrawal> {
  const res = await serverFetch<TApiResponse<TWithdrawal>>("/transactions/withdrawals", {
    method: "POST",
    body: payload,
  });
  if (!res.data) throw new Error("Failed to request withdrawal");
  revalidatePath("/dashboard/earnings");
  revalidatePath("/dashboard");
  revalidatePath("/admin/withdrawals");
  return res.data;
}

export async function reviewWithdrawalAction(
  id: string,
  status: "COMPLETED" | "REJECTED",
  note?: string
): Promise<TWithdrawal> {
  const res = await serverFetch<TApiResponse<TWithdrawal>>(`/transactions/withdrawals/${id}`, {
    method: "PATCH",
    body: { status, adminNote: note },
  });
  if (!res.data) throw new Error("Failed to review withdrawal");
  revalidatePath("/admin/withdrawals");
  revalidatePath("/dashboard/earnings");
  revalidatePath("/dashboard");
  return res.data;
}