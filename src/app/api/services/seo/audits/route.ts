import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { audit } from "@/core/audit";
import { runSeoPipeline } from "@/services/seo/agents";
import { prioritize, scoreFindings } from "@/services/seo/scoring";
import { siteForUser } from "../_guard";

const startAudit = z.object({ siteId: z.string().min(1) });

/** Audit history for a site. */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const gate = await siteForUser(searchParams.get("siteId") ?? "");
  if ("error" in gate) return gate.error;
  const audits = await db.seoAudit.findMany({
    where: { siteId: gate.site.id },
    orderBy: { startedAt: "desc" },
    take: 20,
    select: { id: true, status: true, health: true, stats: true, startedAt: true, finishedAt: true, error: true },
  });
  return NextResponse.json({ audits: audits.map((a) => ({ ...a, stats: JSON.parse(a.stats) })) });
}

/**
 * Run a bounded audit inline: crawl → deterministic rules → score → persist.
 * Pilot budget caps the run (~25 pages / 100s). No AI calls.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = startAudit.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const gate = await siteForUser(parsed.data.siteId);
  if ("error" in gate) return gate.error;

  const record = await db.seoAudit.create({ data: { siteId: gate.site.id, status: "running" } });
  try {
    const pipeline = await runSeoPipeline(gate.site.url);
    const score = scoreFindings(pipeline.findings);
    const ordered = prioritize(pipeline.findings);

    // Persist pages
    const pageIdByUrl = new Map<string, string>();
    for (const p of pipeline.crawl.pages) {
      const saved = await db.seoPage.create({
        data: {
          auditId: record.id, url: p.url, finalUrl: p.finalUrl, statusCode: p.statusCode,
          title: p.title, wordCount: p.wordCount, loadMs: p.loadMs,
          facts: JSON.stringify({
            canonical: p.canonical, robotsMeta: p.robotsMeta, xRobotsTag: p.xRobotsTag,
            lang: p.lang, h1: p.h1, h2Count: p.h2.length, wordCount: p.wordCount,
            images: p.images.length, internalLinks: p.links.filter((l) => l.internal).length,
            externalLinks: p.links.filter((l) => !l.internal).length,
            schemaTypes: p.jsonLd.map((b) => b.type), redirectChain: p.redirectChain,
            loadMs: p.loadMs, jsAppHeuristic: p.jsAppHeuristic,
          }),
        },
      });
      pageIdByUrl.set(p.url, saved.id);
    }
    // Persist issues (fails + warnings + unknowns, each with evidence)
    for (const f of ordered) {
      await db.seoIssue.create({
        data: {
          auditId: record.id,
          pageId: f.pageUrl ? pageIdByUrl.get(f.pageUrl) ?? null : null,
          ruleId: f.ruleId, category: f.category, severity: f.severity, status: f.status,
          message: f.message, evidence: JSON.stringify(f.evidence), recommendation: f.recommendation,
        },
      });
    }
    const stats = {
      pagesCrawled: pipeline.crawl.pages.length,
      skipped: pipeline.crawl.skipped.length,
      passCount: pipeline.passCount,
      counts: score.counts, bySeverity: score.bySeverity,
    };
    await db.seoAudit.update({
      where: { id: record.id },
      data: {
        status: "complete", health: score.health, stats: JSON.stringify(stats),
        agents: JSON.stringify(pipeline.agents), finishedAt: new Date(),
      },
    });
    await audit("seo.audit.complete", { userId: gate.user.id, entity: "seo_audit", entityId: record.id, metadata: { siteId: gate.site.id, health: score.health } });
    return NextResponse.json({ auditId: record.id, health: score.health, stats, agents: pipeline.agents });
  } catch (e) {
    await db.seoAudit.update({
      where: { id: record.id },
      data: { status: "failed", error: e instanceof Error ? e.message.slice(0, 500) : "audit-failed", finishedAt: new Date() },
    });
    return NextResponse.json({ error: e instanceof Error ? e.message.slice(0, 200) : "Audit failed" }, { status: 500 });
  }
}
