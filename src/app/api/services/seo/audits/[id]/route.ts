import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/core/auth/session";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser().catch(() => null);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const auditRec = await db.seoAudit.findFirst({
    where: { id, site: { workspace: { organization: { members: { some: { userId: user.id } } } } } },
    include: {
      site: true,
      pages: { orderBy: { url: "asc" } },
      issues: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!auditRec) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    audit: {
      id: auditRec.id, status: auditRec.status, health: auditRec.health,
      stats: JSON.parse(auditRec.stats), agents: JSON.parse(auditRec.agents),
      startedAt: auditRec.startedAt, finishedAt: auditRec.finishedAt, error: auditRec.error,
      site: { id: auditRec.site.id, domain: auditRec.site.domain, url: auditRec.site.url },
    },
    pages: auditRec.pages.map((p) => ({ ...p, facts: JSON.parse(p.facts) })),
    issues: auditRec.issues.map((i) => ({ ...i, evidence: JSON.parse(i.evidence) })),
  });
}
