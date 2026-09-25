import type { CrawlResult, PageFacts, SiteFacts } from "../crawler/types";
import type { RuleDef, RuleFinding } from "./types";

/**
 * Deterministic rule registry. Every rule maps to a source-checklist
 * question; every finding carries the evidence that produced it.
 * Statuses: fail | warning | unknown (passes are counted, not stored).
 */

function F(
  rule: RuleDef, status: RuleFinding["status"], pageUrl: string | null,
  message: string, evidence: Record<string, unknown>
): RuleFinding {
  return {
    ruleId: rule.id, category: rule.category, severity: rule.severity,
    status, pageUrl, message, evidence, recommendation: rule.recommendation,
  };
}

export const RULES: RuleDef[] = [
  // Crawlability (checklist impact 8)
  { id: "SEO-CRAWL-001", category: "crawlability", question: "Is your website crawlable (homepage fetchable)?", impact: 8, severity: "critical", detection: "A", automation: "deterministic", recommendation: "Restore a 200 HTML response for the homepage; check DNS, TLS, and server errors." },
  { id: "SEO-CRAWL-002", category: "crawlability", question: "Are crawled pages free of server errors?", impact: 8, severity: "critical", detection: "A", automation: "deterministic", recommendation: "Fix 5xx responses and redirect loops; verify origin health and timeouts." },
  { id: "SEO-CRAWL-003", category: "crawlability", question: "Are redirect chains short (≤3 hops)?", impact: 8, severity: "high", detection: "A", automation: "deterministic", recommendation: "Flatten chains so each URL resolves in one hop to its final destination." },
  { id: "SEO-CRAWL-004", category: "crawlability", question: "Do you have a robots.txt file?", impact: 2, severity: "medium", detection: "A", automation: "deterministic", recommendation: "Publish /robots.txt declaring crawl rules and sitemap locations." },
  { id: "SEO-CRAWL-005", category: "crawlability", question: "Does robots.txt allow the homepage and key paths?", impact: 8, severity: "critical", detection: "A", automation: "deterministic", recommendation: "Remove overly broad Disallow rules blocking important URLs." },
  { id: "SEO-CRAWL-006", category: "crawlability", question: "Do LLM crawlers have explicit access rules?", impact: 8, severity: "info", detection: "A", automation: "deterministic", recommendation: "Declare per-bot rules for GPTBot / OAI-SearchBot / PerplexityBot explicitly; access preference, not a ranking lever." },
  // Indexability (impact 8)
  { id: "SEO-INDEX-001", category: "indexability", question: "Are indexable pages free of noindex directives?", impact: 8, severity: "critical", detection: "A", automation: "deterministic", recommendation: "Remove accidental noindex / none directives from pages meant to rank." },
  { id: "SEO-INDEX-002", category: "indexability", question: "Is a canonical declared?", impact: 8, severity: "medium", detection: "A", automation: "deterministic", recommendation: "Declare a canonical URL on every indexable page." },
  { id: "SEO-INDEX-003", category: "indexability", question: "Is the canonical absolute, same-origin, and consistent?", impact: 8, severity: "high", detection: "A", automation: "deterministic", recommendation: "Use absolute same-origin canonicals matching the served URL." },
  // Sitemap
  { id: "SEO-SITEMAP-001", category: "sitemap", question: "Do you have a sitemap?", impact: 2, severity: "medium", detection: "A", automation: "deterministic", recommendation: "Publish an XML sitemap and reference it from robots.txt." },
  { id: "SEO-SITEMAP-002", category: "sitemap", question: "Does the sitemap parse with live URLs?", impact: 2, severity: "high", detection: "A", automation: "deterministic", recommendation: "Keep the sitemap parseable and limited to URLs that resolve with 200." },
  { id: "SEO-SITEMAP-003", category: "sitemap", question: "Do you include <lastmod> tags?", impact: 3, severity: "low", detection: "A", automation: "deterministic", recommendation: "Add accurate <lastmod> values so crawlers can prioritize fresh content." },
  // On-page
  { id: "SEO-ONPAGE-001", category: "on-page", question: "Is a title present?", impact: 8, severity: "high", detection: "A", automation: "deterministic", recommendation: "Write a unique descriptive title for every page." },
  { id: "SEO-ONPAGE-002", category: "on-page", question: "Is the title a useful length (30–60 chars)?", impact: 8, severity: "low", detection: "A", automation: "deterministic", recommendation: "Treat length as an editing aid: front-load the distinctive terms." },
  { id: "SEO-ONPAGE-003", category: "on-page", question: "Is the title unique site-wide?", impact: 8, severity: "medium", detection: "A", automation: "deterministic", recommendation: "Differentiate duplicate titles so each page has a distinct promise." },
  { id: "SEO-ONPAGE-004", category: "on-page", question: "Is a meta description present?", impact: 1, severity: "low", detection: "A", automation: "deterministic", recommendation: "Add a compelling description to influence click-through (low direct ranking impact)." },
  { id: "SEO-ONPAGE-005", category: "on-page", question: "Is exactly one H1 present?", impact: 8, severity: "medium", detection: "A", automation: "deterministic", recommendation: "Use one H1 per page naming its topic; multiple H1s are a diagnostic, not an automatic penalty." },
  { id: "SEO-ONPAGE-006", category: "on-page", question: "Does the page have substantive text (≥300 words)?", impact: 8, severity: "low", detection: "A", automation: "deterministic", recommendation: "Expand thin pages with genuinely useful coverage, not filler." },
  { id: "SEO-ONPAGE-007", category: "on-page", question: "Is the HTML language declared?", impact: 8, severity: "low", detection: "A", automation: "deterministic", recommendation: "Set a valid lang attribute on <html>." },
  // Links
  { id: "SEO-LINK-001", category: "links", question: "Are internal links free of broken targets?", impact: 8, severity: "high", detection: "A", automation: "deterministic", recommendation: "Fix or remove internal links pointing at 4xx/5xx pages." },
  { id: "SEO-LINK-002", category: "links", question: "Are pages reachable (no orphans)?", impact: 8, severity: "medium", detection: "A", automation: "deterministic", recommendation: "Link orphan pages from relevant contextual passages." },
  // Structured data
  { id: "SEO-SCHEMA-001", category: "structured-data", question: "Does JSON-LD parse without errors?", impact: 5, severity: "high", detection: "A", automation: "deterministic", recommendation: "Fix malformed JSON-LD blocks; validate with schema.org tooling." },
  { id: "SEO-SCHEMA-002", category: "structured-data", question: "Is Organization schema with sameAs present?", impact: 5, severity: "high", detection: "A", automation: "deterministic", recommendation: "Add Organization schema with sameAs links to official profiles (entity consistency)." },
  { id: "SEO-SCHEMA-003", category: "structured-data", question: "FAQ schema usage note", impact: 5, severity: "info", detection: "A", automation: "deterministic", recommendation: "FAQ rich results were discontinued by Google (May 2026 changelog). Q&A content still helps users; do not expect rich-result treatment." },
  // Media
  { id: "SEO-MEDIA-001", category: "media", question: "Do images carry alt text?", impact: 8, severity: "medium", detection: "A", automation: "deterministic", recommendation: "Add descriptive alt text where the image conveys meaning." },
  { id: "SEO-MEDIA-002", category: "media", question: "Do images declare dimensions?", impact: 8, severity: "low", detection: "A", automation: "deterministic", recommendation: "Declare width/height to reduce layout shift (CLS)." },
  // Technical
  { id: "SEO-TECH-001", category: "technical", question: "Is your site fully on HTTPS?", impact: 5, severity: "critical", detection: "A", automation: "deterministic", recommendation: "Serve the entire site over HTTPS with valid certificates." },
  { id: "SEO-TECH-002", category: "technical", question: "Is HSTS enabled?", impact: 5, severity: "medium", detection: "A", automation: "deterministic", recommendation: "Send Strict-Transport-Security headers." },
  { id: "SEO-PERF-001", category: "performance", question: "Does the page respond fast (<2s single sample)?", impact: 8, severity: "high", detection: "A", automation: "deterministic", recommendation: "Investigate slow responses; this is one lab sample, not field Core Web Vitals." },
  // Data-dependent — UNKNOWN by design (vault Decision 003)
  { id: "SEO-SEARCH-001", category: "search-performance", question: "What is actual search performance (queries, CTR, position)?", impact: 8, severity: "info", detection: "B", automation: "needs_data", recommendation: "Connect Google Search Console (read-only) to replace UNKNOWN with measured queries and pages." },
  { id: "SEO-CWV-001", category: "performance", question: "Are field Core Web Vitals passing?", impact: 6, severity: "info", detection: "B", automation: "needs_data", recommendation: "Import PageSpeed Insights / CrUX field data; lab timing alone cannot pass or fail this." },
  { id: "SEO-GEO-001", category: "ai-visibility", question: "How does the brand appear in AI answers?", impact: 8, severity: "info", detection: "E", automation: "planned", recommendation: "Planned: reproducible prompt panel with sampled answers, citations, and accuracy review." },
];

