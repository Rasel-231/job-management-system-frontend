import "server-only";
import { redirect } from "next/navigation";
import { serverFetch } from "./serverFetch";
import { TApiResponse } from "../types/apiResponse";
import { TUser } from "../features/auth/types";

// SERVER-SIDE AUTH GUARDS. Use inside Server Components / Server Actions only —
// the httpOnly cookie is read from next/headers which does not exist client-side.
// The backend /auth/me is the single source of truth for the logged-in user.

export async function getServerUser(): Promise<TUser | null> {
  try {
    const res = await serverFetch<TApiResponse<TUser>>("/auth/me");
    return res.data ?? null;
  } catch {
    return null;
  }
}

export async function requireUser(): Promise<TUser> {
  const user = await getServerUser();
  if (!user || user.status !== "ACTIVE") {
    redirect("/login");
  }
  return user;
}

export async function requireAdmin(): Promise<TUser> {
  const user = await getServerUser();
  if (!user || user.role !== "ADMIN" || user.status !== "ACTIVE") {
    redirect(user ? "/jobs" : "/login");
  }
  return user;
}