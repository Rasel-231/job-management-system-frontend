import { getAdminJobs } from "../../../../features/jobs/server";
import AdminJobsClient from "../../../../features/jobs/AdminJobsClient";

export const dynamic = "force-dynamic";

export default async function AdminJobsPage() {
  const jobs = await getAdminJobs(1, 50);

  return <AdminJobsClient initialJobs={jobs} />;
}