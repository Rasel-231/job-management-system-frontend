import { getMyDisputesWithOptions } from "../../../../features/disputes/server";
import MyDisputesClient from "../../../../features/disputes/MyDisputesClient";

// SERVER COMPONENT — disputes and dispute-form options fetched server-side.
export const dynamic = "force-dynamic";

export default async function MyDisputesPage() {
  const { disputes, jobs, tasks } = await getMyDisputesWithOptions();
  return <MyDisputesClient initialDisputes={disputes} initialJobOptions={jobs} initialTasks={tasks} />;
}