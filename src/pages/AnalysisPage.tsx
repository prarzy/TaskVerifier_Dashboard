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

      {/* Graph recommendations from dataset */}
      {dataset?.graph_recommendations && dataset.graph_recommendations.length > 0 && (
        <div className="rounded-xl border border-accent-blue/20 bg-accent-blue/5 p-4">
          <div className="text-[10px] font-mono text-accent-blue uppercase tracking-widest mb-2">
            Recommended Visualizations (from dataset)
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-text-muted">
            {dataset.graph_recommendations.map((g) => (
              <div key={g.id} className="flex items-start gap-2">
                <span className="font-mono text-text-dim">{g.id}</span>
                <span>{g.title}</span>
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
