import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/core/auth/session";
import { workspaceSchema } from "@/lib/validation";
import { slugify } from "@/lib/utils";
import { audit } from "@/core/audit";

export async function GET(req: Request) {
  const user = await requireUser().catch(() => null);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const organizationId = searchParams.get("organizationId");
  const where = organizationId ? { organizationId } : {
    organization: { members: { some: { userId: user.id } } },
  };
  const workspaces = await db.workspace.findMany({ where, include: { organization: true } });
  return NextResponse.json({ workspaces });
}

export async function POST(req: Request) {
  const user = await requireUser().catch(() => null);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const parsed = workspaceSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const ws = await db.workspace.create({
    data: { organizationId: parsed.data.organizationId, name: parsed.data.name, slug: slugify(parsed.data.name), website: parsed.data.website },
  });
  await audit("workspace.create", { userId: user.id, entity: "workspace", entityId: ws.id });
  return NextResponse.json({ workspace: ws });
}
