import "server-only";
import { serverFetch } from "../../lib/serverFetch";
import { TApiResponse, TMeta } from "../../types/apiResponse";
import { TTask } from "../tasks/types";
import { TDispute } from "./types";

// SERVER-SIDE DATA LOADERS for disputes.

export async function getMyDisputes(): Promise<TDispute[]> {
  const res = await serverFetch<TApiResponse<TDispute[]>>("/disputes/my");
  return res.data ?? [];
}

export async function getAllDisputes(
  status?: string,
  page = 1,
  limit = 10
): Promise<{ disputes: TDispute[]; meta?: TMeta }> {
  const res = await serverFetch<TApiResponse<TDispute[]>>("/disputes", {
    params: { status: status && status !== "ALL" ? status : undefined, page, limit },
  });
  return { disputes: res.data ?? [], meta: res.meta };
}

// Everything the "open a dispute" form needs in one server round-trip:
// existing disputes, the user's own jobs, and the tasks linked to them.
export async function getMyDisputesWithOptions(): Promise<{
  disputes: TDispute[];
  jobs: { id: string; title: string }[];
  tasks: TTask[];
}> {
  const [disputes, jobsRes, tasksRes] = await Promise.all([
    getMyDisputes(),
    serverFetch<TApiResponse<{ id: string; title: string }[]>>("/jobs/my-jobs"),
    serverFetch<TApiResponse<TTask[]>>("/tasks/my-tasks"),
  ]);
  const tasks = tasksRes.data ?? [];
  const seen = new Set<string>();
  const jobs: { id: string; title: string }[] = [];
  (jobsRes.data ?? []).forEach((j) => {
    seen.add(j.id);
    jobs.push(j);
  });
  tasks.forEach((t) => {
    if (!seen.has(t.job.id)) {
      seen.add(t.job.id);
      jobs.push({ id: t.job.id, title: t.job.title });
    }
  });
  return { disputes, jobs, tasks };
}