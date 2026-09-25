import * as cheerio from "cheerio";
import type { FetchOutcome } from "./fetcher";
import type { PageFacts } from "./types";

/** HTML → structured facts. Only observed values; nothing inferred. */
export function extractFacts(outcome: FetchOutcome, requestedUrl: string): PageFacts {
  const $ = cheerio.load(outcome.body);
  const text = ($("main").text() || $("body").text() || "").replace(/\s+/g, " ").trim();
  const words = text ? text.split(" ").filter(Boolean) : [];

  const links: PageFacts["links"] = [];
  const base = new URL(outcome.finalUrl);
  $("a[href]").each((_, el) => {
    const raw = ($(el).attr("href") ?? "").trim();
    if (!raw || raw.startsWith("#") || raw.startsWith("mailto:") || raw.startsWith("tel:") || raw.startsWith("javascript:")) return;
    try {
      const abs = new URL(raw, outcome.finalUrl).toString();
      const internal = new URL(abs).hostname.toLowerCase() === base.hostname.toLowerCase();
      const rel = ($(el).attr("rel") ?? "").toLowerCase();
      links.push({
        href: abs,
        anchor: ($(el).text() ?? "").replace(/\s+/g, " ").trim().slice(0, 200),
        rel,
        internal,
        nofollow: rel.includes("nofollow"),
      });
    } catch { /* skip malformed */ }
  });

  const images: PageFacts["images"] = [];
  $("img").each((_, el) => {
    images.push({
      src: ($(el).attr("src") ?? "").slice(0, 500),
      alt: $(el).attr("alt") ?? null,
      width: $(el).attr("width") ?? null,
      height: $(el).attr("height") ?? null,
    });
  });

  const jsonLd: PageFacts["jsonLd"] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    const raw = $(el).html() ?? "";
    try {
      const parsed = JSON.parse(raw);
      const blocks = Array.isArray(parsed) ? parsed : [parsed];
      for (const b of blocks) {
        const t = b?.["@type"];
        jsonLd.push({ type: Array.isArray(t) ? t.join(",") : String(t ?? "Unknown"), raw: raw.slice(0, 4000) });
      }
    } catch {
      jsonLd.push({ type: "__PARSE_ERROR__", raw: raw.slice(0, 1000) });
    }
  });

  const openGraph: Record<string, string> = {};
  $('meta[property^="og:"]').each((_, el) => {
    openGraph[$(el).attr("property") ?? ""] = $(el).attr("content") ?? "";
  });

  const hreflang: PageFacts["hreflang"] = [];
  $('link[rel="alternate"][hreflang]').each((_, el) => {
    hreflang.push({ lang: $(el).attr("hreflang") ?? "", href: $(el).attr("href") ?? "" });
  });

  const h = (sel: string) =>
    $(sel).map((_, el) => ($(el).text() ?? "").replace(/\s+/g, " ").trim()).get().filter(Boolean).slice(0, 50);

  const hasScripts = $("script[src]").length > 0;
  const jsAppHeuristic = words.length < 60 && hasScripts && words.length > 0 ? true : words.length === 0 && hasScripts;

  return {
    url: requestedUrl,
    finalUrl: outcome.finalUrl,
    statusCode: outcome.statusCode,
    contentType: outcome.contentType,
    loadMs: outcome.loadMs,
    redirectChain: outcome.redirectChain,
    headers: outcome.headers,
    title: ($("title").first().text() ?? "").trim() || null,
    metaDescription: $('meta[name="description"]').attr("content")?.trim() || null,
    canonical: $('link[rel="canonical"]').attr("href")?.trim() || null,
    robotsMeta: $('meta[name="robots"]').attr("content")?.trim()?.toLowerCase() || null,
    xRobotsTag: outcome.headers["x-robots-tag"]?.toLowerCase() || null,
    lang: $("html").attr("lang")?.trim() || null,
    h1: h("h1"),
    h2: h("h2"),
    h3: h("h3"),
    wordCount: words.length,
    visibleTextSample: text.slice(0, 2000),
    links: links.slice(0, 2000),
    images: images.slice(0, 500),
    jsonLd,
    openGraph,
    hreflang,
    jsAppHeuristic,
    fetchedAt: new Date().toISOString(),
  };
}
