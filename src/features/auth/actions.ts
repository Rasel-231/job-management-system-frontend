"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { serverFetch } from "../../lib/serverFetch";
import { API_BASE_URL } from "../../lib/config";
import { parseSetCookie } from "../../lib/parseSetCookie";
import { TApiResponse } from "../../types/apiResponse";
import { TAccountType, TUser } from "./types";

const SESSION_COOKIES = ["accessToken", "refreshToken", "role"];

type TAuthResult = { ok: true; user: TUser } | { ok: false; error: string };
type TLoginData = { accessToken: string; user: TUser };
type TRegisterInput = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  accountType?: TAccountType;
};

async function authenticate(url: string, payload: unknown): Promise<TAuthResult> {
  const cookieStore = await cookies();
  const res = await fetch(`${API_BASE_URL}${url}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as TApiResponse<TLoginData>;
  if (!res.ok) return { ok: false, error: data.message || "Authentication failed" };
  for (const header of res.headers.getSetCookie()) {
    const parsed = parseSetCookie(header);
    cookieStore.set(parsed.name, parsed.value, parsed.options);
  }
  if (!data.data?.user) return { ok: false, error: "No user returned" };
  return { ok: true, user: data.data.user };
}

export async function loginAction(input: { email: string; password: string; redirectTo?: string }): Promise<TAuthResult> {
  return authenticate("/auth/login", { email: input.email, password: input.password });
}

export async function registerAction(input: TRegisterInput): Promise<TAuthResult> {
  return authenticate("/auth/register", {
    name: input.name,
    email: input.email,
    password: input.password,
    phone: input.phone,
    accountType: input.accountType,
  });
}

export async function socialLoginAction(provider: "google" | "facebook", token: string, accountType?: TAccountType): Promise<TAuthResult> {
  return authenticate(`/auth/social/${provider}`, { token, accountType });
}

export async function logoutAction(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: { ...(cookieHeader ? { Cookie: cookieHeader } : {}) },
      cache: "no-store",
    });
  } catch {
    // clear client cookies regardless of backend success
  }
  const cookieStore = await cookies();
  SESSION_COOKIES.forEach((name) => cookieStore.delete(name));
  redirect("/login");
}

export async function getCurrentUserAction(): Promise<TUser | null> {
  try {
    const res = await serverFetch<TApiResponse<TUser>>("/auth/me");
    return res.data ?? null;
  } catch {
    return null;
  }
}

export async function requestOtpAction(phone: string): Promise<{ message: string; devOtp?: string }> {
  const res = await serverFetch<TApiResponse<{ message: string; devOtp?: string }>>("/auth/otp/request", {
    method: "POST",
    body: { phone },
  });
  return res.data ?? { message: "OTP sent" };
}

export async function verifyOtpAction(phone: string, code: string): Promise<TUser> {
  const res = await serverFetch<TApiResponse<TUser>>("/auth/otp/verify", {
    method: "POST",
    body: { phone, code },
  });
  if (!res.data) throw new Error("OTP verification failed");
  return res.data;
}

export async function updateProfileAction(payload: {
  name?: string;
  bio?: string;
  skillTags?: string[];
  avatarUrl?: string;
  phone?: string;
  accountType?: TAccountType;
}): Promise<TUser> {
  const res = await serverFetch<TApiResponse<TUser>>("/auth/me", {
    method: "PATCH",
    body: payload,
  });
  if (!res.data) throw new Error("Failed to update profile");
  return res.data;
}