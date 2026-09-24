import { getSession } from "@/server/auth/session";
import { assertOrgAccess } from "@/server/auth/service";
import { store } from "@/server/db/store";
import { apiError, apiOk } from "@/server/api/respond";

// GET /api/profile — assembled Business Growth Profile from onboarding steps.
export async function GET() {
  try {
    const s = await getSession();
    if (!s) throw Object.assign(new Error("UNAUTHENTICATED"), { status: 401 });
    await assertOrgAccess(s.userId, s.orgId);
    const progress = await store.find("onboarding_progress", (r) => r.organizationId === s.orgId);
    const steps = (progress?.steps ?? {}) as Record<string, unknown>;
    const SLUGS = ["business","goals","products","audience","brand","website","seo","social","content","growth","analytics","launch"];
    const profile: Record<string, unknown> = {};
    SLUGS.forEach((slug, i) => { profile[slug] = steps[String(i + 1)] ?? null; });
    return apiOk({ profile, currentStep: progress?.currentStep ?? 1, completedSteps: progress?.completedSteps ?? [] });
  } catch (e) {
    return apiError(e);
  }
}
