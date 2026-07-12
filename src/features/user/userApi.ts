import axiosInstance from "../../lib/axiosInstance";
import { TApiResponse } from "../../types/apiResponse";
import { TUserRow } from "./types";

export const getAllUsers = async (
  status?: string,
  page = 1,
  limit = 10
): Promise<TApiResponse<TUserRow[]>> => {
  const res = await axiosInstance.get<TApiResponse<TUserRow[]>>("/users", {
    params: { status: status !== "ALL" ? status : undefined, page, limit },
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
