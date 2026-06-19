// ─── Core CVE / Attempt Types ───────────────────────────────────────────────

export interface Attempt {
  attempt: number;
  verifier_status?: string;
  verifier_stage?: string;
  hallucinated_symbols?: string[];
  hallucinated_symbol_count?: number;
  prompt_length_chars?: number;
  llm_response_length_chars?: number;
  feedback_present?: boolean;
  execution_time_ms?: number | null;
  crash_triggered?: boolean;
  fuzzer_seed?: number;
  crash_type?: string;
  compiler_error?: string;
  sanitizer_output?: string;
  transcript?: string;
  [key: string]: unknown; // allow unknown future fields
}

export interface CVEEntry {
  cve: string;
  run_timestamp?: string;
  run_end_timestamp?: string;
  bucket?: string;
  vuln_class?: string;
  sanitizer?: string;
  result?: string;
  total_attempts?: number;
  first_success_attempt?: number;
  max_attempts_allowed?: number;
  has_hallucinations?: boolean;
  fuzzer_binary?: string;
  docker_image?: string;
  model?: string;
  attempts?: Attempt[];
  [key: string]: unknown;
}

// ─── Aggregated Data Types ───────────────────────────────────────────────────

export interface AttemptsToSuccess {
  cve: string;
  attempts_to_success: number;
}

export interface PerAttemptStatus {
  cve: string;
  attempt: number;
  verifier_status?: string;
  verifier_stage?: string;
  crash_triggered?: boolean;
  hallucinated_symbol_count?: number;
}

export interface SuccessByAttempt {
  attempt: number;
  successes?: number;
  total_cves_reaching_attempt?: number;
  success_rate?: number;
}

export interface CumulativeSuccess {
  attempt: number;
  cumulative_successes?: number;
  total_cves?: number;
  cumulative_rate?: number;
}

export interface FailureStageByAttempt {
  attempt: number;
  stage_execution_count?: number;
  stage_sanitizer_count?: number;
  stage_null_count?: number;
}

export interface HallucinationByAttempt {
  cve: string;
  attempt: number;
  hallucinated_symbol_count?: number;
}

export interface PromptLengthEntry {
  cve: string;
  attempt: number;
  prompt_length_chars?: number;
  llm_response_length_chars?: number;
}

export interface CVESummary {
  cve: string;
  vuln_class?: string;
  sanitizer?: string;
  bucket?: string;
  result?: string;
  attempts_to_success?: number;
  has_hallucinations?: boolean;
  total_hallucinated_symbols?: number;
}

export interface AggregatedData {
  attempts_to_success?: AttemptsToSuccess[];
  per_attempt_status_all_cves?: PerAttemptStatus[];
  success_by_attempt_number?: SuccessByAttempt[];
  cumulative_success_by_attempt?: CumulativeSuccess[];
  failure_stage_distribution_by_attempt?: FailureStageByAttempt[];
  hallucination_count_by_attempt_across_cves?: HallucinationByAttempt[];
  prompt_length_by_attempt?: PromptLengthEntry[];
  cve_summary?: CVESummary[];
  [key: string]: unknown[] | undefined;
}

export interface DatasetMeta {
  schema_version?: string;
  description?: string;
  generated_at?: string;
  total_cves?: number;
}

export interface GraphRecommendation {
  id: string;
  title: string;
  dataset_key?: string;
  graph_type?: string;
  x_axis?: string;
  y_axis?: string;
  claim?: string;
}

export interface Dataset {
  meta?: DatasetMeta;
  cves?: CVEEntry[];
  aggregated?: AggregatedData;
  graph_recommendations?: GraphRecommendation[];
}

// ─── Overview / Metrics Types ────────────────────────────────────────────────

export interface OverviewMetrics {
  total_cves?: number;
  taskverifier_success_rate?: number;
  baseline_success_rate?: number;
  improvement_pct?: number;
  avg_attempts_to_success?: number;
  max_attempts_allowed?: number;
  vuln_classes_covered?: number;
  models_evaluated?: number;
  experiments_completed?: number;
  [key: string]: number | undefined;
}

export interface OverviewData {
  project_name?: string;
  tagline?: string;
  benchmark?: string;
  status?: string;
  last_updated?: string;
  metrics?: OverviewMetrics;
  notes?: string;
}

// ─── Model Types ─────────────────────────────────────────────────────────────

export interface ExperimentSettings {
  max_attempts?: number;
  feedback_enabled?: boolean;
  temperature?: number;
  system_prompt?: string;
  [key: string]: unknown;
}

export interface ModelEntry {
  id: string;
  name?: string;
  provider?: string;
  version?: string;
  role?: string;
  success_rate?: number;
  avg_attempts?: number;
  total_cves?: number;
  total_successes?: number;
  hallucination_rate?: number;
  context_window?: string;
  notes?: string;
  experiment_settings?: ExperimentSettings;
  [key: string]: unknown;
}

export interface ModelsData {
  models?: ModelEntry[];
}

// ─── Timeline Types ───────────────────────────────────────────────────────────

export interface TimelineEvent {
  id: string;
  date?: string;
  title?: string;
  description?: string;
  category?: string;
  icon?: string;
  [key: string]: unknown;
}

export interface TimelineData {
  events?: TimelineEvent[];
}

// ─── Analysis / Chart Types ───────────────────────────────────────────────────

export interface ChartSeries {
  key: string;
  label: string;
  color?: string;
}

export interface AnalysisConfig {
  id: string;
  title?: string;
  description?: string;
  chart_type?: 'bar' | 'line' | 'area' | 'pie' | 'stacked_bar' | 'scatter' | string;
  x_key?: string;
  x_label?: string;
  y_label?: string;
  data_key?: string;
  series?: ChartSeries[];
  source?: string;
  order?: number;
  claim?: string;
  data?: Record<string, unknown>[];
}
