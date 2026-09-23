import { getAllUsers } from "../../../../features/user/server";
import UserApprovalClient from "../../../../features/user/UserApprovalClient";

// SERVER COMPONENT — row data fetched server-side; filter & page live in the URL.
export const dynamic = "force-dynamic";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const filter = sp.filter ?? "ALL";
  const page = Math.max(1, Number(sp.page) || 1);

  const { users, meta } = await getAllUsers(
    filter !== "ALL" ? { status: filter } : undefined,
    page,
    10
  );

  return (
    <UserApprovalClient
      initialUsers={users}
      initialFilter={filter}
      initialPage={page}
      initialTotalPages={meta?.totalPages ?? 1}
    />
  );
}