import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const { token } = await req.json().catch(() => ({}));
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });
  const user = await db.user.findFirst({ where: { verificationToken: String(token) } });
  if (!user) return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  await db.user.update({ where: { id: user.id }, data: { emailVerified: true, verificationToken: null } });
  return NextResponse.json({ ok: true });
}
