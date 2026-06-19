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
    <div className="p-10 space-y-12 max-w-6xl mx-auto">

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] font-mono text-accent-blue uppercase tracking-widest">
            {overview?.benchmark ?? 'CyberGym Benchmark'}
          </span>
          {overview?.status === 'experiments_running' && (
            <>
              <span className="w-1 h-1 rounded-full bg-text-dim" />
              <span className="text-[10px] font-mono text-accent-green uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-green inline-block animate-pulse" />
                Experiments Active
              </span>
            </>
          )}
        </div>

        <h2 className="text-3xl font-semibold text-text-primary leading-tight">
          {overview?.project_name ?? 'TaskVerifier'}
        </h2>

        <p className="text-base text-text-secondary max-w-2xl leading-relaxed">
          {overview?.tagline ?? 'AI-generated PoC exploit generation with structured execution feedback.'}
        </p>

        {overview?.notes && (
          <p className="text-xs text-text-muted italic max-w-2xl leading-relaxed pt-1">
            {overview.notes}
          </p>
        )}
      </div>

      {/* Primary metrics */}
      {m ? (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
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

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
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
        </div>
      ) : (
        <EmptyState
          title="Metrics pending experiment completion"
          message="Overview metrics will populate once experiment data is available."
        />
      )}

      {/* Workflow diagram */}
      <div className="rounded-xl border border-bg-border bg-bg-card p-8">
        <div className="text-xs font-mono text-text-muted uppercase tracking-widest mb-8">
          TaskVerifier Workflow
        </div>
        <WorkflowDiagram />
      </div>

      {/* Dataset info */}
      {meta && (
        <div className="rounded-xl border border-bg-border bg-bg-card p-6 space-y-3">
          <div className="text-text-muted uppercase tracking-widest text-[10px] font-mono">Dataset Info</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-text-secondary">
            {meta.schema_version && (
              <div><span className="text-text-dim">Schema </span>{meta.schema_version}</div>
            )}
            {meta.generated_at && (
              <div><span className="text-text-dim">Generated </span>{meta.generated_at}</div>
            )}
            {meta.total_cves !== undefined && (
              <div><span className="text-text-dim">CVEs in dataset </span>{meta.total_cves}</div>
            )}
          </div>
          {meta.description && (
            <div className="text-xs text-text-muted leading-relaxed pt-1">{meta.description}</div>
          )}
        </div>
      )}
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
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-x-2 gap-y-6">
      {steps.map((step, i) => (
        <div key={step.label} className="relative flex flex-col items-center gap-2 text-center">
          <div
            className="w-full px-3 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap"
            style={{ background: `${step.color}1a`, border: `1px solid ${step.color}40`, color: step.color }}
          >
            {step.label}
          </div>
          <div className="text-[10px] text-text-dim leading-snug px-1">{step.sub}</div>

          {/* Connector arrow — hidden below lg to avoid wrap misalignment */}
          {i < steps.length - 1 && (
            <div className="hidden lg:flex absolute top-3 -right-2 translate-x-full text-text-dim text-sm">
              →
            </div>
          )}
        </div>
      ))}
    </div>
  );
}