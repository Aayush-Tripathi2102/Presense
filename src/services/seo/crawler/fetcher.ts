import { lookup } from "node:dns/promises";
import type { CrawlLimits, RobotsInfo, SitemapInfo } from "./types";

export const CRAWLER_UA = "TaroBot/0.1 (+https://taro.app/bot; polite bounded audit crawler)";

/* ── URL utilities ─────────────────────────────────────────────── */

export function normalizeUrl(raw: string, base?: string): string | null {
  try {
    const u = base ? new URL(raw, base) : new URL(raw);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    u.hash = "";
    // Strip obvious tracking params, keep the rest (vault: keep params that change content)
    for (const p of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "fbclid", "gclid"]) {
      u.searchParams.delete(p);
    }
    // Normalize trailing slash + lowercase host
    u.hostname = u.hostname.toLowerCase();
    return u.toString();
  } catch { return null; }
}

export function rootDomainOf(url: string): string {
  return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
}

/* ── SSRF protection ─────────────────────────────────────────────
   User-supplied URLs are untrusted. Resolve every fetch target (and
   every redirect hop) and refuse private / internal / metadata IPs. */

function isPublicIpv4(ip: string): boolean {
  const p = ip.split(".").map(Number);
  if (p.length !== 4 || p.some((n) => Number.isNaN(n) || n < 0 || n > 255)) return false;
  const [a, b] = p;
  if (a === 10) return false;
  if (a === 172 && b >= 16 && b <= 31) return false;
  if (a === 192 && b === 168) return false;
  if (a === 127) return false;
  if (a === 169 && b === 254) return false; // cloud metadata
  if (a === 0) return false;
  return true;
}

function isPublicIpv6(ip: string): boolean {
  const low = ip.toLowerCase();
  if (low === "::1") return false;
  if (low.startsWith("fc") || low.startsWith("fd")) return false; // unique local
  if (low.startsWith("fe80")) return false; // link local
  return true;
}

export async function assertPublicTarget(url: string): Promise<void> {
  // Test escape hatch for local fixture audits. Never set in production.
  if (process.env.TARO_CRAWLER_ALLOW_PRIVATE === "1") return;
  const host = new URL(url).hostname;
  // Literal IPs
  if (/^\d+\.\d+\.\d+\.\d+$/.test(host)) {
    if (!isPublicIpv4(host)) throw new Error(`SSRF_BLOCKED: non-public IPv4 ${host}`);
    return;
  }
  if (host.includes(":")) {
    if (!isPublicIpv6(host)) throw new Error(`SSRF_BLOCKED: non-public IPv6 ${host}`);
    return;
  }
  if (["localhost"].includes(host.toLowerCase()) || host.toLowerCase().endsWith(".local")) {
    throw new Error(`SSRF_BLOCKED: local hostname ${host}`);
  }
  const addrs = await lookup(host, { all: true });
  for (const a of addrs) {
    const ok = a.family === 4 ? isPublicIpv4(a.address) : isPublicIpv6(a.address);
    if (!ok) throw new Error(`SSRF_BLOCKED: ${host} resolves to non-public ${a.address}`);
  }
}

/* ── Bounded fetch ─────────────────────────────────────────────── */

export interface FetchOutcome {
  finalUrl: string;
  statusCode: number;
  contentType: string;
  headers: Record<string, string>;
  redirectChain: string[];
  body: string;
  loadMs: number;
  truncated: boolean;
}

export async function safeFetch(url: string, limits: CrawlLimits): Promise<FetchOutcome> {
  let current = url;
  const chain: string[] = [];
  const started = Date.now();

  for (let hop = 0; hop <= limits.maxRedirects; hop++) {
    await assertPublicTarget(current);
    const t0 = Date.now();
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), limits.fetchTimeoutMs);
    let res: Response;
    try {
      res = await fetch(current, {
        signal: ctrl.signal,
        redirect: "manual",
        headers: { "User-Agent": CRAWLER_UA, Accept: "text/html,application/xhtml+xml" },
      });
    } finally { clearTimeout(timer); }

    const status = res.status;
    if ([301, 302, 303, 307, 308].includes(status)) {
      const loc = res.headers.get("location");
      if (!loc) throw new Error(`REDIRECT_NO_LOCATION at ${current}`);
      chain.push(current);
      const next = normalizeUrl(loc, current);
      if (!next) throw new Error(`REDIRECT_BAD_LOCATION ${loc}`);
      if (chain.includes(next)) throw new Error(`REDIRECT_LOOP at ${next}`);
      current = next;
      await res.arrayBuffer().catch(() => null);
      continue;
    }

    const headers: Record<string, string> = {};
    res.headers.forEach((v, k) => { headers[k.toLowerCase()] = v; });
    const contentType = res.headers.get("content-type") ?? "";

    // Bounded body read
    const reader = res.body?.getReader();
    const chunks: Uint8Array[] = [];
    let bytes = 0;
    let truncated = false;
    if (reader) {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        if (bytes > limits.maxBytes) { truncated = true; await reader.cancel().catch(() => {}); break; }
        chunks.push(value);
      }
    }
    const buf = Buffer.concat(chunks.map((c) => Buffer.from(c)));
    return {
      finalUrl: current, statusCode: status, contentType, headers,
      redirectChain: chain, body: buf.toString("utf-8"), loadMs: Date.now() - t0, truncated,
    };
  }
  void started;
  throw new Error(`TOO_MANY_REDIRECTS for ${url}`);
}

