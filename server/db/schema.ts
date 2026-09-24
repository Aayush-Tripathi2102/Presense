// Velora canonical data model — Drizzle ORM (PostgreSQL).
// Phase 1 ships this schema + SQL migration. Runtime uses a zero-config
// JSON store (server/db/store.ts) when DATABASE_URL is absent so the app
// runs from a clean install. Prod deploys Postgres with this exact schema.

import {
  boolean, integer, jsonb, pgTable, text, timestamp, uuid
} from "drizzle-orm/pg-core";

const base = {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
};

export const users = pgTable("users", {
  ...base,
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name")
});

export const organizations = pgTable("organizations", {
  ...base,
  name: text("name").notNull(),
  slug: text("slug").notNull().unique()
});

export const organizationMembers = pgTable("organization_members", {
  ...base,
  organizationId: uuid("organization_id").notNull(),
  userId: uuid("user_id").notNull(),
  role: text("role").notNull().default("owner")
});

export const workspaces = pgTable("workspaces", {
  ...base,
  organizationId: uuid("organization_id").notNull(),
  name: text("name").notNull().default("Default")
});

export const websites = pgTable("websites", {
  ...base,
  organizationId: uuid("organization_id").notNull(),
  url: text("url").notNull(),
  cms: text("cms"),
  websiteType: text("website_type"),
  primaryDomain: text("primary_domain"),
  targetCountries: jsonb("target_countries").$type<string[]>().default([]),
  languages: jsonb("languages").$type<string[]>().default([]),
  analysis: jsonb("analysis").$type<Record<string, unknown>>()
});

export const brands = pgTable("brands", {
  ...base,
  organizationId: uuid("organization_id").notNull(),
  websiteId: uuid("website_id"),
  data: jsonb("data").$type<Record<string, unknown>>().notNull().default({})
});

export const products = pgTable("products", {
  ...base,
  organizationId: uuid("organization_id").notNull(),
  data: jsonb("data").$type<Record<string, unknown>>().notNull().default({})
});

export const audiences = pgTable("audiences", {
  ...base,
  organizationId: uuid("organization_id").notNull(),
  data: jsonb("data").$type<Record<string, unknown>>().notNull().default({})
});

export const audienceSegments = pgTable("audience_segments", {
  ...base,
  organizationId: uuid("organization_id").notNull(),
  audienceId: uuid("audience_id"),
  data: jsonb("data").$type<Record<string, unknown>>().notNull().default({})
});

export const goals = pgTable("goals", {
  ...base,
  organizationId: uuid("organization_id").notNull(),
  data: jsonb("data").$type<Record<string, unknown>>().notNull().default({})
});

export const competitors = pgTable("competitors", {
  ...base,
  organizationId: uuid("organization_id").notNull(),
  domain: text("domain").notNull(),
  kind: text("kind").notNull().default("business"),
  data: jsonb("data").$type<Record<string, unknown>>().default({})
});

export const keywords = pgTable("keywords", {
  ...base,
  organizationId: uuid("organization_id").notNull(),
  keyword: text("keyword").notNull(),
  clusterId: uuid("cluster_id"),
  intent: text("intent"),
  data: jsonb("data").$type<Record<string, unknown>>().default({})
});

export const keywordClusters = pgTable("keyword_clusters", {
  ...base,
  organizationId: uuid("organization_id").notNull(),
  name: text("name").notNull(),
  data: jsonb("data").$type<Record<string, unknown>>().default({})
});

export const seoAudits = pgTable("seo_audits", {
  ...base,
  organizationId: uuid("organization_id").notNull(),
  websiteId: uuid("website_id"),
  status: text("status").notNull().default("pending"),
  summary: jsonb("summary").$type<Record<string, unknown>>(),
  isMock: boolean("is_mock").notNull().default(true)
});

export const seoIssues = pgTable("seo_issues", {
  ...base,
  organizationId: uuid("organization_id").notNull(),
  auditId: uuid("audit_id"),
  severity: text("severity").notNull().default("info"),
  title: text("title").notNull(),
  data: jsonb("data").$type<Record<string, unknown>>().default({})
});

export const contentCampaigns = pgTable("content_campaigns", {
  ...base,
  organizationId: uuid("organization_id").notNull(),
  name: text("name").notNull(),
  data: jsonb("data").$type<Record<string, unknown>>().default({})
});

