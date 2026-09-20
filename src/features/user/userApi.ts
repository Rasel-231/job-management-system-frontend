import axiosInstance from "../../lib/axiosInstance";
import { TApiResponse } from "../../types/apiResponse";
import { TUserRow } from "./types";

export const getAllUsers = async (
  filters?: { status?: string; accountType?: string; isVerified?: string },
  page = 1,
  limit = 10
): Promise<TApiResponse<TUserRow[]>> => {
  const res = await axiosInstance.get<TApiResponse<TUserRow[]>>("/users", {
    params: {
      ...filters,
      page,
      limit,
    },
  });
  return res.data;
};

export const updateUserStatus = async (
  id: string,
  status: "PENDING" | "ACTIVE" | "BLOCKED"
): Promise<TUserRow> => {
  const res = await axiosInstance.patch<TApiResponse<TUserRow>>(`/users/${id}/status`, { status });
  if (!res.data.data) throw new Error("Failed to update user status");
  return res.data.data;
};

export const updateUserWarning = async (id: string, action: "warn" | "clear"): Promise<TUserRow> => {
  const res = await axiosInstance.patch<TApiResponse<TUserRow>>(`/users/${id}/warnings`, { action });
  if (!res.data.data) throw new Error("Failed to update user warning");
  return res.data.data;
};