const BY_ID = new Map(RULES.map((r) => [r.id, r]));
export function ruleById(id: string): RuleDef { return BY_ID.get(id)!; }

/* ── Evaluators ────────────────────────────────────────────────── */

export function evaluateSite(result: CrawlResult): RuleFinding[] {
  const out: RuleFinding[] = [];
  const { site, pages } = result;
  const okPages = pages.filter((p) => p.statusCode === 200);
  const R = ruleById;

  // CRAWL-001/002
  if (!site.homepage || site.homepage.statusCode !== 200) {
    out.push(F(R("SEO-CRAWL-001"), "fail", null, `Homepage not fetchable (status ${site.homepage?.statusCode ?? "none"}).`, { statusCode: site.homepage?.statusCode ?? null }));
  }
  const serverErrors = pages.filter((p) => p.statusCode >= 500);
  if (serverErrors.length) {
    out.push(F(R("SEO-CRAWL-002"), "fail", null, `${serverErrors.length} page(s) returned 5xx.`, { urls: serverErrors.slice(0, 10).map((p) => ({ url: p.url, status: p.statusCode })) }));
  }
  // CRAWL-003 chains
  const longChains = pages.filter((p) => p.redirectChain.length > 3);
  if (longChains.length) {
    out.push(F(R("SEO-CRAWL-003"), "warning", null, `${longChains.length} page(s) with chains > 3 hops.`, { examples: longChains.slice(0, 5).map((p) => ({ url: p.url, chain: p.redirectChain })) }));
  }
  // CRAWL-004/005/006 robots
  if (!site.robots.present) {
    out.push(F(R("SEO-CRAWL-004"), "warning", null, "No robots.txt found.", { checked: "/robots.txt" }));
  } else if (!site.robots.allowsHomepage) {
    out.push(F(R("SEO-CRAWL-005"), "fail", null, "robots.txt blocks the homepage for generic crawlers.", { raw: site.robots.raw }));
  }
  if (!site.robots.allowsLlms) {
    out.push(F(R("SEO-CRAWL-006"), "warning", null, "No explicit allow rules for major LLM crawlers detected.", { present: site.robots.present }));
  }
  // SITEMAP
  if (!site.sitemap.present) {
    out.push(F(R("SEO-SITEMAP-001"), "warning", null, "No parseable XML sitemap discovered.", { tried: ["robots Sitemap:", "/sitemap.xml", "/sitemap_index.xml"] }));
  } else {
    if (!site.sitemap.parses || site.sitemap.urlCount === 0) {
      out.push(F(R("SEO-SITEMAP-002"), "fail", null, "Sitemap found but unparseable or empty.", { urlCount: site.sitemap.urlCount }));
    }
    if (!site.sitemap.hasLastmod) {
      out.push(F(R("SEO-SITEMAP-003"), "warning", null, "Sitemap lacks <lastmod> entries.", { urlCount: site.sitemap.urlCount }));
    }
  }
  // TECH
  if (!site.https) {
    out.push(F(R("SEO-TECH-001"), "fail", null, "Site entry point is not HTTPS.", {}));
  }
  if (!site.hsts) {
    out.push(F(R("SEO-TECH-002"), "warning", null, "No Strict-Transport-Security header observed on homepage.", {}));
  }
  // SCHEMA-002 organization site-wide
  const hasOrg = pages.some((p) => p.jsonLd.some((b) => /organization/i.test(b.type)));
  if (!hasOrg) {
    out.push(F(R("SEO-SCHEMA-002"), "warning", null, "No Organization schema found on crawled pages.", { pagesChecked: okPages.length }));
  }
  // LINK-001 broken internal (targets observed with 4xx/5xx during crawl)
  const badTargets = new Map<string, number>();
  for (const p of pages) if (p.statusCode >= 400) badTargets.set(p.url, p.statusCode);
  if (badTargets.size) {
    const sources: { from: string; to: string }[] = [];
    for (const p of okPages) {
      for (const l of p.links) {
        if (l.internal && badTargets.has(l.href)) sources.push({ from: p.url, to: l.href });
        if (sources.length >= 20) break;
      }
      if (sources.length >= 20) break;
    }
    out.push(F(R("SEO-LINK-001"), sources.length ? "fail" : "warning", null,
      `${badTargets.size} crawled URL(s) return errors${sources.length ? " and are linked internally" : ""}.`,
      { broken: [...badTargets.entries()].slice(0, 10).map(([url, status]) => ({ url, status })), linkedFrom: sources.slice(0, 10) }));
  }
  // LINK-002 orphans (no internal inlinks, excluding homepage)
  const inlinked = new Set<string>();
  for (const p of okPages) for (const l of p.links) if (l.internal) inlinked.add(l.href);
  const orphans = okPages.filter((p) => p.url !== site.homepage?.url && !inlinked.has(p.url) && !inlinked.has(p.finalUrl));
  if (orphans.length) {
    out.push(F(R("SEO-LINK-002"), "warning", null, `${orphans.length} page(s) with no observed internal inlinks.`, { urls: orphans.slice(0, 10).map((p) => p.url) }));
  }
  // Data-dependent unknowns
  out.push(F(R("SEO-SEARCH-001"), "unknown", null, "Search performance unknown — no Search Console connection.", { requiredIntegration: "google-search-console" }));
  out.push(F(R("SEO-CWV-001"), "unknown", null, "Field Core Web Vitals unknown — no PSI/CrUX import.", { note: "Single-sample lab timing only" }));
  out.push(F(R("SEO-GEO-001"), "unknown", null, "AI-answer visibility unknown — prompt panel not yet run (planned).", {}));

  void R;
  return out;
}

