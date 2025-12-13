// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = [
  "/",            // مسیر اصلی هم محافظت می‌شود
  "/dashboard",
  "/users",
  "/projects",
  "/activities",
  "/documents",
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;

  const url = request.nextUrl.clone();

  const isProtected = PROTECTED_ROUTES.some(route => url.pathname === route || url.pathname.startsWith(route + "/"));

  // مسیرهای محافظت‌شده بدون توکن → ریدایرکت به /login
  if (isProtected && !token) {
    url.pathname = "/login";
    url.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // اگر کاربر لاگین است و روی /login یا / رفته → ریدایرکت به /dashboard
  if (url.pathname === "/login" && token) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/dashboard/:path*",
    "/users/:path*",
    "/projects/:path*",
    "/activities/:path*",
    "/documents/:path*",
  ],
};
