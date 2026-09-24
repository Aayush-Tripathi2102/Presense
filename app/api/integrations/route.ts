import { getSession } from "@/server/auth/session";
import { assertOrgAccess } from "@/server/auth/service";
import { store } from "@/server/db/store";
import { INTEGRATION_CATALOG } from "@/server/integrations/providers";
import { apiError, apiOk } from "@/server/api/respond";

// GET /api/integrations — catalog + per-org status (all not_connected in Phase 1).
export async function GET() {
  try {
    const s = await getSession();
    if (!s) throw Object.assign(new Error("UNAUTHENTICATED"), { status: 401 });
    await assertOrgAccess(s.userId, s.orgId);
    const saved = await store.list("integrations", (r) => r.organizationId === s.orgId);
    const byKey = new Map(saved.map((r: any) => [r.provider, r]));
    const data = INTEGRATION_CATALOG.map((p) => ({
      key: p.key, label: p.label, category: p.category,
      status: (byKey.get(p.key)?.status as string) ?? (p.comingSoon ? "coming_soon" : "not_connected"),
      comingSoon: p.comingSoon ?? false,
      mock: true
    }));
    return apiOk({ integrations: data });
  } catch (e) {
    return apiError(e);
  }
}
