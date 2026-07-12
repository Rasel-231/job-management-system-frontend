import { serverFetch } from "../../../../lib/serverFetch";
import { TApiResponse } from "../../../../types/apiResponse";
import { TJob } from "../../../../features/jobs/types";
import JobMarketClient from "../../../../features/jobs/JobMarketClient";

export default async function JobMarketPage() {
  const res = await serverFetch<TApiResponse<TJob[]>>("/jobs", { params: { page: 1, limit: 50 } });

  return <JobMarketClient initialJobs={res.data ?? []} />;
}
