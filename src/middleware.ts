import { NextResponse, type NextRequest } from "next/server";

type UserRole = "ADMIN" | "PESERTA";

const TOKEN_COOKIE = "quiz-bsi-token";
const ROLE_COOKIE = "quiz-bsi-role";
const validRoles: UserRole[] = ["ADMIN", "PESERTA"];

const adminRoutes = ["/dashboard", "/users", "/questions", "/packages", "/classes"];
const pesertaRoutes = ["/student", "/join", "/exam"];
const publicRoutes = ["/login", "/register"];

function startsWithAny(pathname: string, routes: string[]) {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const roleCookie = request.cookies.get(ROLE_COOKIE)?.value;
  const role = validRoles.includes(roleCookie as UserRole) ? (roleCookie as UserRole) : undefined;
  const isAuthenticated = Boolean(token && role);

  if (startsWithAny(pathname, publicRoutes) && isAuthenticated) {
    return NextResponse.redirect(new URL(role === "ADMIN" ? "/dashboard" : "/student/dashboard", request.url));
  }

  if (startsWithAny(pathname, adminRoutes)) {
    if (!isAuthenticated) return NextResponse.redirect(new URL("/login", request.url));
    if (role !== "ADMIN") return NextResponse.redirect(new URL("/student/dashboard", request.url));
  }

  if (startsWithAny(pathname, pesertaRoutes)) {
    if (!isAuthenticated) return NextResponse.redirect(new URL("/login", request.url));
    if (role !== "PESERTA") return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/dashboard/:path*",
    "/users/:path*",
    "/questions/:path*",
    "/packages/:path*",
    "/classes/:path*",
    "/student/:path*",
    "/join",
    "/exam/:path*"
  ]
};
