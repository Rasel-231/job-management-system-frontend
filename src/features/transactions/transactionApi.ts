import axiosInstance from "../../lib/axiosInstance";
import { TApiResponse } from "../../types/apiResponse";
import { TEarningsSummary, TTransaction, TWithdrawal, TWithdrawalMethod } from "./types";

export const getAllTransactions = async (
  filters?: { userId?: string; type?: string },
  page = 1,
  limit = 10
): Promise<TApiResponse<TTransaction[]>> => {
  const res = await axiosInstance.get<TApiResponse<TTransaction[]>>("/transactions", {
    params: { ...filters, page, limit },
  });
  return res.data;
};

export const getMyEarnings = async (): Promise<TEarningsSummary> => {
  const res = await axiosInstance.get<TApiResponse<TEarningsSummary>>("/transactions/my-earnings");
  if (!res.data.data) throw new Error("Failed to load earnings");
  return res.data.data;
};

export const requestWithdrawal = async (payload: {
  amount: number;
  method: TWithdrawalMethod;
  accountHolder: string;
  accountNumber: string;
}): Promise<TWithdrawal> => {
  const res = await axiosInstance.post<TApiResponse<TWithdrawal>>("/transactions/withdrawals", payload);
  if (!res.data.data) throw new Error("Failed to request withdrawal");
  return res.data.data;
};

export const getMyWithdrawals = async (): Promise<TWithdrawal[]> => {
  const res = await axiosInstance.get<TApiResponse<TWithdrawal[]>>("/transactions/my-withdrawals");
  return res.data.data ?? [];
};

export const getAllWithdrawals = async (
  status?: string,
  page = 1,
  limit = 10
): Promise<TApiResponse<TWithdrawal[]>> => {
  const res = await axiosInstance.get<TApiResponse<TWithdrawal[]>>("/transactions/withdrawals", {
    params: { status: status !== "ALL" ? status : undefined, page, limit },
  });
  return res.data;
};

export const reviewWithdrawal = async (
  id: string,
  status: "COMPLETED" | "REJECTED",
  note?: string
): Promise<TWithdrawal> => {
  const res = await axiosInstance.patch<TApiResponse<TWithdrawal>>(`/transactions/withdrawals/${id}`, {
    status,
    adminNote: note,
  });
  if (!res.data.data) throw new Error("Failed to review withdrawal");
  return res.data.data;
};