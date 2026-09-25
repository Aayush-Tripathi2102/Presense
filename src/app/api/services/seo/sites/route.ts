import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { audit } from "@/core/audit";
import { domainOf, workspaceForUser } from "../_guard";

const createSite = z.object({
  workspaceId: z.string().min(1),
  url: z.string().min(4).max(500),
  businessName: z.string().max(120).optional(),
  country: z.string().max(16).optional(),
  offering: z.string().max(200).optional(),
  language: z.string().max(16).optional(),
  outcome: z.string().max(32).optional(),
});

/** List audited sites for a workspace, each with its latest audit summary. */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get("workspaceId") ?? "";
  const gate = await workspaceForUser(workspaceId);
  if ("error" in gate) return gate.error;

  const sites = await db.seoSite.findMany({
    where: { workspaceId },
    orderBy: { updatedAt: "desc" },
    include: { audits: { orderBy: { startedAt: "desc" }, take: 1 } },
  });
  return NextResponse.json({
    sites: sites.map((s) => ({
      id: s.id, domain: s.domain, url: s.url,
      latestAudit: s.audits[0]
        ? { id: s.audits[0].id, status: s.audits[0].status, health: s.audits[0].health, startedAt: s.audits[0].startedAt }
        : null,
    })),
  });
}

/** Register a site (free-tier intake) + store business profile v1. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = createSite.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const gate = await workspaceForUser(parsed.data.workspaceId);
  if ("error" in gate) return gate.error;

  let domain: string;
  try { domain = domainOf(parsed.data.url); }
  catch { return NextResponse.json({ error: "Invalid website URL" }, { status: 400 }); }
  const url = parsed.data.url.startsWith("http") ? parsed.data.url : `https://${parsed.data.url}`;

  const site = await db.seoSite.upsert({
    where: { workspaceId_domain: { workspaceId: parsed.data.workspaceId, domain } },
    update: { url },
    create: { workspaceId: parsed.data.workspaceId, domain, url },
  });
  const { businessName, country, offering, language, outcome } = parsed.data;
  if (businessName || offering) {
    const count = await db.seoBusinessProfile.count({ where: { siteId: site.id } });
    await db.seoBusinessProfile.create({
      data: {
        siteId: site.id, version: count + 1, source: "user",
        profile: JSON.stringify({ businessName, country, offering, language, outcome }),
      },
    });
  }
  await audit("seo.site.register", { userId: gate.user.id, entity: "seo_site", entityId: site.id });
  return NextResponse.json({ site: { id: site.id, domain: site.domain, url: site.url } });
}
