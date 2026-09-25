import { NextResponse } from "next/server";
import { clearSessionCookie, getSession } from "@/core/auth/session";
import { audit } from "@/core/audit";

export async function POST() {
  const s = await getSession();
  if (s) await audit("user.logout", { userId: s.userId });
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
