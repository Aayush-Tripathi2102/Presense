import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/core/auth/session";
import { orgSchema, workspaceSchema, configSchema } from "@/lib/validation";
import { slugify, uid } from "@/lib/utils";
import { audit } from "@/core/audit";
import { ServiceRegistry } from "@/services/registry";

export async function GET() {
  const user = await requireUser().catch(() => null);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const members = await db.organizationMember.findMany({ where: { userId: user.id }, include: { organization: true } });
  return NextResponse.json({ organizations: members.map((m) => ({ ...m.organization, role: m.role })) });
}

export async function POST(req: Request) {
  const user = await requireUser().catch(() => null);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const parsed = orgSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const org = await db.organization.create({
    data: { name: parsed.data.name, slug: `${slugify(parsed.data.name)}-${uid(6)}` },
  });
  await db.organizationMember.create({ data: { userId: user.id, organizationId: org.id, role: "owner" } });
  await db.workspace.create({ data: { organizationId: org.id, name: "Main Website", slug: "main-website" } });
  await audit("organization.create", { userId: user.id, entity: "organization", entityId: org.id });
  return NextResponse.json({ organization: org });
}
