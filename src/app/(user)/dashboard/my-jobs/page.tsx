import { getMyJobs } from "../../../../features/jobs/server";
import { getJobApplications } from "../../../../features/tasks/server";
import { TTask } from "../../../../features/tasks/types";
import MyJobsClient from "../../../../features/jobs/MyJobsClient";

// SERVER COMPONENT — the poster's jobs AND each job's applications are
// fetched server-side (httpOnly cookie forwarded). Poster actions (accept /
// approve / reject) run as Server Actions in the client component.
export const dynamic = "force-dynamic";

export default async function MyJobsPage() {
  const jobs = await getMyJobs();
  const applicationsByJob: Record<string, TTask[]> = {};
  await Promise.all(
    jobs.map(async (job) => {
      applicationsByJob[job.id] = await getJobApplications(job.id);
    })
  );

  return <MyJobsClient initialJobs={jobs} initialApplicationsByJob={applicationsByJob} />;
}