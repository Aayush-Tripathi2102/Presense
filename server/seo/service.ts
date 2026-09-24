// SEO crawler abstraction. Phase 1 returns deterministic mock analysis
// labeled as mock; real crawler (pages, headings, schema, CWV, etc.) plugs in later.

export interface WebsiteAnalysisRequest { url: string; organizationId: string; }

export interface WebsiteAnalysis {
  mock: true;
  url: string;
  pagesFound: number;
  titles: { url: string; title: string }[];
  meta: { hasSitemap: boolean; hasRobots: boolean; canonicals: number };
  headings: { h1: number; h2: number; h3: number };
  issues: { severity: "high" | "medium" | "low"; title: string; detail: string }[];
  speed: { performance: number; lcp: string; cls: string };
  note: string;
}

export const seoService = {
  async analyzeWebsite(req: WebsiteAnalysisRequest): Promise<WebsiteAnalysis> {
    const u = new URL(req.url.startsWith("http") ? req.url : `https://${req.url}`);
    return {
      mock: true,
      url: u.toString(),
      pagesFound: 0,
      titles: [],
      meta: { hasSitemap: false, hasRobots: false, canonicals: 0 },
      headings: { h1: 0, h2: 0, h3: 0 },
      issues: [
        { severity: "medium", title: "Real crawl not connected", detail: "Connect the crawler worker to detect titles, metas, headings, schema, sitemap, robots, canonicals, redirects, broken links, thin content, and Core Web Vitals." }
      ],
      speed: { performance: 0, lcp: "—", cls: "—" },
      note: "MOCK ANALYSIS — placeholder. No real HTTP crawl was performed."
    };
  },
  async keywordResearch(_seeds: string[]) {
    return { mock: true, clusters: [], note: "Keyword research placeholder — connect provider." };
  },
  async competitorAnalysis(_domains: string[]) {
    return { mock: true, gaps: [], note: "Competitor analysis placeholder." };
  },
  async aiVisibilityAnalysis(_domain: string) {
    return { mock: true, score: null, note: "AI-search visibility placeholder." };
  }
};

export const brandVoiceService = {
  async analyze(_samples: string[]) {
    return { mock: true, voice: {}, note: "Brand voice analysis placeholder — upload samples to enable." };
  }
};

export const growthPlanService = {
  async generate(profile: unknown) {
    const p = profile as Record<string, any>;
    const business = (p.business as any)?.businessName ?? "your business";
    return {
      mock: true,
      summary: `Mock 90-day growth plan for ${business}. Connect AI provider for a real plan.`,
      pillars: ["SEO foundations", "Content engine", "Social distribution", "Conversion & reputation"],
      actions: [
        "Connect Search Console + Analytics to establish baselines",
        "Run a real technical audit once the crawler is connected",
        "Publish 8–12mm problem-led articles from the content calendar",
        "Repurpose each article into LinkedIn + short-form video"
      ]
    };
  }
};
