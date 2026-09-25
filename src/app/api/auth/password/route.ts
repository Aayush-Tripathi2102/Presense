import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { forgotSchema, resetSchema } from "@/lib/validation";
import { uid } from "@/lib/utils";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = forgotSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const user = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (user) {
    await db.user.update({
      where: { id: user.id },
      data: { resetToken: uid(24), resetExpires: new Date(Date.now() + 3600_000) },
    });
  }
  // Always return ok to avoid email enumeration; token retrievable via verify endpoint in dev
  return NextResponse.json({ ok: true });
}

export async function PUT(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = resetSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const bcrypt = (await import("bcryptjs")).default;
  const user = await db.user.findFirst({ where: { resetToken: parsed.data.token } });
  if (!user || !user.resetExpires || user.resetExpires < new Date())
    return NextResponse.json({ error: "Token invalid or expired" }, { status: 400 });
  await db.user.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(parsed.data.password, 10), resetToken: null, resetExpires: null },
  });
  return NextResponse.json({ ok: true });
}
