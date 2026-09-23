import { requireUser } from "../../../lib/auth";
import { getMyEarnings } from "../../../features/transactions/server";
import { getMyTasks } from "../../../features/tasks/server";
import { getMyJobs } from "../../../features/jobs/server";
import { TEarningsSummary } from "../../../features/transactions/types";
import { TTask } from "../../../features/tasks/types";
import { TJob } from "../../../features/jobs/types";
import DashboardOverviewClient from "../../../features/dashboard/DashboardOverviewClient";

// SERVER COMPONENT — user, wallet summary, tasks and jobs are all fetched
// server-side (httpOnly cookie). Earnings is tolerant of a missing wallet.
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser();

  const [summary, tasks, jobs]: [TEarningsSummary | null, TTask[], TJob[]] = await Promise.all([
    getMyEarnings().catch(() => null),
    getMyTasks().catch(() => [] as TTask[]),
    getMyJobs().catch(() => [] as TJob[]),
  ]);

  return (
    <DashboardOverviewClient
      initialUser={user}
      initialSummary={summary}
      initialTasks={tasks}
      initialJobs={jobs}
    />
  );
}