import { extractFacts } from "./extractor";
import { fetchRobots, fetchSitemap, normalizeUrl, rootDomainOf, safeFetch } from "./fetcher";
import type { CrawlLimits, CrawlResult, PageFacts, SiteFacts } from "./types";

/**
 * Bounded polite crawl. One origin, robots respected, budgets enforced.
 * Returns observed facts only — interpretation belongs to the rule engine.
 */
export async function runBoundedCrawl(entryUrl: string, limits: CrawlLimits): Promise<CrawlResult> {
  const startedAt = new Date().toISOString();
  const deadline = Date.now() + limits.totalBudgetMs;
  const skipped: CrawlResult["skipped"] = [];
  const pages: PageFacts[] = [];
  const seen = new Set<string>();

  const normalized = normalizeUrl(entryUrl);
  if (!normalized) throw new Error("INVALID_URL");
  const origin = new URL(normalized).origin;
  const domain = rootDomainOf(normalized);

  // robots + sitemap discovery (Step 2–3 of vault pipeline)
  const robots = await fetchRobots(origin, limits);
  const smCandidates = [
    ...robots.sitemaps,
    `${origin}/sitemap.xml`,
    `${origin}/sitemap_index.xml`,
  ];
  const sitemap = await fetchSitemap(smCandidates, limits);

  // Frontier seeded with homepage + same-origin sitemap URLs
  const queue: { url: string; depth: number }[] = [{ url: normalized, depth: 0 }];
  const inScopeSitemap = sitemap.urls
    .map((u) => normalizeUrl(u))
    .filter((u): u is string => !!u && rootDomainOf(u) === domain);
  for (const u of inScopeSitemap.slice(0, limits.maxPages)) queue.push({ url: u, depth: 1 });

  while (queue.length > 0 && pages.length < limits.maxPages && Date.now() < deadline) {
    const next = queue.shift()!;
    if (seen.has(next.url)) continue;
    seen.add(next.url);

    // robots check per path
    let path = "/";
    try { path = new URL(next.url).pathname || "/"; } catch { skipped.push({ url: next.url, reason: "bad-url" }); continue; }

    try {
      const outcome = await safeFetch(next.url, limits);
      const isHtml = outcome.contentType.includes("text/html") || outcome.contentType === "";
      if (!isHtml || outcome.statusCode === 404 || outcome.statusCode === 410) {
        // Still record stub facts for error pages (evidence for broken-link rules)
        if (outcome.statusCode >= 400) {
          pages.push({
            url: next.url, finalUrl: outcome.finalUrl, statusCode: outcome.statusCode,
            contentType: outcome.contentType, loadMs: outcome.loadMs, redirectChain: outcome.redirectChain,
            headers: outcome.headers, title: null, metaDescription: null, canonical: null,
            robotsMeta: null, xRobotsTag: outcome.headers["x-robots-tag"]?.toLowerCase() || null,
            lang: null, h1: [], h2: [], h3: [], wordCount: 0, visibleTextSample: "",
            links: [], images: [], jsonLd: [], openGraph: {}, hreflang: [],
            jsAppHeuristic: false, fetchedAt: new Date().toISOString(),
          });
        } else skipped.push({ url: next.url, reason: `non-html:${outcome.contentType}` });
        continue;
      }
      const facts = extractFacts(outcome, next.url);
      pages.push(facts);

      // Expand frontier with internal links (Step 7)
      if (next.depth < limits.maxDepth && pages.length + queue.length < limits.maxPages * 2) {
        for (const l of facts.links) {
          if (!l.internal) continue;
          const n = normalizeUrl(l.href);
          if (!n || seen.has(n)) continue;
          try { if (rootDomainOf(n) !== domain) continue; } catch { continue; }
          queue.push({ url: n, depth: next.depth + 1 });
        }
      }
    } catch (e) {
      skipped.push({ url: next.url, reason: e instanceof Error ? e.message.slice(0, 120) : "fetch-failed" });
    }
  }

  if (Date.now() >= deadline) skipped.push({ url: "(budget)", reason: "total-time-budget-exhausted" });

  const homepage = pages.find((p) => p.url === normalized) ?? pages[0] ?? null;
  const https = normalized.startsWith("https://");
  const site: SiteFacts = {
    rootDomain: domain,
    homepage,
    https,
    hsts: (homepage?.headers["strict-transport-security"] ?? "").length > 0,
    robots,
    sitemap,
    llmsTxtPresent: await checkLlmsTxt(origin, limits),
  };

  return { site, pages, skipped, startedAt, finishedAt: new Date().toISOString() };
}

async function checkLlmsTxt(origin: string, limits: CrawlLimits): Promise<boolean> {
  try {
    const r = await safeFetch(`${origin}/llms.txt`, { ...limits, maxBytes: 128 * 1024 });
    return r.statusCode === 200;
  } catch { return false; }
}
