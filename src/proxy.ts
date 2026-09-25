import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Auth gate (Next 16 Proxy convention). Runs before dashboard routes render. */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/dashboard") && !req.cookies.get("taro_session")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*"] };