export function evaluatePage(page: PageFacts, titleCounts: Map<string, number>): RuleFinding[] {
  const out: RuleFinding[] = [];
  const R = ruleById;
  if (page.statusCode !== 200) return out; // error pages covered by site rules
  const u = page.url;

  if (!page.title) out.push(F(R("SEO-ONPAGE-001"), "fail", u, "Missing <title>.", {}));
  else {
    const len = page.title.length;
    if (len < 30 || len > 60) {
      out.push(F(R("SEO-ONPAGE-002"), "warning", u, `Title is ${len} characters (editing aid: 30–60).`, { title: page.title }));
    }
    if ((titleCounts.get(page.title) ?? 0) > 1) {
      out.push(F(R("SEO-ONPAGE-003"), "warning", u, "Title is duplicated across pages.", { title: page.title }));
    }
  }
  if (!page.metaDescription) out.push(F(R("SEO-ONPAGE-004"), "warning", u, "Missing meta description.", {}));
  if (page.h1.length === 0) out.push(F(R("SEO-ONPAGE-005"), "fail", u, "Missing H1.", {}));
  else if (page.h1.length > 1) out.push(F(R("SEO-ONPAGE-005"), "warning", u, `${page.h1.length} H1s found (diagnostic).`, { h1: page.h1.slice(0, 5) }));
  if (page.wordCount < 300) out.push(F(R("SEO-ONPAGE-006"), "warning", u, `Only ${page.wordCount} words of visible text.`, { wordCount: page.wordCount }));
  if (!page.lang) out.push(F(R("SEO-ONPAGE-007"), "warning", u, "Missing html lang attribute.", {}));
  if (!page.canonical) out.push(F(R("SEO-INDEX-002"), "warning", u, "Missing canonical.", {}));
  else {
    try {
      const c = new URL(page.canonical, page.finalUrl);
      const f = new URL(page.finalUrl);
      if (c.hostname.toLowerCase() !== f.hostname.toLowerCase()) {
        out.push(F(R("SEO-INDEX-003"), "fail", u, "Canonical points to a different host.", { canonical: page.canonical }));
      }
    } catch {
      out.push(F(R("SEO-INDEX-003"), "fail", u, "Canonical is not a valid absolute URL.", { canonical: page.canonical }));
    }
  }
  const robotsDirectives = `${page.robotsMeta ?? ""} ${page.xRobotsTag ?? ""}`;
  if (/noindex|none/.test(robotsDirectives)) {
    out.push(F(R("SEO-INDEX-001"), "fail", u, `Page declares noindex (${robotsDirectives.trim()}).`, { robotsMeta: page.robotsMeta, xRobotsTag: page.xRobotsTag }));
  }
  for (const b of page.jsonLd) {
    if (b.type === "__PARSE_ERROR__") {
      out.push(F(R("SEO-SCHEMA-001"), "fail", u, "A JSON-LD block failed to parse.", { sample: b.raw.slice(0, 300) }));
      break;
    }
  }
  const missingAlt = page.images.filter((i) => !i.alt || !i.alt.trim());
  if (missingAlt.length) {
    out.push(F(R("SEO-MEDIA-001"), "warning", u, `${missingAlt.length}/${page.images.length} images missing alt text.`, { examples: missingAlt.slice(0, 5).map((i) => i.src) }));
  }
  const missingDims = page.images.filter((i) => !i.width || !i.height);
  if (missingDims.length && page.images.length) {
    out.push(F(R("SEO-MEDIA-002"), "warning", u, `${missingDims.length}/${page.images.length} images missing dimensions.`, {}));
  }
  if (page.loadMs >= 2000) {
    out.push(F(R("SEO-PERF-001"), page.loadMs >= 4000 ? "fail" : "warning", u, `Single-sample response took ${(page.loadMs / 1000).toFixed(1)}s.`, { loadMs: page.loadMs }));
  }
  return out;
}

export function evaluateAll(result: CrawlResult): { findings: RuleFinding[]; passCount: number } {
  const findings = [...evaluateSite(result)];
  const titleCounts = new Map<string, number>();
  for (const p of result.pages) {
    if (p.title) titleCounts.set(p.title, (titleCounts.get(p.title) ?? 0) + 1);
  }
  for (const p of result.pages) findings.push(...evaluatePage(p, titleCounts));
  // passCount = evaluated rule slots minus findings (approximation, documented)
  const slots = RULES.filter((r) => r.automation === "deterministic").length * Math.max(1, result.pages.length);
  return { findings, passCount: Math.max(0, slots - findings.length) };
}
