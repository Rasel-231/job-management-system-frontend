import "server-only";
import { serverFetch } from "../../lib/serverFetch";
import { TApiResponse, TMeta } from "../../types/apiResponse";
import { TAdminTask, TTask } from "./types";

// SERVER-SIDE DATA LOADERS for tasks (applications, progress, review queue).
// Imported only by Server Components / Server Actions.

export async function getMyTasks(): Promise<TTask[]> {
  const res = await serverFetch<TApiResponse<TTask[]>>("/tasks/my-tasks");
  return res.data ?? [];
}

export async function getJobApplications(jobId: string): Promise<TTask[]> {
  const res = await serverFetch<TApiResponse<TTask[]>>(`/tasks/job/${jobId}/applications`);
  return res.data ?? [];
}

export async function getAllTasksAdmin(
  status?: string,
  page = 1,
  limit = 10
): Promise<{ tasks: TAdminTask[]; meta?: TMeta }> {
  const res = await serverFetch<TApiResponse<TAdminTask[]>>("/tasks", {
    params: { status: status && status !== "ALL" ? status : undefined, page, limit },
  });
  return { tasks: res.data ?? [], meta: res.meta };
}

export async function hasAppliedToJob(jobId: string): Promise<boolean> {
  try {
    const tasks = await getMyTasks();
    return tasks.some((task) => task.job.id === jobId);
  } catch {
    return false;
  }
}