import { getAllTasksAdmin } from "../../../../features/tasks/server";
import AdminTaskReviewClient from "../../../../features/tasks/AdminTaskReviewClient";

// SERVER COMPONENT — row data fetched server-side; filter & page live in the URL.
export const dynamic = "force-dynamic";

export default async function AdminTasksPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const filter = sp.filter ?? "ALL";
  const page = Math.max(1, Number(sp.page) || 1);

  const { tasks, meta } = await getAllTasksAdmin(filter, page, 10);

  return (
    <AdminTaskReviewClient
      initialTasks={tasks}
      initialFilter={filter}
      initialPage={page}
      initialTotalPages={meta?.totalPages ?? 1}
    />
  );
}