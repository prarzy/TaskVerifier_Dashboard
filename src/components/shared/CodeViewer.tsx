import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeViewerProps {
  code?: string | null;
  label?: string;
  maxHeight?: string;
}

export default function CodeViewer({ code, label, maxHeight = '300px' }: CodeViewerProps) {
  const [copied, setCopied] = useState(false);

  if (!code) {
    return (
      <div className="rounded-lg border border-bg-border bg-bg-card p-4 text-xs text-text-muted font-mono">
        No output available.
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="rounded-lg border border-bg-border bg-bg-card overflow-hidden">
      {label && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-bg-border bg-bg-secondary">
          <span className="text-xs font-mono text-text-muted uppercase tracking-wider">{label}</span>
          <button
            onClick={handleCopy}
            className="text-xs text-text-muted hover:text-text-primary flex items-center gap-1 transition-colors"
          >
            {copied ? <Check size={12} className="text-accent-green" /> : <Copy size={12} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      )}
      <pre
        className="p-4 text-xs font-mono text-text-secondary overflow-auto leading-relaxed"
        style={{ maxHeight }}
      >
        {code}
      </pre>
    </div>
  );
}
