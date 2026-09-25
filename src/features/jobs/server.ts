import "server-only";
import { serverFetch } from "../../lib/serverFetch";
import { TApiResponse, TMeta } from "../../types/apiResponse";
import { TJob, TJobComment } from "./types";

// SERVER-SIDE DATA LOADERS for jobs. Imported ONLY by Server Components
// (pages) to fetch initial render data. Every call runs on the server with
// the httpOnly cookie forwarded via serverFetch.

export async function getFeedJobs(params?: {
  searchTerm?: string;
  category?: string;
  page?: number;
  limit?: number;
}): Promise<{ jobs: TJob[]; meta?: TMeta }> {
  const res = await serverFetch<TApiResponse<TJob[]>>("/jobs", { params });
  return { jobs: res.data ?? [], meta: res.meta };
}

export async function getSingleJob(id: string): Promise<TJob> {
  const res = await serverFetch<TApiResponse<TJob>>(`/jobs/${id}`);
  if (!res.data) throw new Error("Job not found");
  return res.data;
}

export async function getMyJobs(): Promise<TJob[]> {
  const res = await serverFetch<TApiResponse<TJob[]>>("/jobs/my-jobs");
  return res.data ?? [];
}

export async function getAdminJobs(page = 1, limit = 50): Promise<{ jobs: TJob[]; meta?: TMeta }> {
  const res = await serverFetch<TApiResponse<TJob[]>>("/jobs", { params: { page, limit } });
  return { jobs: res.data ?? [], meta: res.meta };
}

export async function getComments(jobId: string): Promise<TJobComment[]> {
  const res = await serverFetch<TApiResponse<TJobComment[]>>(`/jobs/${jobId}/comments`, {
    params: { limit: 50 },
  });
  return res.data ?? [];
}