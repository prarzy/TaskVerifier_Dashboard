import { useParams, Link } from 'react-router-dom';
import { useAppData } from '../hooks/useAppData';
import CveDetailTabs from '../components/cve/CveDetailTabs';
import { resultColor, fmtVulnClass } from '../utils/data';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

export default function CveDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { dataset, loading } = useAppData();

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-text-muted text-sm">Loading…</div>;
  }

  const cve = dataset?.cves?.find((c) => c.cve === id);

  if (!cve) {
    return (
      <div className="p-8">
        <Link to="/cve-explorer" className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary mb-6">
          <ArrowLeft size={14} /> Back to CVE Explorer
        </Link>
        <div className="text-text-muted text-sm">
          CVE <span className="font-mono text-text-secondary">{id}</span> not found in dataset.
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      {/* Back */}
      <Link to="/cve-explorer" className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors">
        <ArrowLeft size={12} /> Back to CVE Explorer
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-mono font-semibold text-accent-blue-glow">{cve.cve}</h2>
            <span className={`text-xs font-mono font-bold flex items-center gap-1 ${resultColor(cve.result)}`}>
              {cve.result === 'PASS' ? <CheckCircle size={13} /> : cve.result === 'FAIL' ? <XCircle size={13} /> : null}
              {cve.result ?? '—'}
            </span>
          </div>
          <div className="text-sm text-text-muted">
            {fmtVulnClass(cve.vuln_class)}
            {cve.sanitizer && <span> · {cve.sanitizer}</span>}
            {cve.bucket && <span> · {cve.bucket} bucket</span>}
          </div>
        </div>

        <div className="flex gap-3 text-xs font-mono">
          <div className="bg-bg-card border border-bg-border rounded-lg px-3 py-2 text-center">
            <div className="text-text-muted text-[10px] uppercase">Attempts</div>
            <div className="text-text-primary font-semibold">{cve.total_attempts ?? '—'}</div>
          </div>
          <div className="bg-bg-card border border-bg-border rounded-lg px-3 py-2 text-center">
            <div className="text-text-muted text-[10px] uppercase">Success At</div>
            <div className="text-accent-green font-semibold">#{cve.first_success_attempt ?? '—'}</div>
          </div>
          <div className="bg-bg-card border border-bg-border rounded-lg px-3 py-2 text-center">
            <div className="text-text-muted text-[10px] uppercase">Hallucinations</div>
            <div className={cve.has_hallucinations ? 'text-accent-amber font-semibold' : 'text-text-secondary font-semibold'}>
              {cve.has_hallucinations !== undefined ? (cve.has_hallucinations ? 'Yes' : 'None') : '—'}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <CveDetailTabs cve={cve} />
    </div>
  );
}
