import { getMyTasks } from "../../../../features/tasks/server";
import MyTasksClient from "../../../../features/tasks/MyTasksClient";

// SERVER COMPONENT — the participant's tasks are fetched server-side.
export const dynamic = "force-dynamic";

export default async function MyTasksPage() {
  const tasks = await getMyTasks();
  return <MyTasksClient initialTasks={tasks} />;
}