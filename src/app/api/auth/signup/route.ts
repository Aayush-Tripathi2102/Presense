import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { seedServices } from "@/lib/seed";
import { signupSchema } from "@/lib/validation";
import { createSession, setSessionCookie } from "@/core/auth/session";
import { audit } from "@/core/audit";
import { slugify, uid } from "@/lib/utils";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const { name, email, password } = parsed.data;
  await seedServices().catch(() => {});
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: { email, passwordHash, name, verificationToken: uid(24) },
  });
  // Bootstrap: personal org + workspace so dashboard works immediately
  const org = await db.organization.create({
    data: { name: `${name}'s Business`, slug: `${slugify(email.split("@")[0])}-${uid(6)}` },
  });
  await db.organizationMember.create({ data: { userId: user.id, organizationId: org.id, role: "owner" } });
  await db.workspace.create({ data: { organizationId: org.id, name: "Main Website", slug: "main-website" } });
  await db.subscription.create({ data: { organizationId: org.id, plan: "free" } });
  await audit("user.signup", { userId: user.id, entity: "user", entityId: user.id });
  const token = await createSession({ userId: user.id, email: user.email });
  await setSessionCookie(token);
  return NextResponse.json({ ok: true, verifyToken: user.verificationToken });
}
