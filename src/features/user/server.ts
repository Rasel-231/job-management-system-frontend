import "server-only";
import { serverFetch } from "../../lib/serverFetch";
import { TApiResponse, TMeta } from "../../types/apiResponse";
import { TUserRow } from "./types";

// SERVER-SIDE DATA LOADERS for user management (admin) and the public profile.

export async function getAllUsers(
  filters?: { status?: string; search?: string },
  page = 1,
  limit = 10
): Promise<{ users: TUserRow[]; meta?: TMeta }> {
  const res = await serverFetch<TApiResponse<TUserRow[]>>("/users", {
    params: {
      status: filters?.status && filters.status !== "ALL" ? filters.status : undefined,
      searchTerm: filters?.search || undefined,
      page,
      limit,
    },
  });
  return { users: res.data ?? [], meta: res.meta };
}

export async function getPublicUser(id: string): Promise<TUserRow> {
  const res = await serverFetch<TApiResponse<TUserRow>>(`/users/${id}`);
  if (!res.data) throw new Error("User not found");
  return res.data;
}