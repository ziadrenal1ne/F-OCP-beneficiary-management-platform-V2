import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "focp-dev-secret-please-change-in-production-0001"
);
const COOKIE_NAME = "focp_session";

async function getRole(req: NextRequest): Promise<"ADMIN" | "COOPERATIVE" | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return (payload.role as "ADMIN" | "COOPERATIVE") ?? null;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const role = await getRole(req);

  const isAuthPage = pathname === "/login";
  const isProtected = pathname.startsWith("/admin") || pathname.startsWith("/cooperative");

  if (isAuthPage) {
    if (role === "ADMIN") return NextResponse.redirect(new URL("/admin", req.url));
    if (role === "COOPERATIVE") return NextResponse.redirect(new URL("/cooperative", req.url));
    return NextResponse.next();
  }

  if (isProtected && !role) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname.startsWith("/cooperative") && role !== "COOPERATIVE") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/cooperative/:path*", "/login"],
};
