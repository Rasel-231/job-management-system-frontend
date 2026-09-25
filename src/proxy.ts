import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const adminPaths = ["/admin"];
const userPaths = ["/dashboard"];
const authPaths = ["/login", "/register"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const role = request.cookies.get("role")?.value;

  const isAuthenticated = Boolean(accessToken);
  const isAdminPath = adminPaths.some((p) => pathname.startsWith(p));
  const isUserPath = userPaths.some((p) => pathname.startsWith(p));
  const isAuthPath = authPaths.some((p) => pathname.startsWith(p));


  if (isAuthenticated && isAuthPath) {
    const redirectUrl = role === "ADMIN" ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }


  if (!isAuthenticated && (isAdminPath || isUserPath)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }


  if (isAuthenticated) {
    if (isAdminPath && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (isUserPath && role !== "USER") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/login", "/register"],
};