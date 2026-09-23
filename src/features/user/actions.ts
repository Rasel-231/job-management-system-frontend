"use server";

import { revalidatePath } from "next/cache";
import { serverFetch } from "../../lib/serverFetch";
import { TApiResponse } from "../../types/apiResponse";
import { TUserRow } from "./types";

// SERVER ACTIONS for admin user management.

export async function updateUserStatusAction(id: string, status: "PENDING" | "ACTIVE" | "BLOCKED"): Promise<TUserRow> {
  const res = await serverFetch<TApiResponse<TUserRow>>(`/users/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
  if (!res.data) throw new Error("Failed to update user status");
  revalidatePath("/admin/users");
  return res.data;
}

export async function updateUserWarningAction(id: string, action: "warn" | "clear"): Promise<TUserRow> {
  const res = await serverFetch<TApiResponse<TUserRow>>(`/users/${id}/warnings`, {
    method: "PATCH",
    body: { action },
  });
  if (!res.data) throw new Error("Failed to update user warning");
  revalidatePath("/admin/users");
  return res.data;
}

export async function updateUserAction(id: string, payload: {
  name?: string;
  email?: string;
  phone?: string | null;
  role?: "ADMIN" | "USER";
  accountType?: "JOB_SEEKER" | "JOB_POSTER" | "BOTH";
  status?: "PENDING" | "ACTIVE" | "BLOCKED";
  isVerified?: boolean;
  isPhoneVerified?: boolean;
}): Promise<TUserRow> {
  const res = await serverFetch<TApiResponse<TUserRow>>(`/users/${id}`, { method: "PATCH", body: payload });
  if (!res.data) throw new Error("Failed to update user");
  revalidatePath("/admin/users");
  return res.data;
}

export async function deleteUserAction(id: string): Promise<{ id: string; name: string; email: string }> {
  const res = await serverFetch<TApiResponse<{ id: string; name: string; email: string }>>(`/users/${id}`, {
    method: "DELETE",
  });
  if (!res.data) throw new Error("Failed to delete user");
  revalidatePath("/admin/users");
  return res.data;
}