"use client";

import { usePathname, useRouter } from "next/navigation";

// Client-side helper for searchParams-driven Server Component pages.
// Filter/pagination state lives in the URL; the server re-fetches the row
// data and the client just navigates. Reduces every list page to one source
// of truth and keeps mutations on the server.

export type TUrlParams = Record<string, string | number | undefined>;

// Omits "empty" values (undefined, "", "ALL", default page 1) so URLs stay clean.
export function buildQuery(params: TUrlParams): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "" || value === "ALL" || String(value) === "1") continue;
    search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export function usePushToUrl() {
  const router = useRouter();
  const pathname = usePathname();
  return (params: TUrlParams) => router.push(`${pathname}${buildQuery(params)}`);
}