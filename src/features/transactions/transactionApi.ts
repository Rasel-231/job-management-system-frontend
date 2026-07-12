import axiosInstance from "../../lib/axiosInstance";
import { TApiResponse } from "../../types/apiResponse";
import { TEarningsSummary, TTransaction } from "./types";

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
