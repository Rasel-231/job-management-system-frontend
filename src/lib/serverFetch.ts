import "server-only";
import { cookies } from "next/headers";

// SERVER-SIDE HTTP client. Used only inside Server Components (page.tsx
// files with no "use client") to fetch initial render data. Reads the
// httpOnly accessToken cookie via next/headers — never touches localStorage,
// which doesn't exist on the server. The `import "server-only"` guard makes
// it a build error if a Client Component ever imports this by mistake.
type TServerFetchOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  params?: Record<string, string | number | undefined>;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

export async function serverFetch<T>(path: string, options: TServerFetchOptions = {}): Promise<T> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const url = new URL(`${BASE_URL}${path}`);
  if (options.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.set(key, String(value));
    });
  }

  const res = await fetch(url.toString(), {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || `Request failed with status ${res.status}`);
  }

  return res.json();
}
