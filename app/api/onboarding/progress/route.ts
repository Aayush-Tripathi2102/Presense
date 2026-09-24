import { NextRequest } from "next/server";
import { getSession } from "@/server/auth/session";
import { assertOrgAccess } from "@/server/auth/service";
import { store } from "@/server/db/store";
import { onboardingSaveSchema } from "@/lib/validations";
import { apiError, apiOk } from "@/server/api/respond";

async function progressFor(orgId: string) {
  let p = await store.find("onboarding_progress", (r) => r.organizationId === orgId);
  if (!p) {
    p = await store.insert("onboarding_progress", {
      organizationId: orgId, currentStep: 1, completedSteps: [], steps: {}
    });
  }
  return p;
}

export async function GET() {
  try {
    const s = await getSession();
    if (!s) throw Object.assign(new Error("UNAUTHENTICATED"), { status: 401 });
    await assertOrgAccess(s.userId, s.orgId);
    return apiOk(await progressFor(s.orgId));
  } catch (e) {
    return apiError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const s = await getSession();
    if (!s) throw Object.assign(new Error("UNAUTHENTICATED"), { status: 401 });
    await assertOrgAccess(s.userId, s.orgId);
    const body = onboardingSaveSchema.parse(await req.json());
    const p = await progressFor(s.orgId);
    const steps = { ...(p.steps ?? {}), [String(body.step)]: body.data };
    let completedSteps: number[] = [...(p.completedSteps ?? [])];
    if (body.completed && !completedSteps.includes(body.step)) completedSteps.push(body.step);
    const currentStep = Math.min(12, Math.max(p.currentStep, body.completed ? body.step + 1 : body.step));
    const updated = await store.update("onboarding_progress", p.id, { steps, completedSteps, currentStep });
    return apiOk(updated);
  } catch (e) {
    return apiError(e);
  }
}
