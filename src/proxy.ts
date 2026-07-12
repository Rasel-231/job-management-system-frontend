import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Next.js 16 file convention: middleware.ts -> proxy.ts, function middleware -> proxy.
// This is the SERVER-SIDE network boundary: coarse, cookie-based redirects
// that run before any page renders. It intentionally does NOT verify the JWT
// or hit the database — that's what the backend's authenticate/authorize
// middleware is for. This layer only prevents obviously-wrong navigations
// (no session, wrong role section) from ever reaching React.
const adminPaths = ["/admin"];
const userPaths = ["/dashboard"];
const authPaths = ["/login", "/register"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const refreshToken = request.cookies.get("refreshToken")?.value;
  const role = request.cookies.get("role")?.value;

  const isAuthenticated = Boolean(refreshToken);
  const isAdminPath = adminPaths.some((p) => pathname.startsWith(p));
  const isUserPath = userPaths.some((p) => pathname.startsWith(p));
  const isAuthPath = authPaths.some((p) => pathname.startsWith(p));

  if (!isAuthenticated && (isAdminPath || isUserPath)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && isAdminPath && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard/jobs", request.url));
  }

  if (isAuthenticated && isUserPath && role !== "USER") {
    return NextResponse.redirect(new URL("/admin/jobs", request.url));
  }

  if (isAuthenticated && isAuthPath) {
    const destination = role === "ADMIN" ? "/admin/jobs" : "/dashboard/jobs";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/login", "/register"],
};
