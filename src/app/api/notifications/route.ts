import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/core/auth/session";

export async function GET() {
  const user = await requireUser().catch(() => null);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [notifications, logs] = await Promise.all([
    db.notification.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 20 }),
    db.auditLog.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 30 }),
  ]);
  return NextResponse.json({ notifications, auditLogs: logs });
}

export async function PUT(req: Request) {
  const user = await requireUser().catch(() => null);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await db.notification.updateMany({ where: { userId: user.id }, data: { read: true } });
  return NextResponse.json({ ok: true });
}
