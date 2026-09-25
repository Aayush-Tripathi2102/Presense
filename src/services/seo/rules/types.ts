/** Rule engine types. Mirrors vault `03 - SEO Engine/02 - Rule Registry`. */

export type RuleStatus = "pass" | "warning" | "fail" | "unknown";
export type Severity = "critical" | "high" | "medium" | "low" | "info";
/** Detection class from vault Detection Matrix: A crawl-only … F manual. */
export type DetectionClass = "A" | "B" | "C" | "D" | "E" | "F";

export interface RuleDef {
  id: string;
  category: string;
  question: string;
  /** Impact 1–10 from the source audit checklist (AI-visibility influence). */
  impact: number;
  severity: Severity;
  detection: DetectionClass;
  automation: "deterministic" | "needs_data" | "planned";
  recommendation: string;
}

export interface RuleFinding {
  ruleId: string;
  category: string;
  severity: Severity;
  status: Exclude<RuleStatus, "pass">;
  pageUrl: string | null;
  message: string;
  evidence: Record<string, unknown>;
  recommendation: string;
}

export function severityForImpact(impact: number): Severity {
  if (impact >= 8) return "critical";
  if (impact >= 5) return "high";
  if (impact >= 2) return "medium";
  return "low";
}
