# Velora — Growth Operating System (Phase 1 skeleton)

Production-ready SaaS skeleton for end-to-end marketing automation: one **Business Growth Profile**
powers SEO, AI-search/GEO, content, social, paid, reputation and analytics.

> Phase 1 rule: **no fake integrations.** Every unconnected source shows
> `not_connected` / `coming_soon` and mock outputs are labeled `MOCK`.

## Quickstart (clean install, no external DB)

```bash
npm install
cp .env.example .env
npm run dev   # http://localhost:3000
```

Flow: `/signup` → `/onboarding` (12 resumable steps) → `/dashboard`.

Runtime persistence is a JSON store in `.data/db.json` so the app boots with
zero config. The canonical schema is Drizzle + PostgreSQL:

- `server/db/schema.ts` — all tables (users, orgs, members, websites, brands,
  products, audiences, goals, competitors, keywords, audits, content, social,
  integrations, analytics, backlinks, reviews, automations, reports, jobs, onboarding…)
- `drizzle/0001_init.sql` — baseline migration for Postgres deploys
- Set `DATABASE_URL` in prod; swap `server/db/store.ts` for Drizzle without
  changing callers (same record shapes).

## Architecture

| Concern | Location | Notes |
|---|---|---|
| Auth/sessions | `server/auth/*` | scrypt passwords, `jose` JWT httpOnly cookie, org isolation |
| API | `app/api/*` | Zod validation, `{ ok, data }` envelope, server-side auth |
| AI | `server/ai/provider.ts` | `AIProvider` interface, mock adapter only |
| Jobs | `server/jobs/queue.ts` | enqueue/process/list, swap for BullMQ later |
| Integrations | `server/integrations/providers.ts` | `connect/callback/refresh/disconnect/getStatus/sync` |
| SEO/crawl | `server/seo/service.ts` | placeholder analyzer, mock-labeled |
| Observability | `server/observability/log.ts` | structured logs, Sentry/OTel hook point |
| Onboarding | `features/onboarding/*` | 12 steps, save-after-every-step, back/skip/resume |
| UI kit | `components/ui.tsx` | MetricCard, IntegrationCard, EmptyState, AIInsight… |

## What's next (Phase 2, no restructuring)

Implement providers one by one behind existing interfaces: real crawler,
rank tracker, OAuth flows (tokens server-side only), AI adapters, workers,
analytics sync. Frontend contracts already exist.
