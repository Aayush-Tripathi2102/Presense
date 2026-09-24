import { getSession } from "@/server/auth/session";
import { assertOrgAccess } from "@/server/auth/service";
import { store } from "@/server/db/store";
import { apiError, apiOk } from "@/server/api/respond";

export async function GET() {
  try {
    const s = await getSession();
    if (!s) throw Object.assign(new Error("UNAUTHENTICATED"), { status: 401 });
    await assertOrgAccess(s.userId, s.orgId);
    const accounts = await store.list("social_accounts", (a) => a.organizationId === s.orgId);
    return apiOk({ mock: true, accounts, note: "Social module placeholder — no OAuth connected." });
  } catch (e) {
    return apiError(e);
  }
}