/* ── robots.txt ────────────────────────────────────────────────── */

export function parseRobots(txt: string): { disallows: string[]; allows: string[]; sitemaps: string[] } {
  const disallows: string[] = [];
  const allows: string[] = [];
  const sitemaps: string[] = [];
  let inStarGroup = false;
  let sawAgent = false;
  for (const rawLine of txt.split("\n")) {
    const line = rawLine.split("#")[0].trim();
    if (!line) continue;
    const m = line.match(/^([A-Za-z-]+)\s*:\s*(.*)$/);
    if (!m) continue;
    const key = m[1].toLowerCase();
    const val = m[2].trim();
    if (key === "user-agent") {
      sawAgent = true;
      inStarGroup = val === "*" || val.toLowerCase().includes("tarobot");
    } else if (key === "sitemap") {
      if (val) sitemaps.push(val);
    } else if (sawAgent && inStarGroup) {
      if (key === "disallow" && val) disallows.push(val);
      if (key === "allow" && val) allows.push(val);
    }
  }
  return { disallows, allows, sitemaps };
}

export function robotsAllows(path: string, rules: { disallows: string[]; allows: string[] }): boolean {
  // Longest-match wins (simplified): explicit allow beats disallow on prefix length
  let blockedBy: string | null = null;
  for (const d of rules.disallows) {
    if (d === "/") { blockedBy = d; continue; }
    if (path.startsWith(d) && (!blockedBy || d.length > blockedBy.length)) blockedBy = d;
  }
  if (!blockedBy) return true;
  for (const a of rules.allows) {
    if (path.startsWith(a) && a.length >= blockedBy.length) return true;
  }
  return false;
}

export async function fetchRobots(origin: string, limits: CrawlLimits): Promise<RobotsInfo> {
  const url = `${origin}/robots.txt`;
  try {
    const r = await safeFetch(url, { ...limits, maxBytes: 256 * 1024 });
    if (r.statusCode !== 200 || !r.contentType.includes("text")) {
      return { present: false, allowsHomepage: true, allowsLlms: false, sitemaps: [], raw: null };
    }
    const rules = parseRobots(r.body);
    const low = r.body.toLowerCase();
    const allowsLlms = ["gptbot", "oai-searchbot", "perplexitybot", "google-extended"].some(
      (bot) => low.includes(`user-agent: ${bot}`) && !low.includes(`user-agent: ${bot}\ndisallow: /`)
    );
    return {
      present: true,
      allowsHomepage: robotsAllows("/", rules),
      allowsLlms,
      sitemaps: rules.sitemaps,
      raw: r.body.slice(0, 4000),
    };
  } catch {
    return { present: false, allowsHomepage: true, allowsLlms: false, sitemaps: [], raw: null };
  }
}

/* ── Sitemaps ──────────────────────────────────────────────────── */

function extractLocs(xml: string, cap: number): string[] {
  const out: string[] = [];
  const re = /<loc>\s*([^<]+?)\s*<\/loc>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) && out.length < cap) out.push(m[1].trim());
  return out;
}

export async function fetchSitemap(urls: string[], limits: CrawlLimits): Promise<SitemapInfo> {
  const empty: SitemapInfo = { present: false, parses: false, urlCount: 0, hasLastmod: false, urls: [] };
  for (const smUrl of urls.slice(0, 4)) {
    try {
      const r = await safeFetch(smUrl, { ...limits, maxBytes: 5 * 1024 * 1024 });
      if (r.statusCode !== 200) continue;
      if (!/<urlset|<sitemapindex/i.test(r.body)) continue;
      const isIndex = /<sitemapindex/i.test(r.body);
      const locs = extractLocs(r.body, 600);
      if (isIndex) {
        // One level of index expansion
        const nested: string[] = [];
        for (const child of locs.slice(0, 10)) {
          try {
            const cr = await safeFetch(child, { ...limits, maxBytes: 5 * 1024 * 1024 });
            if (cr.statusCode === 200 && /<urlset/i.test(cr.body)) nested.push(...extractLocs(cr.body, 600));
          } catch { /* skip bad child */ }
        }
        return { present: true, parses: true, urlCount: nested.length, hasLastmod: /<lastmod>/i.test(r.body), urls: nested.slice(0, 500) };
      }
      return { present: true, parses: true, urlCount: locs.length, hasLastmod: /<lastmod>/i.test(r.body), urls: locs.slice(0, 500) };
    } catch { /* try next candidate */ }
  }
  return empty;
}
