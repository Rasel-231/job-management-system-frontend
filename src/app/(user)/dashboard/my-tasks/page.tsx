import { serverFetch } from "../../../../lib/serverFetch";
import { TApiResponse } from "../../../../types/apiResponse";
import { TTask } from "../../../../features/tasks/types";
import MyTasksClient from "../../../../features/tasks/MyTasksClient";

export default async function MyTasksPage() {
  const res = await serverFetch<TApiResponse<TTask[]>>("/tasks/my-tasks");

  return <MyTasksClient initialTasks={res.data ?? []} />;
}
