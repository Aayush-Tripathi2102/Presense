import type { MarketingServiceDefinition } from "./types";
import { SEO_DEFINITION } from "../seo/definition";

function def(d: MarketingServiceDefinition): MarketingServiceDefinition { return d; }
const off = { enabled: true, onboarding: false, production: false };

export const SERVICE_CATALOGUE: MarketingServiceDefinition[] = [
  SEO_DEFINITION,
  def({ id: "local-seo", slug: "local-seo", name: "Local SEO", description: "Win local search, maps and nearby customers.", category: "search", icon: "map-pin", status: "coming_soon", enabled: true, features: off, highlights: ["Business profile sync", "Local rank tracking", "Citation management", "Review requests"], onboarding: { fields: [
    { id: "businessName", type: "text", label: "Business name", required: true },
    { id: "location", type: "text", label: "Business location", required: true },
    { id: "gbp", type: "integration", label: "Google Business Profile", integration: "google-business-profile" },
  ]}}),
  def({ id: "content-seo", slug: "content-seo", name: "Content SEO", description: "Plan and optimize content that ranks.", category: "search", icon: "file-text", status: "coming_soon", enabled: true, features: off, highlights: ["Content briefs", "Topic clusters", "Internal linking", "Content scoring"], onboarding: { fields: [
    { id: "website", type: "url", label: "Website URL", required: true },
    { id: "topics", type: "textarea", label: "Priority topics" },
  ]}}),
  def({ id: "google-ads", slug: "google-ads", name: "Google Ads", description: "Manage and optimize Google advertising campaigns.", category: "advertising", icon: "target", status: "coming_soon", enabled: true, features: off, highlights: ["Campaign management", "Keyword planning", "Budget guardrails", "Performance optimization"], onboarding: { fields: [
    { id: "account", type: "integration", label: "Google Ads account", integration: "google-ads" },
    { id: "budget", type: "number", label: "Monthly budget (USD)", required: true },
    { id: "objective", type: "select", label: "Campaign objective", options: [{value:"leads",label:"Leads"},{value:"sales",label:"Sales"},{value:"traffic",label:"Traffic"}] },
    { id: "landingPage", type: "url", label: "Landing page" },
  ]}}),
  def({ id: "meta-ads", slug: "meta-ads", name: "Meta Ads", description: "Run Facebook and Instagram ad campaigns from one place.", category: "advertising", icon: "megaphone", status: "coming_soon", enabled: true, features: off, highlights: ["Campaign builder", "Audience targeting", "Creative testing", "ROAS reporting"], onboarding: { fields: [
    { id: "account", type: "integration", label: "Meta ad account", integration: "meta-ads" },
    { id: "budget", type: "number", label: "Monthly budget (USD)" },
    { id: "objective", type: "select", label: "Objective", options: [{value:"leads",label:"Leads"},{value:"sales",label:"Sales"},{value:"awareness",label:"Awareness"}] },
  ]}}),
  def({ id: "linkedin-ads", slug: "linkedin-ads", name: "LinkedIn Ads", description: "B2B advertising for pipeline and hiring.", category: "advertising", icon: "briefcase", status: "coming_soon", enabled: true, features: off, highlights: ["Lead-gen campaigns", "Account targeting", "Budget controls"], onboarding: { fields: [
    { id: "account", type: "integration", label: "LinkedIn Ads account", integration: "linkedin-ads" },
    { id: "budget", type: "number", label: "Monthly budget (USD)" },
  ]}}),
  def({ id: "instagram", slug: "instagram", name: "Instagram Marketing", description: "Plan, publish and measure Instagram content.", category: "social", icon: "instagram", status: "coming_soon", enabled: true, features: off, highlights: ["Content calendar", "Publishing", "Hashtag research", "Engagement analytics"], onboarding: { fields: [
    { id: "account", type: "integration", label: "Instagram account", integration: "instagram" },
    { id: "goals", type: "multiselect", label: "Content goals", options: [{value:"growth",label:"Growth"},{value:"engagement",label:"Engagement"},{value:"sales",label:"Sales"}] },
    { id: "voice", type: "text", label: "Brand voice" },
  ]}}),
  def({ id: "facebook", slug: "facebook", name: "Facebook Marketing", description: "Grow and engage your Facebook audience.", category: "social", icon: "facebook", status: "coming_soon", enabled: true, features: off, highlights: ["Page publishing", "Audience insights", "Community management"], onboarding: { fields: [
    { id: "account", type: "integration", label: "Facebook page", integration: "facebook" },
  ]}}),
  def({ id: "x-marketing", slug: "x-marketing", name: "X Marketing", description: "Publish and monitor presence on X.", category: "social", icon: "at-sign", status: "coming_soon", enabled: true, features: off, highlights: ["Scheduling", "Listening", "Engagement tracking"], onboarding: { fields: [
    { id: "account", type: "integration", label: "X account", integration: "x" },
  ]}}),
  def({ id: "linkedin", slug: "linkedin", name: "LinkedIn Marketing", description: "Organic LinkedIn presence for founders and brands.", category: "social", icon: "linkedin", status: "coming_soon", enabled: true, features: off, highlights: ["Page analytics", "Post scheduling", "Employee advocacy"], onboarding: { fields: [
    { id: "account", type: "integration", label: "LinkedIn page", integration: "linkedin-pages" },
  ]}}),
  def({ id: "youtube", slug: "youtube", name: "YouTube Marketing", description: "Grow your channel with publishing and analytics.", category: "video", icon: "youtube", status: "coming_soon", enabled: true, features: off, highlights: ["Channel analytics", "Publishing calendar", "SEO for video", "Shorts planning"], onboarding: { fields: [
    { id: "channel", type: "integration", label: "YouTube channel", integration: "youtube" },
    { id: "cadence", type: "select", label: "Publishing frequency", options: [{value:"weekly",label:"Weekly"},{value:"biweekly",label:"Bi-weekly"},{value:"monthly",label:"Monthly"}] },
    { id: "goals", type: "textarea", label: "Video goals" },
  ]}}),
  def({ id: "email-marketing", slug: "email-marketing", name: "Email Marketing", description: "Campaigns, automations and newsletters.", category: "crm", icon: "mail", status: "coming_soon", enabled: true, features: off, highlights: ["Campaign builder", "Automations", "Segmentation", "Deliverability"], onboarding: { fields: [
    { id: "provider", type: "select", label: "Provider", options: [{value:"ses",label:"Amazon SES"},{value:"sendgrid",label:"SendGrid"}] },
    { id: "listSize", type: "number", label: "List size" },
  ]}}),
  def({ id: "whatsapp-marketing", slug: "whatsapp-marketing", name: "WhatsApp Marketing", description: "Broadcasts and automations on WhatsApp.", category: "crm", icon: "message-circle", status: "coming_soon", enabled: true, features: off, highlights: ["Broadcasts", "Templates", "Automations", "Opt-in management"], onboarding: { fields: [
    { id: "number", type: "text", label: "Business number" },
  ]}}),
  def({ id: "content-marketing", slug: "content-marketing", name: "AI Content Marketing", description: "Generate on-brand blogs, pages and social copy.", category: "content", icon: "sparkles", status: "coming_soon", enabled: true, features: off, highlights: ["AI drafts", "Brand voice", "SEO briefs", "Multi-channel repurposing"], onboarding: { fields: [
    { id: "voice", type: "textarea", label: "Brand voice" },
    { id: "topics", type: "textarea", label: "Priority topics" },
  ]}}),
  def({ id: "marketplace", slug: "marketplace", name: "Marketplace Marketing", description: "Manage listings across Amazon, Flipkart and Etsy.", category: "commerce", icon: "shopping-bag", status: "coming_soon", enabled: true, features: off, highlights: ["Listing optimization", "Keyword tracking", "Review monitoring"], onboarding: { fields: [
    { id: "marketplaces", type: "multiselect", label: "Marketplaces", options: [{value:"amazon",label:"Amazon"},{value:"flipkart",label:"Flipkart"},{value:"etsy",label:"Etsy"}] },
  ]}}),
  def({ id: "google-shopping", slug: "google-shopping", name: "Google Shopping", description: "Product feeds and Shopping campaign optimization.", category: "advertising", icon: "shopping-cart", status: "coming_soon", enabled: true, features: off, highlights: ["Feed management", "Price benchmarking", "Campaign structure"], onboarding: { fields: [
    { id: "feed", type: "url", label: "Product feed URL" },
  ]}}),
  def({ id: "reputation", slug: "reputation", name: "Reputation Management", description: "Monitor reviews and protect brand trust.", category: "reputation", icon: "star", status: "coming_soon", enabled: true, features: off, highlights: ["Review inbox", "Sentiment tracking", "Response templates"], onboarding: { fields: [
    { id: "locations", type: "textarea", label: "Business locations" },
  ]}}),
  def({ id: "influencer-marketing", slug: "influencer-marketing", name: "Influencer Marketing", description: "Discover creators and run sponsored campaigns.", category: "growth", icon: "users", status: "coming_soon", enabled: true, features: off, highlights: ["Creator discovery", "Outreach CRM", "Campaign tracking"], onboarding: { fields: [
    { id: "niche", type: "text", label: "Niche" },
    { id: "budget", type: "number", label: "Monthly budget (USD)" },
  ]}}),
  def({ id: "affiliate-marketing", slug: "affiliate-marketing", name: "Affiliate Marketing", description: "Launch and manage affiliate programs.", category: "growth", icon: "link", status: "coming_soon", enabled: true, features: off, highlights: ["Program setup", "Partner portal", "Payouts"], onboarding: { fields: [
    { id: "commission", type: "number", label: "Default commission %" },
  ]}}),
  def({ id: "cro", slug: "cro", name: "Conversion Optimization", description: "A/B testing and landing page optimization.", category: "growth", icon: "trending-up", status: "coming_soon", enabled: true, features: off, highlights: ["A/B testing", "Heatmaps", "Funnel analysis"], onboarding: { fields: [
    { id: "website", type: "url", label: "Website URL", required: true },
  ]}}),
  def({ id: "analytics", slug: "analytics", name: "Marketing Analytics", description: "Attribution, dashboards and reporting.", category: "analytics", icon: "bar-chart", status: "coming_soon", enabled: true, features: off, highlights: ["Cross-channel dashboards", "Attribution", "Scheduled reports"], onboarding: { fields: [
    { id: "timezone", type: "text", label: "Reporting timezone" },
  ]}}),
];
