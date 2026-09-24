import { destroySession, getSession } from "@/server/auth/session";
import { store } from "@/server/db/store";
import { apiError, apiOk } from "@/server/api/respond";

export async function GET() {
  try {
    const s = await getSession();
    if (!s) return apiOk({ user: null });
    const user = await store.find("users", (u) => u.id === s.userId);
    const org = await store.find("organizations", (o) => o.id === s.orgId);
    if (!user) return apiOk({ user: null });
    return apiOk({ user: { id: user.id, email: user.email, name: user.name }, org });
  } catch (e) {
    return apiError(e);
  }
}

export async function DELETE() {
  await destroySession();
  return apiOk({ ok: true });
}
