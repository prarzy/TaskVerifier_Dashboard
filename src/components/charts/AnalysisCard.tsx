import type { AnalysisConfig } from '../../types';
import type { AggregatedData } from '../../types';
import DynamicChart from './DynamicChart';

interface AnalysisCardProps {
  config: AnalysisConfig;
  aggregated?: AggregatedData | null;
}

export default function AnalysisCard({ config, aggregated }: AnalysisCardProps) {
  // Resolve data from aggregated using data_key
  let chartData: Record<string, unknown>[] = [];
  if (config.data) {
    chartData = config.data;
  } else if (config.data_key && aggregated) {
    const raw = aggregated[config.data_key];
    if (Array.isArray(raw)) {
      chartData = raw as Record<string, unknown>[];
    }
  }

  // If the data is per-CVE-per-attempt (e.g. arvo_1065 attempts 1-6, then arvo_3938
  // attempt 1, then arvo_47101 attempts 1-3), plotting raw "attempt" on the X axis
  // makes it look like the axis resets/goes backwards. Build a composite, unique
  // label per point instead so each (cve, attempt) pair gets its own X position.
  if (config.x_key === 'attempt' && chartData.some((row) => 'cve' in row)) {
    chartData = chartData.map((row) => ({
      ...row,
      attempt: `${row.cve ?? ''} #${row.attempt ?? ''}`,
    }));
  }

  return (
    <div className="rounded-xl border border-bg-border bg-bg-card p-5 flex flex-col gap-4">
      {/* Header */}
      <div>
        <h3 className="text-sm font-semibold text-text-primary">{config.title ?? 'Analysis'}</h3>
        {config.description && (
          <p className="text-xs text-text-muted mt-1 leading-relaxed">{config.description}</p>
        )}
      </div>

      {/* Axis labels */}
      {(config.x_label || config.y_label) && (
        <div className="flex gap-4 text-[10px] font-mono text-text-dim uppercase tracking-wider">
          {config.x_label && <span>X: {config.x_label}</span>}
          {config.y_label && <span>Y: {config.y_label}</span>}
        </div>
      )}

      {/* Chart */}
      <DynamicChart config={config} data={chartData} />

      {/* Claim */}
      {config.claim && (
        <div className="text-xs text-text-muted italic border-t border-bg-border pt-3">
          "{config.claim}"
        </div>
      )}
    </div>
  );
}