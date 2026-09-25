"use server";

import { revalidatePath } from "next/cache";
import { serverFetch } from "../../lib/serverFetch";
import { TApiResponse } from "../../types/apiResponse";
import { TJob, TJobComment } from "./types";


export async function createJobAction(formData: FormData): Promise<TJob> {
  const res = await serverFetch<TApiResponse<TJob>>("/jobs", { method: "POST", body: formData });
  if (!res.data) throw new Error("Failed to create job");
  revalidatePath("/jobs");
  revalidatePath("/admin/jobs");
  return res.data;
}

export async function updateJobAction(id: string, formData: FormData): Promise<TJob> {
  const res = await serverFetch<TApiResponse<TJob>>(`/jobs/${id}`, { method: "PATCH", body: formData });
  if (!res.data) throw new Error("Failed to update job");
  revalidatePath("/jobs");
  revalidatePath(`/jobs/${id}`);
  revalidatePath("/admin/jobs");
  revalidatePath(`/admin/jobs/${id}`);
  return res.data;
}

export async function deleteJobAction(id: string): Promise<void> {
  await serverFetch<TApiResponse<null>>(`/jobs/${id}`, { method: "DELETE" });
  revalidatePath("/jobs");
  revalidatePath(`/jobs/${id}`);
  revalidatePath("/admin/jobs");
}

export async function toggleLikeAction(id: string): Promise<{ liked: boolean; likesCount: number }> {
  const res = await serverFetch<TApiResponse<{ liked: boolean; likesCount: number }>>(`/jobs/${id}/like`, {
    method: "POST",
  });
  if (!res.data) throw new Error("Failed to like");
  revalidatePath("/jobs");
  revalidatePath(`/jobs/${id}`);
  return res.data;
}

export async function addCommentAction(jobId: string, content: string): Promise<TJobComment> {
  const res = await serverFetch<TApiResponse<TJobComment>>(`/jobs/${jobId}/comments`, {
    method: "POST",
    body: { content },
  });
  if (!res.data) throw new Error("Failed to add comment");
  revalidatePath("/jobs");
  revalidatePath(`/jobs/${jobId}`);
  return res.data;
}

export async function getCommentsAction(jobId: string): Promise<TJobComment[]> {
  const res = await serverFetch<TApiResponse<TJobComment[]>>(`/jobs/${jobId}/comments`, {
    params: { limit: 50 },
  });
  return res.data ?? [];
}