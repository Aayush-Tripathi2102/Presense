"use client";

export interface StepField {
  key: string;
  label: string;
  type: "text" | "textarea" | "select" | "multitext" | "info";
  options?: string[];
  optional?: boolean;
  placeholder?: string;
  hint?: string;
}

export interface WizardStep {
  slug: string;
  title: string;
  subtitle: string;
  fields: StepField[];
  skippable: boolean;
}

export const BUSINESS_TYPES = ["SaaS","Ecommerce","Agency","Local business","Service business","Creator","Marketplace","Startup","Enterprise","Other"];
export const BUSINESS_MODELS = ["B2B","B2C","B2B2C","D2C","Marketplace","Subscription","Freemium","One-time purchase","Advertising","Lead generation","Other"];

export const WIZARD_STEPS: WizardStep[] = [
  {
    slug: "business", title: "Business", subtitle: "Tell us about the business once — every channel reuses this.",
    skippable: false,
    fields: [
      { key: "businessName", label: "Business name", type: "text", placeholder: "Acme Inc." },
      { key: "legalName", label: "Legal name", type: "text", optional: true },
      { key: "website", label: "Website", type: "text", placeholder: "https://example.com" },
      { key: "industry", label: "Industry", type: "text" },
      { key: "subIndustry", label: "Sub-industry", type: "text", optional: true },
      { key: "businessType", label: "Business type", type: "select", options: BUSINESS_TYPES },
      { key: "businessModel", label: "Business model", type: "select", options: BUSINESS_MODELS },
      { key: "companySize", label: "Company size", type: "select", options: ["1-10","11-50","51-200","201-1000","1000+"] },
      { key: "yearFounded", label: "Year founded", type: "text", optional: true },
      { key: "headquarters", label: "Headquarters", type: "text", optional: true },
      { key: "businessDescription", label: "Business description", type: "textarea" },
      { key: "oneLineDescription", label: "One-line description", type: "text", hint: "Reused by SEO titles, social bios and ad copy." }
    ]
  },
  {
    slug: "goals", title: "Goals", subtitle: "What does growth mean in numbers?",
    skippable: false,
    fields: [
      { key: "primaryGoal", label: "Primary goal", type: "select", options: ["increase organic traffic","generate leads","increase sales","increase revenue","increase brand awareness","increase social followers","increase engagement","increase app installs","increase demo bookings","improve local visibility","improve AI/search visibility","launch a product","enter a market"] },
      { key: "secondaryGoals", label: "Secondary goals (comma separated)", type: "text", optional: true },
      { key: "targetMetric", label: "Target metric", type: "text", placeholder: "e.g. qualified demos / mo" },
      { key: "targetValue", label: "Target value", type: "text", placeholder: "e.g. 200" },
      { key: "targetDate", label: "Target date", type: "text", placeholder: "YYYY-MM-DD", optional: true },
      { key: "monthlyBudget", label: "Monthly marketing budget", type: "text", optional: true },
      { key: "channelPriorities", label: "Channel priorities (e.g. SEO:high, Social:medium…)", type: "textarea", optional: true }
    ]
  },
  {
    slug: "products", title: "Products", subtitle: "Add one or many products / services.",
    skippable: true,
    fields: [
      { key: "productsJson", label: "Products (one per line: Name | URL | Price | Description)", type: "textarea", optional: true, hint: "Stored as structured product records for SEO, ads, email and landing pages." }
    ]
  },
  {
    slug: "audience", title: "Audience", subtitle: "Who are we growing for? Add segments as text for now.",
    skippable: true,
    fields: [
      { key: "segments", label: "Segments (one per line: Name | Job title | Pain point)", type: "textarea", optional: true },
      { key: "jobsToBeDone", label: "Jobs to be done", type: "textarea", optional: true },
      { key: "desiredOutcomes", label: "Desired outcomes", type: "textarea", optional: true },
      { key: "info", label: "AI discovery", type: "info", hint: "“Let AI discover my audience” runs after the website crawl (placeholder in Phase 1)." }
    ]
  },
  {
    slug: "brand", title: "Brand DNA", subtitle: "Voice + visuals reused by every generator.",
    skippable: true,
    fields: [
      { key: "voice", label: "Voice (e.g. professional, direct, friendly)", type: "text", optional: true },
      { key: "personality", label: "Personality traits (comma separated)", type: "text", optional: true },
      { key: "wordsToUse", label: "Words to use", type: "text", optional: true },
      { key: "wordsToAvoid", label: "Words to avoid", type: "text", optional: true },
      { key: "ctaStyle", label: "CTA style", type: "text", optional: true },
      { key: "emojiPreference", label: "Emoji preference", type: "select", options: ["never","rarely","sometimes","often"], optional: true }
    ]
  },
  {
    slug: "website", title: "Website", subtitle: "We run a placeholder analysis you can approve / edit.",
    skippable: false,
    fields: [
      { key: "url", label: "Website URL", type: "text", placeholder: "https://example.com" },
      { key: "cms", label: "CMS", type: "select", options: ["Unknown","WordPress","Webflow","Shopify","Next.js","Custom","Other"], optional: true },
      { key: "websiteType", label: "Website type", type: "select", options: ["Marketing site","Blog","Ecommerce","Marketplace","SaaS app","Other"], optional: true },
      { key: "targetCountries", label: "Target countries (comma separated)", type: "text", optional: true }
    ]
  },
  {
    slug: "seo", title: "SEO", subtitle: "Countries, seeds, competitors — research runs later.",
    skippable: true,
    fields: [
      { key: "primaryCountry", label: "Primary country", type: "text", optional: true },
      { key: "keywordSeeds", label: "Keyword seeds (comma separated)", type: "textarea", optional: true },
      { key: "targetTopics", label: "Target topics (comma separated)", type: "textarea", optional: true },
      { key: "competitors", label: "Competitors (one domain per line)", type: "textarea", optional: true },
      { key: "seoModel", label: "SEO model", type: "select", options: ["editorial","product-led","ecommerce","local","programmatic","SaaS","marketplace","other"], optional: true }
    ]
  },
  {
    slug: "social", title: "Social", subtitle: "Connect later — tell us the strategy now.",
    skippable: true,
    fields: [
      { key: "priorityNetworks", label: "Priority networks (comma separated)", type: "text", optional: true, placeholder: "LinkedIn, Instagram, YouTube" },
      { key: "pillars", label: "Content pillars", type: "textarea", optional: true },
      { key: "postingFrequency", label: "Posting frequency", type: "text", optional: true }
    ]
  },
  {
    slug: "content", title: "Content", subtitle: "Formats, pillars, approval + AI autonomy.",
    skippable: true,
    fields: [
      { key: "publishingFrequency", label: "Publishing frequency", type: "text", optional: true },
      { key: "formats", label: "Preferred formats (comma separated)", type: "text", optional: true },
      { key: "autonomyLevel", label: "AI autonomy", type: "select", options: ["Suggest only","Generate drafts","Generate + schedule","Generate + publish automatically"], optional: true }
    ]
  },
  {
    slug: "growth", title: "Growth", subtitle: "Paid, backlinks, reputation, influencers, PR (all optional).",
    skippable: true,
    fields: [
      { key: "paidBudget", label: "Paid monthly budget", type: "text", optional: true },
      { key: "targetCpa", label: "Target CPA", type: "text", optional: true },
      { key: "targetRoas", label: "Target ROAS", type: "text", optional: true },
      { key: "backlinkTargets", label: "Target publications / directories", type: "textarea", optional: true },
      { key: "reviewProfiles", label: "Review profiles (GBP, G2, Trustpilot…)", type: "textarea", optional: true }
    ]
  },
  {
    slug: "analytics", title: "Analytics", subtitle: "Connections happen via OAuth later — nothing is faked.",
    skippable: true,
    fields: [
      { key: "info", label: "Integrations", type: "info", hint: "GA4, Search Console, Ads, Meta, LinkedIn, YouTube cards live on the next screen and in Settings. All show Not connected until real OAuth succeeds." }
    ]
  },
  {
    slug: "launch", title: "Launch", subtitle: "Review your Growth Profile and finish.",
    skippable: false,
    fields: []
  }
];
