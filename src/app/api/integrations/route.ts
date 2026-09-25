import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/core/auth/session";
import { INTEGRATION_CATALOGUE } from "@/integrations/catalogue";
import { audit } from "@/core/audit";

export async function GET() {
  const user = await requireUser().catch(() => null);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const integrations = await db.integration.findMany().catch(() => []);
  return NextResponse.json({
    catalogue: INTEGRATION_CATALOGUE,
    integrations: integrations.length ? integrations : INTEGRATION_CATALOGUE,
  });
}

export async function POST(req: Request) {
  const user = await requireUser().catch(() => null);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { workspaceId, integrationSlug } = await req.json().catch(() => ({}));
  if (!workspaceId || !integrationSlug) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const integration = await db.integration.findUnique({ where: { slug: integrationSlug } });
  if (!integration) return NextResponse.json({ error: "Unknown integration" }, { status: 404 });
  const conn = await db.integrationConnection.create({
    data: { workspaceId, integrationId: integration.id, status: "connected", metadata: "{}" },
  });
  await audit(`integration.connect:${integrationSlug}`, { userId: user.id, entity: "integration", entityId: conn.id, metadata: { workspaceId } });
  return NextResponse.json({ ok: true, connection: conn });
}
