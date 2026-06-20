import { useAppData } from '../hooks/useAppData';
import AnalysisCard from '../components/charts/AnalysisCard';
import EmptyState from '../components/shared/EmptyState';
import { BarChart3 } from 'lucide-react';

export default function AnalysisPage() {
  const { analyses, dataset, loading } = useAppData();
  const aggregated = dataset?.aggregated ?? null;

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-text-muted text-sm">Loading…</div>;
  }

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-text-primary">Analysis</h2>
        <p className="text-sm text-text-muted">
          Aggregate performance analyses across all CVEs and experiments. Charts auto-populate from{' '}
          <span className="font-mono text-text-secondary">public/data/analyses/</span>.
        </p>
      </div>

      {/* Visualizations index — lists only charts actually rendered below */}
      {analyses.length > 0 && (
        <div className="rounded-xl border border-bg-border bg-bg-card p-4">
          <div className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-2">
            Visualizations
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-text-secondary">
            {analyses.map((a) => (
              <div key={a.id} className="flex items-start gap-2">
                <span className="text-text-dim">·</span>
                <span>{a.title ?? a.id}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {analyses.length === 0 ? (
        <EmptyState
          title="No analysis charts available"
          message="Add JSON files to public/data/analyses/ to populate this page. No code changes required."
          icon={<BarChart3 size={20} />}
        />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {analyses.map((config) => (
            <AnalysisCard key={config.id} config={config} aggregated={aggregated} />
          ))}
        </div>
      )}
    </div>
  );
}