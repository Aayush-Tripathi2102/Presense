export interface IntegrationDefinition {
  slug: string; name: string; provider: string; description: string;
}

/** Integration layer catalogue — services request these via IntegrationService, never OAuth directly. */
export const INTEGRATION_CATALOGUE: IntegrationDefinition[] = [
  { slug: "google-search-console", name: "Google Search Console", provider: "Google", description: "Search performance and indexing data." },
  { slug: "google-analytics", name: "Google Analytics", provider: "Google", description: "Website traffic and behavior." },
  { slug: "google-ads", name: "Google Ads", provider: "Google", description: "Ad accounts and campaigns." },
  { slug: "google-business-profile", name: "Google Business Profile", provider: "Google", description: "Local listings and maps presence." },
  { slug: "meta-ads", name: "Meta Ads", provider: "Meta", description: "Facebook/Instagram advertising." },
  { slug: "instagram", name: "Instagram", provider: "Meta", description: "Publishing and insights." },
  { slug: "facebook", name: "Facebook", provider: "Meta", description: "Pages and publishing." },
  { slug: "linkedin-ads", name: "LinkedIn Ads", provider: "LinkedIn", description: "B2B ad accounts." },
  { slug: "linkedin-pages", name: "LinkedIn Pages", provider: "LinkedIn", description: "Organic company pages." },
  { slug: "youtube", name: "YouTube", provider: "YouTube", description: "Channels, uploads and analytics." },
  { slug: "x", name: "X", provider: "X", description: "Publishing and listening." },
];

export const IntegrationService = {
  /** Stub: services call this instead of implementing OAuth themselves. */
  async connect(workspaceId: string, integrationSlug: string) {
    return { workspaceId, integrationSlug, status: "pending_oauth" as const };
  },
};
