import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { seedServices } from "@/lib/seed";
import { loginSchema } from "@/lib/validation";
import { createSession, setSessionCookie } from "@/core/auth/session";
import { audit } from "@/core/audit";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  await seedServices().catch(() => {});
  const user = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  const token = await createSession({ userId: user.id, email: user.email });
  await setSessionCookie(token);
  await audit("user.login", { userId: user.id });
  return NextResponse.json({ ok: true });
}
