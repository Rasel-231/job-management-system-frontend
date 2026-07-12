import { serverFetch } from "../../../../lib/serverFetch";
import { TApiResponse } from "../../../../types/apiResponse";
import { TAdminTask } from "../../../../features/tasks/types";
import AdminTaskReviewClient from "../../../../features/tasks/AdminTaskReviewClient";

export default async function AdminTasksPage() {
  const res = await serverFetch<TApiResponse<TAdminTask[]>>("/tasks", {
    params: { status: "PENDING", page: 1, limit: 10 },
  });

  return <AdminTaskReviewClient initialTasks={res.data ?? []} />;
}
