"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { serverFetch } from "../../lib/serverFetch";
import { TApiResponse } from "../../types/apiResponse";
import { TAccountType, TUser } from "./types";

// SERVER ACTIONS — all auth mutations leave the browser and run here. Login,
// register and social-login forward the backend's Set-Cookie headers into the
// Next.js response (so httpOnly access/refresh tokens + the `role` session
// marker are issued server-side, never readable by JS). Reads/refreshes also go
// through serverFetch so the httpOnly cookie is never exposed to the client.

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";
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

function parseSetCookie(raw: string): { name: string; value: string; options: Record<string, string | boolean | number | Date> } {
  const [nameValue, ...attrs] = raw.split(";");
  const eq = nameValue.indexOf("=");
  const name = nameValue.slice(0, eq).trim();
  const value = nameValue.slice(eq + 1).trim();
  const options: Record<string, string | boolean | number | Date> = {};
  for (const attr of attrs) {
    const trimmed = attr.trim();
    if (!trimmed) continue;
    const [k, v] = trimmed.split("=");
    const key = k.trim().toLowerCase();
    const val = v?.trim() ?? "";
    if (key === "httponly") options.httpOnly = true;
    else if (key === "secure") options.secure = true;
    else if (key === "samesite") options.sameSite = (val.toLowerCase() === "lax" ? "lax" : val.toLowerCase() === "strict" ? "strict" : "none");
    else if (key === "path") options.path = val || "/";
    else if (key === "domain") options.domain = val;
    else if (key === "max-age") options.maxAge = parseInt(val, 10);
    else if (key === "expires") options.expires = new Date(val);
  }
  return { name, value, options };
}

async function authenticate(url: string, payload: unknown): Promise<TAuthResult> {
  const cookieStore = await cookies();
  const res = await fetch(`${BASE_URL}${url}`, {
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
    await fetch(`${BASE_URL}/auth/logout`, {
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