// Integration framework: every OAuth/API integration implements this.
// Phase 1 ships placeholder providers — status stays "not_connected" and
// no fake OAuth is performed.

export type IntegrationStatus = "not_connected" | "connecting" | "connected" | "error" | "coming_soon";

export interface IntegrationProvider {
  key: string;
  label: string;
  category: "social" | "analytics" | "ads" | "reputation" | "other";
  status: IntegrationStatus;
  comingSoon?: boolean;
  connect(): Promise<{ url: string }>; // returns real OAuth URL when implemented
  callback(code: string, state: string): Promise<void>;
  refresh(): Promise<void>;
  disconnect(): Promise<void>;
  getStatus(): Promise<IntegrationStatus>;
  sync(): Promise<{ mock: true; note: string }>;
}

class PlaceholderProvider implements IntegrationProvider {
  constructor(
    public key: string,
    public label: string,
    public category: IntegrationProvider["category"] = "other",
    public status: IntegrationStatus = "not_connected",
    public comingSoon = false
  ) {}
  async connect(): Promise<{ url: string }> {
    throw new Error(`${this.label} integration is not implemented yet (placeholder).`);
  }
  async callback(_code: string, _state: string): Promise<void> {
    throw new Error("Not implemented");
  }
  async refresh() {}
  async disconnect() {}
  async getStatus(): Promise<IntegrationStatus> {
    return this.comingSoon ? "coming_soon" : "not_connected";
  }
  async sync() {
    return { mock: true as const, note: `${this.label} sync is a placeholder.` };
  }
}

export const INTEGRATION_CATALOG: IntegrationProvider[] = [
  new PlaceholderProvider("instagram", "Instagram", "social"),
  new PlaceholderProvider("x", "X (Twitter)", "social"),
  new PlaceholderProvider("linkedin", "LinkedIn", "social"),
  new PlaceholderProvider("youtube", "YouTube", "social"),
  new PlaceholderProvider("tiktok", "TikTok", "social"),
  new PlaceholderProvider("facebook", "Facebook", "social"),
  new PlaceholderProvider("pinterest", "Pinterest", "social", "not_connected", true),
  new PlaceholderProvider("google_analytics", "Google Analytics", "analytics"),
  new PlaceholderProvider("google_search_console", "Google Search Console", "analytics"),
  new PlaceholderProvider("google_business_profile", "Google Business Profile", "reputation"),
  new PlaceholderProvider("google_ads", "Google Ads", "ads"),
  new PlaceholderProvider("bing_webmaster", "Bing Webmaster Tools", "analytics"),
  new PlaceholderProvider("meta_ads", "Meta Ads", "ads"),
  new PlaceholderProvider("linkedin_ads", "LinkedIn Ads", "ads", "not_connected", true),
  new PlaceholderProvider("tiktok_ads", "TikTok Ads", "ads", "not_connected", true),
  new PlaceholderProvider("trustpilot", "Trustpilot", "reputation", "not_connected", true),
  new PlaceholderProvider("g2", "G2", "reputation", "not_connected", true)
];
