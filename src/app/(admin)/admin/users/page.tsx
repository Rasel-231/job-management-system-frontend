import { serverFetch } from "../../../../lib/serverFetch";
import { TApiResponse } from "../../../../types/apiResponse";
import { TUserRow } from "../../../../features/user/types";
import UserApprovalClient from "../../../../features/user/UserApprovalClient";

// SERVER COMPONENT — fetches page-1 data on the server (httpOnly cookie
// token via serverFetch). All subsequent filtering/pagination happens
// client-side through axiosInstance inside UserApprovalClient.
export default async function AdminUsersPage() {
  const res = await serverFetch<TApiResponse<TUserRow[]>>("/users", { params: { page: 1, limit: 10 } });

  return <UserApprovalClient initialUsers={res.data ?? []} />;
}
