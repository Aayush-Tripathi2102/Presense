import { getSession } from "@/server/auth/session";
import { assertOrgAccess } from "@/server/auth/service";
import { apiError, apiOk } from "@/server/api/respond";

const stub = (ns: string) => async () => {
  try {
    const s = await getSession();
    if (!s) throw Object.assign(new Error("UNAUTHENTICATED"), { status: 401 });
    await assertOrgAccess(s.userId, s.orgId);
    return apiOk({ mock: true, items: [], namespace: ns, note: `${ns} placeholder contract.` });
  } catch (e) {
    return apiError(e);
  }
};

export const GET = stub("brand/audience/products");
