import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CVEEntry } from '../../types';
import { fmtVulnClass, resultColor } from '../../utils/data';
import SearchBar from '../shared/SearchBar';
import EmptyState from '../shared/EmptyState';
import { ChevronRight, Filter } from 'lucide-react';

interface CveTableProps {
  cves: CVEEntry[];
}

const ALL = '__all__';

export default function CveTable({ cves }: CveTableProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [filterClass, setFilterClass] = useState(ALL);
  const [filterResult, setFilterResult] = useState(ALL);
  const [filterSanitizer, setFilterSanitizer] = useState(ALL);
  const [filterBucket, setFilterBucket] = useState(ALL);

  const vulnClasses = useMemo(() => [...new Set(cves.map((c) => c.vuln_class).filter(Boolean))], [cves]);
  const sanitizers = useMemo(() => [...new Set(cves.map((c) => c.sanitizer).filter(Boolean))], [cves]);
  const buckets = useMemo(() => [...new Set(cves.map((c) => c.bucket).filter(Boolean))], [cves]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return cves.filter((c) => {
      if (q && !c.cve?.toLowerCase().includes(q) && !c.vuln_class?.toLowerCase().includes(q)) return false;
      if (filterClass !== ALL && c.vuln_class !== filterClass) return false;
      if (filterResult !== ALL && c.result !== filterResult) return false;
      if (filterSanitizer !== ALL && c.sanitizer !== filterSanitizer) return false;
      if (filterBucket !== ALL && c.bucket !== filterBucket) return false;
      return true;
    });
  }, [cves, query, filterClass, filterResult, filterSanitizer, filterBucket]);

  const selectClass = 'bg-bg-card border border-bg-border rounded-lg px-3 py-2 text-xs text-text-secondary focus:outline-none focus:border-accent-blue/50 transition-colors';

  return (
    <div className="space-y-4">
      {/* Search + Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <SearchBar value={query} onChange={setQuery} placeholder="Search CVE ID, vuln class…" />
        <div className="flex items-center gap-1.5 text-text-muted">
          <Filter size={13} />
        </div>
        <select className={selectClass} value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
          <option value={ALL}>All Classes</option>
          {vulnClasses.map((v) => <option key={v} value={v!}>{fmtVulnClass(v)}</option>)}
        </select>
        <select className={selectClass} value={filterSanitizer} onChange={(e) => setFilterSanitizer(e.target.value)}>
          <option value={ALL}>All Sanitizers</option>
          {sanitizers.map((s) => <option key={s} value={s!}>{s}</option>)}
        </select>
        <select className={selectClass} value={filterBucket} onChange={(e) => setFilterBucket(e.target.value)}>
          <option value={ALL}>All Buckets</option>
          {buckets.map((b) => <option key={b} value={b!}>{b}</option>)}
        </select>
        <select className={selectClass} value={filterResult} onChange={(e) => setFilterResult(e.target.value)}>
          <option value={ALL}>All Results</option>
          <option value="PASS">PASS</option>
          <option value="FAIL">FAIL</option>
        </select>
      </div>

      {/* Count */}
      <div className="text-xs text-text-muted font-mono">
        Showing {filtered.length} of {cves.length} entries
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState title="No CVEs match filters" message="Try adjusting your search or filter criteria." />
      ) : (
        <div className="rounded-xl border border-bg-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg-secondary border-b border-bg-border text-[10px] font-medium text-text-muted uppercase tracking-widest">
                <th className="text-left px-4 py-3">CVE ID</th>
                <th className="text-left px-4 py-3">Vuln Class</th>
                <th className="text-left px-4 py-3">Bucket</th>
                <th className="text-left px-4 py-3">Sanitizer</th>
                <th className="text-left px-4 py-3">Attempts</th>
                <th className="text-left px-4 py-3">Result</th>
                <th className="text-left px-4 py-3">Run Date</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((cve, i) => (
                <tr
                  key={cve.cve}
                  onClick={() => navigate(`/cve-explorer/${cve.cve}`)}
                  className={`border-b border-bg-border cursor-pointer hover:bg-bg-hover transition-colors ${
                    i % 2 === 0 ? 'bg-bg-card' : 'bg-bg-primary/30'
                  }`}
                >
                  <td className="px-4 py-3 font-mono text-xs text-accent-blue-glow">{cve.cve}</td>
                  <td className="px-4 py-3 text-xs text-text-secondary">{fmtVulnClass(cve.vuln_class)}</td>
                  <td className="px-4 py-3 text-xs text-text-muted">{cve.bucket ?? '—'}</td>
                  <td className="px-4 py-3">
                    {cve.sanitizer ? (
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-bg-secondary border border-bg-border text-text-secondary">
                        {cve.sanitizer}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-text-secondary">{cve.total_attempts ?? '—'}</td>
                  <td className={`px-4 py-3 text-xs font-mono font-semibold ${resultColor(cve.result)}`}>
                    {cve.result ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-xs text-text-muted font-mono">
                    {cve.run_timestamp ? new Date(cve.run_timestamp).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3 text-text-muted">
                    <ChevronRight size={14} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
