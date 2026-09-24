import { getSession } from "@/server/auth/session";
import { assertOrgAccess } from "@/server/auth/service";
import { apiError, apiOk } from "@/server/api/respond";

export async function GET() {
  try {
    const s = await getSession();
    if (!s) throw Object.assign(new Error("UNAUTHENTICATED"), { status: 401 });
    await assertOrgAccess(s.userId, s.orgId);
    return apiOk({ mock: true, items: [], note: "Audience placeholder contract." });
  } catch (e) {
    return apiError(e);
  }
}
