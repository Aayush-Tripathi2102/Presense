import { NextRequest } from "next/server";
import { getSession } from "@/server/auth/session";
import { assertOrgAccess } from "@/server/auth/service";
import { jobService, type JobType } from "@/server/jobs/queue";
import { apiError, apiOk } from "@/server/api/respond";

export async function GET() {
  try {
    const s = await getSession();
    if (!s) throw Object.assign(new Error("UNAUTHENTICATED"), { status: 401 });
    await assertOrgAccess(s.userId, s.orgId);
    return apiOk({ jobs: await jobService.list(s.orgId) });
  } catch (e) {
    return apiError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const s = await getSession();
    if (!s) throw Object.assign(new Error("UNAUTHENTICATED"), { status: 401 });
    await assertOrgAccess(s.userId, s.orgId);
    const { type, payload } = (await req.json()) as { type: JobType; payload?: Record<string, unknown> };
    const job = await jobService.enqueue(s.orgId, type, payload ?? {});
    return apiOk({ job }, 201);
  } catch (e) {
    return apiError(e);
  }
}
