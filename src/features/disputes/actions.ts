"use server";

import { revalidatePath } from "next/cache";
import { serverFetch } from "../../lib/serverFetch";
import { TApiResponse } from "../../types/apiResponse";
import { TDispute } from "./types";

// SERVER ACTIONS for dispute lifecycle.

export async function createDisputeAction(payload: {
  jobId: string;
  respondentId?: string;
  respondentEmail?: string;
  taskId?: string;
  reason: string;
}): Promise<TDispute> {
  const res = await serverFetch<TApiResponse<TDispute>>("/disputes", { method: "POST", body: payload });
  if (!res.data) throw new Error("Failed to open dispute");
  revalidatePath("/dashboard/disputes");
  revalidatePath("/admin/disputes");
  return res.data;
}

export async function resolveDisputeAction(
  id: string,
  status: "RESOLVED" | "REJECTED",
  resolution?: string
): Promise<TDispute> {
  const res = await serverFetch<TApiResponse<TDispute>>(`/disputes/${id}/resolve`, {
    method: "PATCH",
    body: { status, resolution },
  });
  if (!res.data) throw new Error("Failed to resolve dispute");
  revalidatePath("/admin/disputes");
  revalidatePath("/dashboard/disputes");
  return res.data;
}