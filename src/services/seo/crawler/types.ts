/** Shared crawler fact types. Raw evidence is stored, never invented. */

export interface CrawlLimits {
  maxPages: number;
  maxDepth: number;
  maxBytes: number;
  fetchTimeoutMs: number;
  totalBudgetMs: number;
  maxRedirects: number;
}

export const FREE_TIER_LIMITS: CrawlLimits = {
  maxPages: 25,          // pilot budget (vault suggests ~100 post-measurement)
  maxDepth: 3,
  maxBytes: 2 * 1024 * 1024,
  fetchTimeoutMs: 10_000,
  totalBudgetMs: 100_000,
  maxRedirects: 5,
};

export interface PageLink { href: string; anchor: string; rel: string; internal: boolean; nofollow: boolean; }
export interface PageImage { src: string; alt: string | null; width: string | null; height: string | null; }
export interface SchemaBlock { type: string; raw: string; }

export interface PageFacts {
  url: string;
  finalUrl: string;
  statusCode: number;
  contentType: string;
  loadMs: number;
  redirectChain: string[];
  headers: Record<string, string>;
  title: string | null;
  metaDescription: string | null;
  canonical: string | null;
  robotsMeta: string | null;
  xRobotsTag: string | null;
  lang: string | null;
  h1: string[];
  h2: string[];
  h3: string[];
  wordCount: number;
  visibleTextSample: string;
  links: PageLink[];
  images: PageImage[];
  jsonLd: SchemaBlock[];
  openGraph: Record<string, string>;
  hreflang: { lang: string; href: string }[];
  jsAppHeuristic: boolean;
  fetchedAt: string;
}

export interface RobotsInfo {
  present: boolean;
  allowsHomepage: boolean;
  allowsLlms: boolean;   // explicit GPTBot / OAI-SearchBot / PerplexityBot allow
  sitemaps: string[];
  raw: string | null;
}

export interface SitemapInfo {
  present: boolean;
  parses: boolean;
  urlCount: number;
  hasLastmod: boolean;
  urls: string[];
}

export interface SiteFacts {
  rootDomain: string;
  homepage: PageFacts | null;
  https: boolean;
  hsts: boolean;
  robots: RobotsInfo;
  sitemap: SitemapInfo;
  llmsTxtPresent: boolean;
}

export interface CrawlResult {
  site: SiteFacts;
  pages: PageFacts[];
  skipped: { url: string; reason: string }[];
  startedAt: string;
  finishedAt: string;
}
