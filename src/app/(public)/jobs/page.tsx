import JobMarketClient from "../../../features/jobs/JobMarketClient";

// PUBLIC ROUTE — /jobs. The job feed is browsable without login (backend uses
// optionalAuthenticate on GET /jobs). Interactive actions (apply/like/comment)
// prompt login from the client components.
export default function PublicJobsPage() {
  return <JobMarketClient />;
}