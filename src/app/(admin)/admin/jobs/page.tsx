import { getAdminJobs } from "../../../../features/jobs/server";
import AdminJobsClient from "../../../../features/jobs/AdminJobsClient";

export const dynamic = "force-dynamic";

export default async function AdminJobsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);

  const { jobs, meta } = await getAdminJobs(page, 10);

  return (
    <AdminJobsClient
      initialJobs={jobs}
      initialPage={page}
      initialTotalPages={meta?.totalPages ?? 1}
    />
  );
}