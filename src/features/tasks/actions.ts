"use server";

import { revalidatePath } from "next/cache";
import { serverFetch } from "../../lib/serverFetch";
import { TApiResponse } from "../../types/apiResponse";
import { TTask } from "./types";

// SERVER ACTIONS for task lifecycle: apply, accept, complete a step, submit
// proof, and review (approve/reject).

export async function applyForJobAction(jobId: string): Promise<TTask> {
  const res = await serverFetch<TApiResponse<TTask>>("/tasks/apply", { method: "POST", body: { jobId } });
  if (!res.data) throw new Error("Failed to apply");
  revalidatePath("/jobs");
  revalidatePath(`/jobs/${jobId}`);
  revalidatePath("/dashboard/my-tasks");
  return res.data;
}

export async function acceptApplicationAction(taskId: string): Promise<TTask> {
  const res = await serverFetch<TApiResponse<TTask>>(`/tasks/${taskId}/accept`, { method: "POST" });
  if (!res.data) throw new Error("Failed to accept application");
  revalidatePath("/dashboard/my-jobs");
  revalidatePath("/admin/tasks");
  revalidatePath("/dashboard/my-tasks");
  return res.data;
}

export async function completeStepAction(taskId: string, stepId: string): Promise<TTask> {
  const res = await serverFetch<TApiResponse<TTask>>(`/tasks/${taskId}/complete-step`, {
    method: "POST",
    body: { stepId },
  });
  if (!res.data) throw new Error("Failed to update step");
  revalidatePath("/dashboard/my-tasks");
  revalidatePath("/dashboard/my-jobs");
  return res.data;
}

export async function submitProofAction(taskId: string, formData: FormData): Promise<TTask> {
  const res = await serverFetch<TApiResponse<TTask>>(`/tasks/${taskId}/submit-proof`, {
    method: "POST",
    body: formData,
  });
  if (!res.data) throw new Error("Failed to submit proof");
  revalidatePath("/dashboard/my-tasks");
  revalidatePath("/dashboard/my-jobs");
  revalidatePath("/admin/tasks");
  return res.data;
}

export async function reviewTaskAction(taskId: string, status: "APPROVED" | "REJECTED", note?: string): Promise<TTask> {
  const res = await serverFetch<TApiResponse<TTask>>(`/tasks/${taskId}/review`, {
    method: "PATCH",
    body: { status, note },
  });
  if (!res.data) throw new Error("Failed to review task");
  revalidatePath("/dashboard/my-jobs");
  revalidatePath("/dashboard/my-tasks");
  revalidatePath("/admin/tasks");
  revalidatePath("/dashboard");
  return res.data;
}