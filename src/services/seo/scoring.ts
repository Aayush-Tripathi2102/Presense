import type { RuleFinding, Severity } from "./rules/types";

/**
 * Documented prioritization heuristic (gameplan §7):
 *   health = 100 − Σ over distinct rules of (weight × spread)
 *   weight: critical 12, high 6, medium 3, low 1, info 0
 *   spread: 1 + min(pagesAffected, 10) × 0.1
 * This is a triage heuristic, not a predicted ranking gain.
 */

const WEIGHTS: Record<Severity, number> = { critical: 12, high: 6, medium: 3, low: 1, info: 0 };

export interface AuditScore {
  health: number;
  formula: string;
  counts: { fail: number; warning: number; unknown: number };
  bySeverity: Record<Severity, number>;
}

export function scoreFindings(findings: RuleFinding[]): AuditScore {
  const counts = { fail: 0, warning: 0, unknown: 0 };
  const bySeverity: Record<Severity, number> = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
  const perRule = new Map<string, { weight: number; pages: Set<string> }>();

  for (const f of findings) {
    counts[f.status] += 1;
    bySeverity[f.severity] += 1;
    if (f.status === "unknown") continue;
    const entry = perRule.get(f.ruleId) ?? { weight: WEIGHTS[f.severity], pages: new Set<string>() };
    if (f.pageUrl) entry.pages.add(f.pageUrl);
    perRule.set(f.ruleId, entry);
  }

  let penalty = 0;
  for (const { weight, pages } of perRule.values()) {
    penalty += weight * (1 + Math.min(pages.size, 10) * 0.1);
  }

  return {
    health: Math.max(0, Math.round(100 - Math.min(penalty, 100))),
    formula: "100 − Σ weight(severity) × spread(pages); weights critical 12 / high 6 / medium 3 / low 1 / info 0",
    counts,
    bySeverity,
  };
}

const SEV_RANK: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };

/** Priority order: severity first, then breadth (template-level grouping). */
export function prioritize(findings: RuleFinding[]): RuleFinding[] {
  const breadth = new Map<string, number>();
  for (const f of findings) breadth.set(f.ruleId, (breadth.get(f.ruleId) ?? 0) + 1);
  return [...findings].sort((a, b) => {
    const s = SEV_RANK[a.severity] - SEV_RANK[b.severity];
    if (s !== 0) return s;
    return (breadth.get(b.ruleId) ?? 0) - (breadth.get(a.ruleId) ?? 0);
  });
}
