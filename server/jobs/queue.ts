import { store } from "@/server/db/store";
import { logger } from "@/server/observability/log";

export type JobType =
  | "website_crawl" | "seo_audit" | "keyword_research" | "competitor_analysis"
  | "analytics_sync" | "social_sync" | "content_generation" | "content_publish"
  | "rank_tracking" | "backlink_monitoring" | "report_generation";

export interface Job {
  id: string; organizationId?: string; type: JobType;
  status: "queued" | "running" | "succeeded" | "failed";
  progress: number; retryCount: number; error?: string;
  payload?: Record<string, unknown>; result?: Record<string, unknown>;
  createdAt: string; startedAt?: string; completedAt?: string;
}

// In-process queue for Phase 1 (swap for BullMQ/Trigger.dev later — same interface).
export const jobService = {
  async enqueue(organizationId: string | undefined, type: JobType, payload: Record<string, unknown> = {}) {
    const job = await store.insert("jobs", { organizationId, type, status: "queued", progress: 0, retryCount: 0, payload });
    logger.info("job.enqueued", { jobId: job.id, type });
    // Simulate async progress for demo crawls/audits.
    void this.process(job.id);
    return job as Job;
  },
  async process(jobId: string) {
    const job = await store.find("jobs", (j) => j.id === jobId);
    if (!job) return;
    await store.update("jobs", jobId, { status: "running", startedAt: new Date().toISOString(), progress: 10 });
    // Phase 1: deterministic mock completion after a short delay.
    setTimeout(async () => {
      await store.update("jobs", jobId, {
        status: "succeeded", progress: 100,
        completedAt: new Date().toISOString(),
        result: { mock: true, note: `Placeholder ${job.type} result — real worker not connected.` }
      });
      logger.info("job.completed", { jobId, type: job.type });
    }, 1500);
  },
  async list(organizationId: string) {
    return store.list("jobs", (j) => j.organizationId === organizationId);
  },
  async get(id: string) {
    return store.find("jobs", (j) => j.id === id);
  }
};
