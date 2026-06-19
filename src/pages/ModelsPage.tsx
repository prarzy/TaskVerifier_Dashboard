import { useAppData } from '../hooks/useAppData';
import EmptyState from '../components/shared/EmptyState';
import type { ModelEntry } from '../types';
import { Cpu } from 'lucide-react';

function ModelCard({ model }: { model: ModelEntry }) {
  return (
    <div className="rounded-xl border border-bg-border bg-bg-card p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-text-primary">{model.name ?? model.id}</h3>
          {model.provider && (
            <div className="text-xs text-text-muted mt-0.5">{model.provider}</div>
          )}
          {model.version && (
            <div className="text-[10px] font-mono text-text-dim mt-0.5">{model.version}</div>
          )}
        </div>
        <div className="w-10 h-10 rounded-lg bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center flex-shrink-0">
          <Cpu size={18} className="text-accent-blue" />
        </div>
      </div>

      {/* Role */}
      {model.role && (
        <div className="text-xs text-text-secondary italic">{model.role}</div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3">
        {[
          ['Success Rate', model.success_rate !== undefined ? `${(model.success_rate * 100).toFixed(1)}%` : null, 'text-accent-green'],
          ['Avg Attempts', model.avg_attempts?.toFixed(2), 'text-accent-blue-glow'],
          ['Total CVEs', model.total_cves, 'text-text-primary'],
          ['Successes', model.total_successes, 'text-accent-green'],
          ['Hallucination Rate', model.hallucination_rate !== undefined ? `${(model.hallucination_rate * 100).toFixed(1)}%` : null, 'text-accent-amber'],
          ['Context Window', model.context_window, 'text-text-secondary'],
        ].map(([label, value, color]) =>
          value != null ? (
            <div key={String(label)} className="bg-bg-secondary border border-bg-border rounded-lg p-3">
              <div className="text-[10px] font-mono text-text-dim uppercase tracking-wider">{String(label)}</div>
              <div className={`font-mono text-sm font-semibold mt-1 ${String(color)}`}>{String(value)}</div>
            </div>
          ) : null
        )}
      </div>

      {/* Experiment settings */}
      {model.experiment_settings && (
        <div className="border border-bg-border rounded-lg p-3 space-y-2">
          <div className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Experiment Settings</div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono text-text-secondary">
            {Object.entries(model.experiment_settings).map(([k, v]) => (
              <div key={k}>
                <span className="text-text-dim">{k}: </span>
                {String(v)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {model.notes && (
        <div className="text-xs text-text-muted border-t border-bg-border pt-3">{model.notes}</div>
      )}
    </div>
  );
}

export default function ModelsPage() {
  const { models, loading } = useAppData();
  const modelList = models?.models ?? [];

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-text-muted text-sm">Loading…</div>;
  }

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-text-primary">Models</h2>
        <p className="text-sm text-text-muted">
          {modelList.length === 1
            ? 'Detailed statistics for the evaluated model. Additional models will be compared here when available.'
            : `${modelList.length} models available. Side-by-side comparison enabled.`}
        </p>
      </div>

      {modelList.length === 0 ? (
        <EmptyState
          title="No model data available"
          message="Add models to public/data/models.json to populate this page."
          icon={<Cpu size={20} />}
        />
      ) : modelList.length === 1 ? (
        <div className="max-w-2xl">
          <ModelCard model={modelList[0]} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {modelList.map((m) => (
            <ModelCard key={m.id} model={m} />
          ))}
        </div>
      )}
    </div>
  );
}
