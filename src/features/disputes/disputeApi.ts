import axiosInstance from "../../lib/axiosInstance";
import { TApiResponse } from "../../types/apiResponse";
import { TDispute } from "./types";

export const createDispute = async (payload: {
  jobId: string;
  respondentId?: string;
  respondentEmail?: string;
  taskId?: string;
  reason: string;
}): Promise<TDispute> => {
  const res = await axiosInstance.post<TApiResponse<TDispute>>("/disputes", payload);
  if (!res.data.data) throw new Error("Failed to open dispute");
  return res.data.data;
};

export const getMyDisputes = async (): Promise<TDispute[]> => {
  const res = await axiosInstance.get<TApiResponse<TDispute[]>>("/disputes/my");
  return res.data.data ?? [];
};

export const getAllDisputes = async (
  status?: string,
  page = 1,
  limit = 10
): Promise<TApiResponse<TDispute[]>> => {
  const res = await axiosInstance.get<TApiResponse<TDispute[]>>("/disputes", {
    params: { status: status !== "ALL" ? status : undefined, page, limit },
  });
  return res.data;
};

export const resolveDispute = async (
  id: string,
  status: "RESOLVED" | "REJECTED",
  resolution?: string
): Promise<TDispute> => {
  const res = await axiosInstance.patch<TApiResponse<TDispute>>(`/disputes/${id}/resolve`, {
    status,
    resolution,
  });
  if (!res.data.data) throw new Error("Failed to resolve dispute");
  return res.data.data;
};