import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import CodeViewer from './CodeViewer';

interface RawJsonViewerProps {
  data: unknown;
  label?: string;
}

export default function RawJsonViewer({ data, label = 'Raw JSON' }: RawJsonViewerProps) {
  const [open, setOpen] = useState(false);

  if (data === undefined || data === null) return null;

  return (
    <div className="border border-bg-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-bg-secondary hover:bg-bg-hover transition-colors text-sm text-text-secondary"
      >
        <span className="font-mono text-xs uppercase tracking-widest">{label}</span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && (
        <CodeViewer
          code={JSON.stringify(data, null, 2)}
          maxHeight="500px"
        />
      )}
    </div>
  );
}
