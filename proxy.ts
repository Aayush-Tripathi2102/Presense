import { NextResponse, type NextRequest } from "next/server";

export function proxy(_req: NextRequest) {
  // Auth is enforced in route handlers + layouts (server-side) so the
  // proxy stays permissive; CSRF + rate-limit hooks attach here later.
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding/:path*", "/api/:path*"],
};
