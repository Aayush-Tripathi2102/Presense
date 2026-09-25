import { runBoundedCrawl } from "./crawler/runner";
import { FREE_TIER_LIMITS, type CrawlResult } from "./crawler/types";
import { evaluateAll } from "./rules/registry";
import type { RuleFinding } from "./rules/types";

/**
 * SEO agent pipeline (gameplan §6, vault pipeline).
 * Crawler facts → rules → context → (AI later) → recommendations.
 * Each agent declares status honestly: complete | needs_data | planned.
 */

export type AgentStatus = "complete" | "needs_data" | "planned";

export interface AgentResult {
  agent: "crawler" | "technical" | "content" | "keyword" | "competitor";
  status: AgentStatus;
  summary: string;
  evidenceRefs: string[];
}

export interface AuditPipeline {
  crawl: CrawlResult;
  findings: RuleFinding[];
  passCount: number;
  agents: AgentResult[];
}

const TECH_RULES = new Set([
  "SEO-CRAWL-001", "SEO-CRAWL-002", "SEO-CRAWL-003", "SEO-CRAWL-004", "SEO-CRAWL-005",
  "SEO-INDEX-001", "SEO-INDEX-002", "SEO-INDEX-003",
  "SEO-SITEMAP-001", "SEO-SITEMAP-002", "SEO-SITEMAP-003",
  "SEO-TECH-001", "SEO-TECH-002", "SEO-PERF-001", "SEO-CWV-001",
]);
const CONTENT_RULES = new Set([
  "SEO-ONPAGE-001", "SEO-ONPAGE-002", "SEO-ONPAGE-003", "SEO-ONPAGE-004",
  "SEO-ONPAGE-005", "SEO-ONPAGE-006", "SEO-ONPAGE-007",
  "SEO-SCHEMA-001", "SEO-SCHEMA-002", "SEO-SCHEMA-003",
  "SEO-MEDIA-001", "SEO-MEDIA-002", "SEO-LINK-001", "SEO-LINK-002",
]);

export async function runSeoPipeline(entryUrl: string): Promise<AuditPipeline> {
  const crawl = await runBoundedCrawl(entryUrl, FREE_TIER_LIMITS);
  const { findings, passCount } = evaluateAll(crawl);

  const techCount = findings.filter((f) => TECH_RULES.has(f.ruleId)).length;
  const contentCount = findings.filter((f) => CONTENT_RULES.has(f.ruleId)).length;

  const agents: AgentResult[] = [
    {
      agent: "crawler",
      status: "complete",
      summary: `Crawled ${crawl.pages.length} page(s); ${crawl.skipped.length} skipped. Scope: same-origin, robots-respected.`,
      evidenceRefs: crawl.pages.slice(0, 5).map((p) => p.url),
    },
    {
      agent: "technical",
      status: "complete",
      summary: `${techCount} technical finding(s) across crawlability, indexability, sitemap, HTTPS, and lab performance.`,
      evidenceRefs: findings.filter((f) => TECH_RULES.has(f.ruleId)).slice(0, 5).map((f) => f.ruleId),
    },
    {
      agent: "content",
      status: "complete",
      summary: `${contentCount} on-page finding(s). AI interpretation of topic coverage and quality is planned — deterministic signals only.`,
      evidenceRefs: findings.filter((f) => CONTENT_RULES.has(f.ruleId)).slice(0, 5).map((f) => f.ruleId),
    },
    {
      agent: "keyword",
      status: "needs_data",
      summary: "Demand, query, and position analysis requires a read-only Search Console connection.",
      evidenceRefs: ["integration:google-search-console"],
    },
    {
      agent: "competitor",
      status: "planned",
      summary: "Competitor discovery, gap analysis, and AI-visibility benchmarking ship after the audit loop is reliable.",
      evidenceRefs: [],
    },
  ];

  return { crawl, findings, passCount, agents };
}
