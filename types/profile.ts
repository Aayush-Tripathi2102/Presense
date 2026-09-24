// Central TypeScript types for the Business Growth Profile.

export interface BusinessGrowthProfile {
  business?: Record<string, unknown>;
  goals?: Record<string, unknown>;
  products?: Record<string, unknown>[];
  audience?: Record<string, unknown>;
  brand?: Record<string, unknown>;
  website?: Record<string, unknown>;
  seo?: Record<string, unknown>;
  social?: Record<string, unknown>;
  content?: Record<string, unknown>;
  growth?: Record<string, unknown>;
  analytics?: Record<string, unknown>;
}

export const ONBOARDING_STEPS = [
  { n: 1, slug: "business", title: "Business" },
  { n: 2, slug: "goals", title: "Goals" },
  { n: 3, slug: "products", title: "Products" },
  { n: 4, slug: "audience", title: "Audience" },
  { n: 5, slug: "brand", title: "Brand" },
  { n: 6, slug: "website", title: "Website" },
  { n: 7, slug: "seo", title: "SEO" },
  { n: 8, slug: "social", title: "Social" },
  { n: 9, slug: "content", title: "Content" },
  { n: 10, slug: "growth", title: "Growth" },
  { n: 11, slug: "analytics", title: "Analytics" },
  { n: 12, slug: "launch", title: "Launch" }
] as const;

export type OnboardingSlug = (typeof ONBOARDING_STEPS)[number]["slug"];
