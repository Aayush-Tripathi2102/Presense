import { NextRequest } from "next/server";
import { getSession } from "@/server/auth/session";
import { assertOrgAccess } from "@/server/auth/service";
import { websiteAnalyzeSchema } from "@/lib/validations";
import { seoService } from "@/server/seo/service";
import { store } from "@/server/db/store";
import { jobService } from "@/server/jobs/queue";
import { apiError, apiOk } from "@/server/api/respond";

// POST /api/onboarding/website/analyze — placeholder analyzer (mock-labeled).
export async function POST(req: NextRequest) {
  try {
    const s = await getSession();
    if (!s) throw Object.assign(new Error("UNAUTHENTICATED"), { status: 401 });
    await assertOrgAccess(s.userId, s.orgId);
    const { url } = websiteAnalyzeSchema.parse(await req.json());
    const analysis = await seoService.analyzeWebsite({ url, organizationId: s.orgId });
    await store.upsert("websites", (w) => w.organizationId === s.orgId, {
      organizationId: s.orgId, url, analysis
    });
    await jobService.enqueue(s.orgId, "website_crawl", { url });
    return apiOk({ analysis });
  } catch (e) {
    return apiError(e);
  }
}
