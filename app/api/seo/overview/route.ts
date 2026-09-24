import { getSession } from "@/server/auth/session";
import { assertOrgAccess } from "@/server/auth/service";
import { apiError, apiOk } from "@/server/api/respond";
import { seoService } from "@/server/seo/service";

// GET /api/seo/overview — placeholder contract.
export async function GET() {
  try {
    const s = await getSession();
    if (!s) throw Object.assign(new Error("UNAUTHENTICATED"), { status: 401 });
    await assertOrgAccess(s.userId, s.orgId);
    return apiOk({
      mock: true,
      overview: { healthScore: null, issues: [], rankings: [], visibility: null },
      note: "SEO module placeholder — connect crawler + rank tracker for real data."
    });
  } catch (e) {
    return apiError(e);
  }
}
