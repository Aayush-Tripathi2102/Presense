import { getSession } from "@/server/auth/session";
import { store } from "@/server/db/store";
import { apiError, apiOk } from "@/server/api/respond";

export async function GET() {
  try {
    const s = await getSession();
    if (!s) throw Object.assign(new Error("UNAUTHENTICATED"), { status: 401 });
    const memberships = await store.list("organization_members", (m) => m.userId === s.userId);
    const orgs = await store.list("organizations", (o) => memberships.some((m: any) => m.organizationId === o.id));
    return apiOk({ organizations: orgs });
  } catch (e) {
    return apiError(e);
  }
}
