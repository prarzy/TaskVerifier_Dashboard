import { useAppData } from '../hooks/useAppData';
import CveTable from '../components/cve/CveTable';
import EmptyState from '../components/shared/EmptyState';

export default function CveExplorerPage() {
  const { dataset, loading } = useAppData();

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-text-muted text-sm">Loading…</div>;
  }

  const cves = dataset?.cves ?? [];

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-text-primary">CVE Explorer</h2>
        <p className="text-sm text-text-muted">
          Browse and filter individual benchmark entries. Click a row to view full details.
        </p>
      </div>

      {cves.length === 0 ? (
        <EmptyState
          title="No CVE data available"
          message="Add CVE entries to your dataset.json to populate this table."
        />
      ) : (
        <CveTable cves={cves} />
      )}
    </div>
  );
}
