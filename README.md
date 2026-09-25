# Taro — Modular Digital Marketing Platform

## Architecture (AWS-style)

- `src/core/` — platform: auth, permissions, audit, feature flags
- `src/services/registry/` — `types.ts`, `catalogue.ts`, `index.ts` (ServiceRegistry = source of truth)
- `src/services/<slug>/` — per-service module (definition, onboarding, routes, integrations)
- `src/integrations/` — provider catalogue + `IntegrationService.connect()`
- `src/app/api/` — `/auth`, `/organizations`, `/workspaces`, `/services`, `/service-configs`, `/integrations`, `/notifications`
- UI: `ServicePage` shell + `ComingSoonService` + `DynamicForm` + command palette

## Adding a new service

1. Create `src/services/new-service/definition.ts`
2. Add entry to `SERVICE_CATALOGUE` in `src/services/registry/catalogue.ts`
3. (Optional, when it goes live) register its workspace UI in `src/services/ui-registry.ts`
4. Done — catalogue, sidebar, search, `/dashboard/services/new-service` appear automatically. No changes to auth/dashboard/forms/DB core.

## SEO — first live service (`beta`)

Built from the Presense crawler vault + Agentic SEO/AEO/GEO gameplan. Golden rule: **crawler facts → rules → context → AI (later) → actions (later)**.

- `src/services/seo/crawler/` — SSRF-safe bounded crawl (robots, sitemap, same-origin, budgets), cheerio extraction. Every finding stores evidence.
- `src/services/seo/rules/registry.ts` — 30 deterministic rules (crawlability, indexability, sitemap, on-page, links, schema, media, technical, performance) + `UNKNOWN` for GSC/field-data/AI-visibility gaps. Severity follows the source checklist impact (8–10 critical … 1 low).
- `src/services/seo/agents.ts` — orchestrator + crawler/technical/content agents live; keyword `needs_data` (GSC), competitor `planned`.
- `src/services/seo/scoring.ts` — documented triage heuristic (formula shown in UI), not a ranking prediction.
- APIs under `/api/services/seo/`: `sites`, `audits`, `audits/[id]`, `profile` (versioned business profile).
- UI: Overview / Audits & Issues (evidence expandable) / Business Profile / Roadmap (honest planned panels).

Local fixture test: `TARO_CRAWLER_ALLOW_PRIVATE=1` allows auditing a localhost fixture (never in production).

## Run

```bash
npm install
npm run db:push
npm run dev
```

Seed of services/integrations runs automatically on first auth/services API call.
