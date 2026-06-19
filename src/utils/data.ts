import type { Dataset, OverviewData, ModelsData, TimelineData, AnalysisConfig } from '../types';

/** Safely fetch JSON from /public/data/ */
export async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(path);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function loadDataset(): Promise<Dataset | null> {
  return fetchJson<Dataset>('/data/dataset.json');
}

export async function loadOverview(): Promise<OverviewData | null> {
  return fetchJson<OverviewData>('/data/overview.json');
}

export async function loadModels(): Promise<ModelsData | null> {
  return fetchJson<ModelsData>('/data/models.json');
}

export async function loadTimeline(): Promise<TimelineData | null> {
  return fetchJson<TimelineData>('/data/timeline.json');
}

/**
 * Discover and load all analysis configs from /data/analyses/.
 * Falls back to a hardcoded list if manifest.json doesn't exist.
 */
export async function loadAnalyses(): Promise<AnalysisConfig[]> {
  const manifest = await fetchJson<{ files: string[] }>('/data/analyses/manifest.json');
  const filenames: string[] = manifest?.files ?? [
    'cumulative_success.json',
    'attempts_to_success.json',
    'failure_stage_distribution.json',
    'prompt_length.json',
    'vuln_class_breakdown.json',
    'hallucination_scatter.json',
  ];
  const results = await Promise.all(
    filenames.map((f) => fetchJson<AnalysisConfig>(`/data/analyses/${f}`))
  );
  return results
    .filter((r): r is AnalysisConfig => r !== null)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

/** Safe number formatter */
export function fmt(value: number | undefined | null, decimals = 1): string {
  if (value === undefined || value === null) return '—';
  return value.toFixed(decimals);
}

/** Percent formatter */
export function fmtPct(value: number | undefined | null, decimals = 1): string {
  if (value === undefined || value === null) return '—';
  return `${(value * 100).toFixed(decimals)}%`;
}

/** Format vuln_class label */
export function fmtVulnClass(s: string | undefined): string {
  if (!s) return '—';
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Result badge color class */
export function resultColor(result: string | undefined): string {
  if (!result) return 'text-text-secondary';
  if (result === 'PASS') return 'text-accent-green';
  if (result === 'FAIL') return 'text-accent-red';
  return 'text-accent-amber';
}

/** Sanitizer badge color */
export function sanitizerColor(s: string | undefined): string {
  if (!s) return '#475569';
  if (s === 'ASAN') return '#ef4444';
  if (s === 'MSAN') return '#8b5cf6';
  if (s === 'UBSAN') return '#f59e0b';
  return '#3b82f6';
}
