import type { CVEEntry } from '../types';

/**
 * Everything on this dashboard that looks like a "metric" or "aggregate chart"
 * is derived here, live, from `dataset.cves[]`. Nothing is hand-typed in a
 * separate JSON file. Add a new CVE to cves[] and every page updates itself:
 * Overview metrics, Analysis charts, baseline comparison — all of it.
 */

// ─── Overview metrics ─────────────────────────────────────────────────────────

export interface ComputedOverviewMetrics {
  total_cves: number;
  taskverifier_success_rate: number | undefined;
  avg_attempts_to_success: number | undefined;
  max_attempts_allowed: number | undefined;
  vuln_classes_covered: number;
  experiments_completed: number;
}

export function computeOverviewMetrics(cves: CVEEntry[]): ComputedOverviewMetrics {
  const withResult = cves.filter((c) => c.result === 'PASS' || c.result === 'FAIL');
  const passed = cves.filter((c) => c.result === 'PASS');

  const successRate = withResult.length > 0 ? passed.length / withResult.length : undefined;

  const attemptsToSuccess = passed
    .map((c) => c.first_success_attempt)
    .filter((n): n is number => typeof n === 'number');
  const avgAttempts =
    attemptsToSuccess.length > 0
      ? attemptsToSuccess.reduce((a, b) => a + b, 0) / attemptsToSuccess.length
      : undefined;

  const maxAttemptsValues = cves
    .map((c) => c.max_attempts_allowed)
    .filter((n): n is number => typeof n === 'number');
  const maxAttempts = maxAttemptsValues.length > 0 ? Math.max(...maxAttemptsValues) : undefined;

  const vulnClasses = new Set(cves.map((c) => c.vuln_class).filter(Boolean));

  return {
    total_cves: cves.length,
    taskverifier_success_rate: successRate,
    avg_attempts_to_success: avgAttempts,
    max_attempts_allowed: maxAttempts,
    vuln_classes_covered: vulnClasses.size,
    experiments_completed: withResult.length,
  };
}

// ─── Analysis page aggregates ─────────────────────────────────────────────────

/** attempts_to_success: one row per CVE that succeeded */
export function computeAttemptsToSuccess(cves: CVEEntry[]) {
  return cves
    .filter((c) => typeof c.first_success_attempt === 'number')
    .map((c) => ({ cve: c.cve, attempts_to_success: c.first_success_attempt }));
}

/** cumulative_success_by_attempt: fraction of CVEs solved by attempt N, for every N up to the largest max_attempts_allowed */
export function computeCumulativeSuccess(cves: CVEEntry[]) {
  const total = cves.length;
  if (total === 0) return [];

  const maxAttempt = Math.max(
    1,
    ...cves.map((c) => c.max_attempts_allowed ?? c.total_attempts ?? 1)
  );

  const rows: { attempt: number; cumulative_rate: number }[] = [];
  for (let attempt = 1; attempt <= maxAttempt; attempt++) {
    const solvedByNow = cves.filter(
      (c) => typeof c.first_success_attempt === 'number' && c.first_success_attempt <= attempt
    ).length;
    rows.push({ attempt, cumulative_rate: solvedByNow / total });
  }
  return rows;
}

/** failure_stage_distribution_by_attempt: how many CVEs are at "execution" vs "sanitizer" stage at each attempt number */
export function computeFailureStageDistribution(cves: CVEEntry[]) {
  const maxAttempt = Math.max(
    1,
    ...cves.flatMap((c) => c.attempts?.map((a) => a.attempt) ?? [1])
  );

  const rows: { attempt: number; stage_execution_count: number; stage_sanitizer_count: number }[] = [];
  for (let attempt = 1; attempt <= maxAttempt; attempt++) {
    let executionCount = 0;
    let sanitizerCount = 0;
    for (const cve of cves) {
      const a = cve.attempts?.find((x) => x.attempt === attempt);
      if (!a) continue;
      if (a.verifier_stage === 'execution') executionCount++;
      if (a.verifier_stage === 'sanitizer') sanitizerCount++;
    }
    if (executionCount > 0 || sanitizerCount > 0) {
      rows.push({ attempt, stage_execution_count: executionCount, stage_sanitizer_count: sanitizerCount });
    }
  }
  return rows;
}

/** cve_summary / vuln_class_breakdown: one row per CVE with its vuln class and attempts-to-success, for grouping by class */
export function computeCveSummary(cves: CVEEntry[]) {
  return cves.map((c) => ({
    cve: c.cve,
    vuln_class: c.vuln_class,
    sanitizer: c.sanitizer,
    bucket: c.bucket,
    result: c.result,
    attempts_to_success: c.first_success_attempt,
    has_hallucinations: c.has_hallucinations,
  }));
}

/** Average attempts-to-success grouped by vulnerability class — used by the bar chart */
export function computeVulnClassBreakdown(cves: CVEEntry[]) {
  const byClass = new Map<string, number[]>();
  for (const c of cves) {
    if (!c.vuln_class || typeof c.first_success_attempt !== 'number') continue;
    const arr = byClass.get(c.vuln_class) ?? [];
    arr.push(c.first_success_attempt);
    byClass.set(c.vuln_class, arr);
  }
  return Array.from(byClass.entries()).map(([vuln_class, attempts]) => ({
    vuln_class,
    attempts_to_success: attempts.reduce((a, b) => a + b, 0) / attempts.length,
  }));
}

/** Bundles every computed aggregate so a chart's data_key can resolve against it exactly like the old static dataset.aggregated did */
export function computeAggregated(cves: CVEEntry[]): Record<string, Record<string, unknown>[]> {
  return {
    attempts_to_success: computeAttemptsToSuccess(cves),
    cumulative_success_by_attempt: computeCumulativeSuccess(cves),
    failure_stage_distribution_by_attempt: computeFailureStageDistribution(cves),
    cve_summary: computeCveSummary(cves),
    vuln_class_breakdown: computeVulnClassBreakdown(cves),
  };
}