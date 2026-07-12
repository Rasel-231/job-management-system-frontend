import { serverFetch } from "../../../../lib/serverFetch";
import { TApiResponse } from "../../../../types/apiResponse";
import { TJob } from "../../../../features/jobs/types";
import AdminJobsClient from "../../../../features/jobs/AdminJobsClient";

export default async function AdminJobsPage() {
  const res = await serverFetch<TApiResponse<TJob[]>>("/jobs", { params: { page: 1, limit: 50 } });

  return <AdminJobsClient initialJobs={res.data ?? []} />;
}
