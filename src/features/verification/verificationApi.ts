import axiosInstance from "../../lib/axiosInstance";
import { TApiResponse } from "../../types/apiResponse";
import { TVerification } from "./types";

export const submitVerification = async (
  payload: { type: "NID" | "BIRTH_CERTIFICATE"; documentNumber?: string },
  file: File
): Promise<TVerification> => {
  const formData = new FormData();
  formData.append("type", payload.type);
  if (payload.documentNumber) formData.append("documentNumber", payload.documentNumber);
  formData.append("document", file);

  const res = await axiosInstance.post<TApiResponse<TVerification>>("/verifications", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  if (!res.data.data) throw new Error("Failed to submit verification");
  return res.data.data;
};

export const getMyVerifications = async (): Promise<TVerification[]> => {
  const res = await axiosInstance.get<TApiResponse<TVerification[]>>("/verifications/my");
  return res.data.data ?? [];
};

export const getAllVerifications = async (status?: string, page = 1, limit = 10): Promise<TApiResponse<TVerification[]>> => {
  const res = await axiosInstance.get<TApiResponse<TVerification[]>>("/verifications", {
    params: { status: status !== "ALL" ? status : undefined, page, limit },
  });
  return res.data;
};

export const reviewVerification = async (
  id: string,
  status: "APPROVED" | "REJECTED",
  note?: string
): Promise<TVerification> => {
  const res = await axiosInstance.patch<TApiResponse<TVerification>>(`/verifications/${id}/review`, {
    status,
    note,
  });
  if (!res.data.data) throw new Error("Failed to review verification");
  return res.data.data;
};