export const contentItems = pgTable("content_items", {
  ...base,
  organizationId: uuid("organization_id").notNull(),
  websiteId: uuid("website_id"),
  campaignId: uuid("campaign_id"),
  channel: text("channel"),
  status: text("status").notNull().default("idea"),
  approvalState: text("approval_state").notNull().default("none"),
  publicationState: text("publication_state").notNull().default("unpublished"),
  data: jsonb("data").$type<Record<string, unknown>>().default({})
});

export const socialAccounts = pgTable("social_accounts", {
  ...base,
  organizationId: uuid("organization_id").notNull(),
  provider: text("provider").notNull(),
  status: text("status").notNull().default("not_connected"),
  handle: text("handle"),
  data: jsonb("data").$type<Record<string, unknown>>().default({})
});

export const socialPosts = pgTable("social_posts", {
  ...base,
  organizationId: uuid("organization_id").notNull(),
  provider: text("provider"),
  status: text("status").notNull().default("draft"),
  data: jsonb("data").$type<Record<string, unknown>>().default({})
});

export const socialMetrics = pgTable("social_metrics", {
  ...base,
  organizationId: uuid("organization_id").notNull(),
  provider: text("provider").notNull(),
  data: jsonb("data").$type<Record<string, unknown>>().default({})
});

export const integrations = pgTable("integrations", {
  ...base,
  organizationId: uuid("organization_id").notNull(),
  provider: text("provider").notNull(),
  status: text("status").notNull().default("not_connected"),
  // Never store raw tokens in plaintext in prod — encrypted vault column.
  credentialsRef: text("credentials_ref"),
  data: jsonb("data").$type<Record<string, unknown>>().default({})
});

export const analyticsSources = pgTable("analytics_sources", {
  ...base,
  organizationId: uuid("organization_id").notNull(),
  provider: text("provider").notNull(),
  status: text("status").notNull().default("not_connected"),
  data: jsonb("data").$type<Record<string, unknown>>().default({})
});

export const analyticsSnapshots = pgTable("analytics_snapshots", {
  ...base,
  organizationId: uuid("organization_id").notNull(),
  source: text("source").notNull(),
  data: jsonb("data").$type<Record<string, unknown>>().default({}),
  isMock: boolean("is_mock").notNull().default(true)
});

export const backlinks = pgTable("backlinks", {
  ...base,
  organizationId: uuid("organization_id").notNull(),
  domain: text("domain").notNull(),
  data: jsonb("data").$type<Record<string, unknown>>().default({})
});

export const reviews = pgTable("reviews", {
  ...base,
  organizationId: uuid("organization_id").notNull(),
  source: text("source").notNull(),
  data: jsonb("data").$type<Record<string, unknown>>().default({})
});

export const automations = pgTable("automations", {
  ...base,
  organizationId: uuid("organization_id").notNull(),
  name: text("name").notNull(),
  enabled: boolean("enabled").notNull().default(false),
  data: jsonb("data").$type<Record<string, unknown>>().default({})
});

export const automationRuns = pgTable("automation_runs", {
  ...base,
  organizationId: uuid("organization_id").notNull(),
  automationId: uuid("automation_id"),
  status: text("status").notNull().default("queued"),
  data: jsonb("data").$type<Record<string, unknown>>().default({})
});

export const reports = pgTable("reports", {
  ...base,
  organizationId: uuid("organization_id").notNull(),
  name: text("name").notNull(),
  data: jsonb("data").$type<Record<string, unknown>>().default({})
});

export const jobs = pgTable("jobs", {
  ...base,
  organizationId: uuid("organization_id"),
  type: text("type").notNull(),
  status: text("status").notNull().default("queued"),
  progress: integer("progress").notNull().default(0),
  retryCount: integer("retry_count").notNull().default(0),
  error: text("error"),
  payload: jsonb("payload").$type<Record<string, unknown>>().default({}),
  result: jsonb("result").$type<Record<string, unknown>>(),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at")
});

export const onboardingProgress = pgTable("onboarding_progress", {
  ...base,
  organizationId: uuid("organization_id").notNull(),
  currentStep: integer("current_step").notNull().default(1),
  completedSteps: jsonb("completed_steps").$type<number[]>().default([]),
  steps: jsonb("steps").$type<Record<string, unknown>>().default({})
});

export const auditLogs = pgTable("audit_logs", {
  ...base,
  organizationId: uuid("organization_id"),
  userId: uuid("user_id"),
  action: text("action").notNull(),
  data: jsonb("data").$type<Record<string, unknown>>().default({})
});
