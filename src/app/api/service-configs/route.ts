import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/core/auth/session";
import { configSchema } from "@/lib/validation";
import { audit } from "@/core/audit";

export async function GET(req: Request) {
  const user = await requireUser().catch(() => null);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get("workspaceId");
  const where = workspaceId ? { workspaceId } : {};
  const configs = await db.serviceConfiguration.findMany({ where });
  return NextResponse.json({
    configurations: configs.map((c) => ({ ...c, configuration: JSON.parse(c.configuration) })),
  });
}

export async function POST(req: Request) {
  const user = await requireUser().catch(() => null);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const parsed = configSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const { workspaceId, serviceId, configuration } = parsed.data;
  const saved = await db.serviceConfiguration.upsert({
    where: { workspaceId_serviceId: { workspaceId, serviceId } },
    update: { configuration: JSON.stringify(configuration), status: "configured" },
    create: { workspaceId, serviceId, configuration: JSON.stringify(configuration), status: "configured" },
  });
  await audit("service.configure", { userId: user.id, entity: "service", entityId: serviceId, metadata: { workspaceId } });
  return NextResponse.json({ ok: true, id: saved.id });
}
