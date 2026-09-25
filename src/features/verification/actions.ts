"use server";

import { revalidatePath } from "next/cache";
import { serverFetch } from "../../lib/serverFetch";
import { TApiResponse } from "../../types/apiResponse";
import { TVerification } from "./types";


export async function submitVerificationAction(
  payload: { type: "NID" | "BIRTH_CERTIFICATE"; documentNumber?: string },
  file: File
): Promise<TVerification> {
  const formData = new FormData();
  formData.append("type", payload.type);
  if (payload.documentNumber) formData.append("documentNumber", payload.documentNumber);
  formData.append("document", file);
  const res = await serverFetch<TApiResponse<TVerification>>("/verifications", {
    method: "POST",
    body: formData,
  });
  if (!res.data) throw new Error("Failed to submit verification");
  revalidatePath("/dashboard/verification");
  revalidatePath("/admin/verifications");
  return res.data;
}

export async function reviewVerificationAction(
  id: string,
  status: "APPROVED" | "REJECTED",
  note?: string
): Promise<TVerification> {
  const res = await serverFetch<TApiResponse<TVerification>>(`/verifications/${id}/review`, {
    method: "PATCH",
    body: { status, note },
  });
  if (!res.data) throw new Error("Failed to review verification");
  revalidatePath("/admin/verifications");
  revalidatePath("/dashboard/verification");
  return res.data;
}