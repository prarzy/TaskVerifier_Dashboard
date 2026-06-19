import { useState } from 'react';
import type { CVEEntry, Attempt } from '../../types';
import { fmtVulnClass, resultColor } from '../../utils/data';
import CodeViewer from '../shared/CodeViewer';
import RawJsonViewer from '../shared/RawJsonViewer';
import EmptyState from '../shared/EmptyState';
import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';

interface CveDetailTabsProps {
  cve: CVEEntry;
}

type TabId = 'metadata' | 'attempts' | 'feedback' | 'transcript' | 'raw';

const TABS: { id: TabId; label: string }[] = [
  { id: 'metadata', label: 'Metadata' },
  { id: 'attempts', label: 'Attempt History' },
  { id: 'feedback', label: 'Compiler / Sanitizer' },
  { id: 'transcript', label: 'Transcript' },
  { id: 'raw', label: 'Raw JSON' },
];

function AttemptRow({ attempt, isSuccess }: { attempt: Attempt; isSuccess: boolean }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`border border-bg-border rounded-lg overflow-hidden ${isSuccess ? 'border-accent-green/30' : ''}`}>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-bg-secondary hover:bg-bg-hover transition-colors text-left"
      >
        <span className="font-mono text-xs text-text-muted w-16">#{attempt.attempt}</span>
        {isSuccess ? (
          <CheckCircle size={14} className="text-accent-green flex-shrink-0" />
        ) : attempt.crash_triggered ? (
          <CheckCircle size={14} className="text-accent-green flex-shrink-0" />
        ) : (
          <XCircle size={14} className="text-text-muted flex-shrink-0" />
        )}
        <span className="text-xs text-text-secondary flex-1">
          Stage: <span className="font-mono">{attempt.verifier_stage ?? '—'}</span>
          <span className="mx-2 text-text-dim">·</span>
          Status: <span className={`font-mono ${attempt.crash_triggered ? 'text-accent-green' : 'text-text-muted'}`}>
            {attempt.verifier_status ?? '—'}
          </span>
        </span>
        {attempt.execution_time_ms != null && (
          <span className="text-[10px] font-mono text-text-dim flex items-center gap-1">
            <Clock size={10} /> {attempt.execution_time_ms}ms
          </span>
        )}
        {attempt.hallucinated_symbol_count != null && attempt.hallucinated_symbol_count > 0 && (
          <span className="text-[10px] font-mono text-accent-amber">
            {attempt.hallucinated_symbol_count} halluc.
          </span>
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-2 bg-bg-card space-y-3">
          <div className="grid grid-cols-2 gap-3 text-xs">
            {[
              ['Prompt Length', attempt.prompt_length_chars ? `${attempt.prompt_length_chars.toLocaleString()} chars` : null],
              ['Response Length', attempt.llm_response_length_chars ? `${attempt.llm_response_length_chars.toLocaleString()} chars` : null],
              ['Fuzzer Seed', attempt.fuzzer_seed],
              ['Feedback Present', attempt.feedback_present !== undefined ? String(attempt.feedback_present) : null],
              ['Crash Type', attempt.crash_type],
              ['Hallucinated Symbols', attempt.hallucinated_symbols?.length ? attempt.hallucinated_symbols.join(', ') : null],
            ].map(([label, value]) =>
              value != null ? (
                <div key={String(label)} className="flex flex-col gap-0.5">
                  <span className="text-text-muted uppercase tracking-wider text-[10px]">{String(label)}</span>
                  <span className="font-mono text-text-secondary">{String(value)}</span>
                </div>
              ) : null
            )}
          </div>
          {attempt.crash_type && (
            <CodeViewer code={attempt.crash_type} label="Crash Type" maxHeight="80px" />
          )}
          {attempt.compiler_error && (
            <CodeViewer code={attempt.compiler_error} label="Compiler Error" />
          )}
          {attempt.sanitizer_output && (
            <CodeViewer code={attempt.sanitizer_output} label="Sanitizer Output" />
          )}
        </div>
      )}
    </div>
  );
}

