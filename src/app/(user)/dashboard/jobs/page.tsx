import { redirect } from "next/navigation";

// Kept for legacy deep links — the job feed now lives at the public /jobs route.
export default function JobMarketRedirect() {
  redirect("/jobs");
}