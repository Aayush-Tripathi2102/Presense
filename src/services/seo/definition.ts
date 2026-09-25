import type { MarketingServiceDefinition } from "../registry/types";

/**
 * SEO module definition — owned by the SEO service, not the core platform.
 * Status `beta`: the deterministic audit engine is live; AI interpretation,
 * competitor intelligence, and execution layers remain on the roadmap.
 */
export const SEO_DEFINITION: MarketingServiceDefinition = {
  id: "seo",
  slug: "seo",
  name: "SEO",
  description:
    "Evidence-first organic search audits: bounded crawl, deterministic rules, and versioned business context.",
  category: "search",
  icon: "search",
  status: "beta",
  enabled: true,
  features: { enabled: true, onboarding: true, production: false },
  highlights: [
    "Bounded politeness-first website crawl",
    "Deterministic rule engine with stored evidence",
    "UNKNOWN as a first-class result — no invented facts",
    "Versioned business profile and claim ledger (foundation)",
    "Agent pipeline ready for AI interpretation layer",
  ],
  onboarding: {
    // Free-tier intake per crawler vault Phase 2: bounded crawl starts
    // while the user answers; zero external permissions required.
    fields: [
      { id: "website", type: "url", label: "Website URL", required: true, placeholder: "https://example.com" },
      { id: "businessName", type: "text", label: "Business name", required: true },
      { id: "country", type: "select", label: "Country / region", required: true, options: [
        { value: "IN", label: "India" }, { value: "US", label: "United States" },
        { value: "GB", label: "United Kingdom" }, { value: "AE", label: "UAE" },
        { value: "SG", label: "Singapore" }, { value: "OTHER", label: "Other" },
      ]},
      { id: "offering", type: "text", label: "Principal offering", required: true, placeholder: "e.g. B2B brand strategy retainers" },
      { id: "language", type: "select", label: "Preferred language", options: [
        { value: "en", label: "English" }, { value: "hi", label: "Hindi" }, { value: "OTHER", label: "Other" },
      ]},
      { id: "outcome", type: "select", label: "Expected outcome", required: true, options: [
        { value: "enquiries", label: "Qualified enquiries" }, { value: "bookings", label: "Booked appointments" },
        { value: "purchases", label: "Purchases" }, { value: "trials", label: "Trials" },
      ]},
    ],
  },
};

/** Future agent swarm (gameplan §6 / spec §27). Deterministic stages run now; LLM stages attach later. */
export const SEO_AGENT_PLAN = [
  "crawler",
  "technical",
  "content",
  "keyword",
  "competitor",
] as const;
