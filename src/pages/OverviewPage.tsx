import { useAppData } from '../hooks/useAppData';
import MetricCard from '../components/shared/MetricCard';
import EmptyState from '../components/shared/EmptyState';
import { fmtPct } from '../utils/data';
import {
  Target, TrendingUp, Activity, Cpu, CheckCircle,
  BarChart3, Shield, Database, Zap,
} from 'lucide-react';

export default function OverviewPage() {
  const { overview, dataset, loading } = useAppData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-text-muted text-sm">
        Loading…
      </div>
    );
  }

  const m = overview?.metrics;
  const meta = dataset?.meta;

  const successRate = m?.taskverifier_success_rate;
  const baselineRate = m?.baseline_success_rate;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="text-[10px] font-mono text-accent-blue uppercase tracking-widest">
            {overview?.benchmark ?? 'CyberGym Benchmark'}
          </div>
          <div className="w-1 h-1 rounded-full bg-text-dim" />
          {overview?.status === 'experiments_running' && (
            <div className="text-[10px] font-mono text-accent-green uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green inline-block animate-pulse" />
              Experiments Active
            </div>
          )}
        </div>
        <h2 className="text-2xl font-semibold text-text-primary">
          {overview?.project_name ?? 'TaskVerifier'}
        </h2>
        <p className="text-sm text-text-secondary max-w-2xl">
          {overview?.tagline ?? 'AI-generated PoC exploit generation with structured execution feedback.'}
        </p>
        {overview?.notes && (
          <p className="text-xs text-text-muted italic">{overview.notes}</p>
        )}
      </div>

      {/* Primary metrics */}
      {m ? (
        <>
          <div className="grid grid-cols-3 gap-4">
            <MetricCard
              label="TaskVerifier Success Rate"
              value={successRate !== undefined ? fmtPct(successRate) : undefined}
              sub="Across all completed experiments"
              icon={<Target size={18} className="text-accent-blue" />}
              accent="blue"
              large
            />
            <MetricCard
              label="Baseline Success Rate"
              value={baselineRate !== undefined ? fmtPct(baselineRate) : undefined}
              sub="Single-attempt generation (no feedback)"
              icon={<BarChart3 size={18} className="text-accent-purple" />}
              accent="purple"
              large
            />
            <MetricCard
              label="Improvement"
              value={m.improvement_pct !== undefined ? `+${m.improvement_pct}%` : undefined}
              sub="TaskVerifier vs. Baseline"
              icon={<TrendingUp size={18} className="text-accent-green" />}
              accent="green"
              large
            />
          </div>

          <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
            <MetricCard
              label="Total CVEs"
              value={m.total_cves}
              icon={<Database size={16} />}
              accent="cyan"
            />
            <MetricCard
              label="Avg Attempts"
              value={m.avg_attempts_to_success?.toFixed(2)}
              sub="to success"
              icon={<Activity size={16} />}
              accent="blue"
            />
            <MetricCard
              label="Max Attempts"
              value={m.max_attempts_allowed}
              sub="per CVE"
              icon={<Zap size={16} />}
              accent="amber"
            />
            <MetricCard
              label="Vuln Classes"
              value={m.vuln_classes_covered}
              sub="covered"
              icon={<Shield size={16} />}
              accent="purple"
            />
            <MetricCard
              label="Models"
              value={m.models_evaluated}
              sub="evaluated"
              icon={<Cpu size={16} />}
              accent="blue"
            />
            <MetricCard
              label="Experiments"
              value={m.experiments_completed}
              sub="completed"
              icon={<CheckCircle size={16} />}
              accent="green"
            />
          </div>
        </>
      ) : (
        <EmptyState
          title="Metrics pending experiment completion"
          message="Overview metrics will populate once experiment data is available."
        />
      )}

      {/* Dataset info */}
      {meta && (
        <div className="rounded-xl border border-bg-border bg-bg-card p-5 text-xs font-mono space-y-2">
          <div className="text-text-muted uppercase tracking-widest text-[10px]">Dataset Info</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-text-secondary">
            {meta.schema_version && <div><span className="text-text-dim">Schema: </span>{meta.schema_version}</div>}
            {meta.generated_at && <div><span className="text-text-dim">Generated: </span>{meta.generated_at}</div>}
            {meta.total_cves !== undefined && <div><span className="text-text-dim">CVEs in dataset: </span>{meta.total_cves}</div>}
          </div>
          {meta.description && <div className="text-text-muted">{meta.description}</div>}
        </div>
      )}

      {/* Workflow diagram */}
      <div className="rounded-xl border border-bg-border bg-bg-card p-6">
        <div className="text-xs font-mono text-text-muted uppercase tracking-widest mb-5">TaskVerifier Workflow</div>
        <WorkflowDiagram />
      </div>
    </div>
  );
}

function WorkflowDiagram() {
  const steps = [
    { label: 'CVE', sub: 'CyberGym benchmark', color: '#3b82f6' },
    { label: 'Prompt', sub: 'Source context injection', color: '#6366f1' },
    { label: 'LLM', sub: 'PoC generation', color: '#8b5cf6' },
    { label: 'Verifier', sub: 'Compile + Execute', color: '#06b6d4' },
    { label: 'Feedback', sub: 'Structured errors', color: '#f59e0b' },
    { label: 'Retry', sub: 'Up to max attempts', color: '#10b981' },
    { label: 'Result', sub: 'PASS / FAIL', color: '#3b82f6' },
  ];

  return (
    <div className="flex items-center gap-0 flex-wrap">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div
              className="px-4 py-2.5 rounded-lg text-xs font-semibold text-white"
              style={{ background: `${step.color}22`, border: `1px solid ${step.color}44`, color: step.color }}
            >
              {step.label}
            </div>
            <div className="text-[9px] text-text-dim text-center max-w-[80px]">{step.sub}</div>
          </div>
          {i < steps.length - 1 && (
            <div className="mx-2 text-text-dim text-xs">→</div>
          )}
        </div>
      ))}
    </div>
  );
}
