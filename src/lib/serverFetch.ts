import "server-only";
import { cookies } from "next/headers";
import { API_BASE_URL } from "./config";
import { parseSetCookie } from "./parseSetCookie";

// SERVER-SIDE HTTP client. Used only inside Server Components (page.tsx
// files with no "use client") and Server Actions to fetch data. Reads the
// httpOnly accessToken cookie via next/headers — never touches localStorage,
// which doesn't exist on the server. The `import "server-only"` guard makes
// it a build error if a Client Component ever imports this by mistake.
//
// Like the client axios layer, it silently refreshes once on a 401 (the
// backend re-issues the httpOnly cookies over /auth/refresh-token); if the
// refresh fails the caller sees the original error.
type TServerFetchOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  params?: Record<string, string | number | undefined>;
};

const FETCH_TIMEOUT_MS = 15_000;

async function doFetch<T>(path: string, options: TServerFetchOptions): Promise<Response> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const isFormData = options.body instanceof FormData;

  const url = new URL(`${API_BASE_URL}${path}`);
  if (options.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.set(key, String(value));
    });
  }

  return fetch(url.toString(), {
    method: options.method || "GET",
    headers: isFormData
      ? { ...(cookieHeader ? { Cookie: cookieHeader } : {}) }
      : {
          "Content-Type": "application/json",
          // The backend authenticates via the httpOnly accessToken cookie — forward
          // the whole cookie jar instead of an Authorization header so server-side
          // fetches reach it with the real session.
          ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        },
    body: isFormData ? (options.body as FormData) : options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
}

async function tryRefreshSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  if (!cookieHeader) return false;

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { Cookie: cookieHeader },
      cache: "no-store",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  } catch {
    return false;
  }
  if (!res.ok) return false;
  for (const header of res.headers.getSetCookie()) {
    const parsed = parseSetCookie(header);
    cookieStore.set(parsed.name, parsed.value, parsed.options);
  }
  return true;
}

export async function serverFetch<T>(path: string, options: TServerFetchOptions = {}): Promise<T> {
  const pathIsAuthEndpoint = path.includes("/auth/login") || path.includes("/auth/refresh-token");

  let res = await doFetch(path, options);

  if (res.status === 401 && !pathIsAuthEndpoint) {
    const refreshed = await tryRefreshSession();
    if (refreshed) res = await doFetch(path, options);
  }

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || `Request failed with status ${res.status}`);
  }

  return res.json() as Promise<T>;
}