export default function CveDetailTabs({ cve }: CveDetailTabsProps) {
  const [tab, setTab] = useState<TabId>('metadata');
  const attempts = cve.attempts ?? [];
  const successAttempt = cve.first_success_attempt;

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div className="flex gap-1 border-b border-bg-border">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-4 py-2.5 text-xs font-medium transition-colors border-b-2 -mb-px ${
              tab === id
                ? 'text-accent-blue border-accent-blue'
                : 'text-text-muted border-transparent hover:text-text-secondary'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'metadata' && (
        <div className="grid grid-cols-2 gap-3 text-xs">
          {[
            ['CVE ID', cve.cve],
            ['Vulnerability Class', fmtVulnClass(cve.vuln_class)],
            ['Sanitizer', cve.sanitizer],
            ['PoC Bucket', cve.bucket],
            ['Result', cve.result],
            ['Total Attempts', cve.total_attempts],
            ['First Success Attempt', cve.first_success_attempt],
            ['Max Attempts Allowed', cve.max_attempts_allowed],
            ['Has Hallucinations', cve.has_hallucinations !== undefined ? String(cve.has_hallucinations) : null],
            ['Fuzzer Binary', cve.fuzzer_binary],
            ['Docker Image', cve.docker_image],
            ['Run Start', cve.run_timestamp ? new Date(cve.run_timestamp).toLocaleString() : null],
            ['Run End', cve.run_end_timestamp ? new Date(cve.run_end_timestamp).toLocaleString() : null],
          ].map(([label, value]) =>
            value != null ? (
              <div key={String(label)} className="bg-bg-card border border-bg-border rounded-lg p-3 flex flex-col gap-1">
                <span className="text-text-muted uppercase tracking-wider text-[10px]">{String(label)}</span>
                <span className={`font-mono text-sm ${label === 'Result' ? resultColor(String(value)) : 'text-text-primary'}`}>
                  {String(value)}
                </span>
              </div>
            ) : null
          )}
        </div>
      )}

      {tab === 'attempts' && (
        <div className="space-y-2">
          {attempts.length === 0 ? (
            <EmptyState title="No attempt data" message="Attempt history not available for this CVE." />
          ) : (
            attempts.map((a) => (
              <AttemptRow
                key={a.attempt}
                attempt={a}
                isSuccess={a.attempt === successAttempt}
              />
            ))
          )}
        </div>
      )}

      {tab === 'feedback' && (
        <div className="space-y-4">
          {attempts.some((a) => a.compiler_error || a.sanitizer_output || a.crash_type) ? (
            attempts
              .filter((a) => a.compiler_error || a.sanitizer_output || a.crash_type)
              .map((a) => (
                <div key={a.attempt} className="space-y-2">
                  <div className="text-xs font-mono text-text-muted">Attempt #{a.attempt}</div>
                  {a.compiler_error && <CodeViewer code={a.compiler_error} label="Compiler Error" />}
                  {a.sanitizer_output && <CodeViewer code={a.sanitizer_output} label="Sanitizer Output" />}
                  {a.crash_type && <CodeViewer code={a.crash_type} label="Crash Type" maxHeight="80px" />}
                </div>
              ))
          ) : (
            <EmptyState
              title="No compiler/sanitizer data"
              message="Detailed compiler and sanitizer outputs are not yet available for this CVE."
              icon={<AlertCircle size={20} />}
            />
          )}
        </div>
      )}

      {tab === 'transcript' && (
        <div className="space-y-4">
          {attempts.some((a) => a.transcript) ? (
            attempts
              .filter((a) => a.transcript)
              .map((a) => (
                <CodeViewer key={a.attempt} code={a.transcript} label={`Attempt #${a.attempt} — Transcript`} maxHeight="400px" />
              ))
          ) : (
            <EmptyState title="Transcript not uploaded" message="LLM transcripts have not been attached to this CVE entry yet." />
          )}
        </div>
      )}

      {tab === 'raw' && <RawJsonViewer data={cve} label="Raw CVE JSON" />}
    </div>
  );
}
