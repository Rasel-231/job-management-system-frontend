import { getFeedJobs } from "../../../features/jobs/server";
import { getMyTasks } from "../../../features/tasks/server";
import { getServerUser } from "../../../lib/auth";
import JobMarketClient from "../../../features/jobs/JobMarketClient";

// PUBLIC ROUTE — /jobs. SERVER COMPONENT: initial feed (search / category /
// page driven by searchParams) is fetched server-side with the httpOnly cookie
// forwarded. The client only handles interactivity (like/comment/apply) via
// Server Actions. Guests can browse — the backend uses optionalAuthenticate.
export const dynamic = "force-dynamic";

export default async function PublicJobsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const searchTerm = sp.search ?? "";
  const category = sp.category ?? "__ALL__";
  const page = Math.max(1, Number(sp.page) || 1);

  const { jobs, meta } = await getFeedJobs({
    searchTerm: searchTerm || undefined,
    category: category !== "__ALL__" ? category : undefined,
    page,
    limit: 10,
  });

  const user = await getServerUser();
  const appliedJobIds = user ? (await getMyTasks()).map((task) => task.job.id) : [];

  return (
    <JobMarketClient
      initialJobs={jobs}
      initialPage={page}
      initialHasMore={(meta?.totalPages ?? 1) > page}
      appliedJobIds={appliedJobIds}
      initialSearchTerm={searchTerm}
      initialCategory={category}
    />
  );
}