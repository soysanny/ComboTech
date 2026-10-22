import { NextResponse, type NextRequest } from "next/server";
import type { UserRole } from "@/types/common";

/**
 * Single role-based route-guard enforcement point for the role-scoped route
 * groups.
 *
 * NOTE ON LOCATION: Next.js now executes this logic from `src/proxy.ts`
 * (or the project root) — never from inside `app/`.
 *
 * The session role is read from a cookie (`svc_session`) so it is available on
 * the edge. The auth flow (later milestone) writes this cookie alongside the
 * persisted Redux session; proxy never reads client-only localStorage.
 */

const SESSION_COOKIE = "svc_session";

interface SessionCookie {
  role: UserRole;
}

/** Route prefixes that require a specific role. */
const ROLE_PREFIXES: { prefix: string; role: UserRole }[] = [
  { prefix: "/admin", role: "admin" },
];

/**
 * Staff auth page. The storefront has no customer accounts, so the only
 * guarded pages are the staff login and the role-scoped portals.
 */
const AUTH_PREFIXES = ["/login"];

function readSession(request: NextRequest): SessionCookie | null {
  const raw = request.cookies.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<SessionCookie>;
    if (parsed.role === "admin" || parsed.role === "user") {
      return { role: parsed.role };
    }
    return null;
  } catch {
    return null;
  }
}

function startsWithAny(pathname: string, prefixes: string[]): boolean {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const session = readSession(request);

  // 1) Role-scoped portals (admin).
  for (const { prefix, role } of ROLE_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      if (!session) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }
      if (session.role !== role) {
        return NextResponse.redirect(new URL("/403", request.url));
      }
      return NextResponse.next();
    }
  }

  // 2) Staff auth pages are for logged-out visitors only.
  if (startsWithAny(pathname, AUTH_PREFIXES) && session) {
    const home = session.role === "admin" ? "/admin/dashboard" : "/";
    return NextResponse.redirect(new URL(home, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
  missing: [
    { type: "header", key: "next-router-prefetch" },
    { type: "header", key: "purpose", value: "prefetch" },
  ],
};
