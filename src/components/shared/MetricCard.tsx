import type { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: string | number | undefined | null;
  sub?: string;
  icon?: ReactNode;
  accent?: 'blue' | 'purple' | 'green' | 'red' | 'amber' | 'cyan';
  large?: boolean;
}

const ACCENT_CLASSES: Record<string, string> = {
  blue:   'border-accent-blue/20 bg-accent-blue/5',
  purple: 'border-accent-purple/20 bg-accent-purple/5',
  green:  'border-accent-green/20 bg-accent-green/5',
  red:    'border-accent-red/20 bg-accent-red/5',
  amber:  'border-accent-amber/20 bg-accent-amber/5',
  cyan:   'border-accent-cyan/20 bg-accent-cyan/5',
};

const VALUE_COLOR: Record<string, string> = {
  blue:   'text-accent-blue-glow',
  purple: 'text-accent-purple',
  green:  'text-accent-green',
  red:    'text-accent-red',
  amber:  'text-accent-amber',
  cyan:   'text-accent-cyan',
};

export default function MetricCard({ label, value, sub, icon, accent = 'blue', large = false }: MetricCardProps) {
  const border = ACCENT_CLASSES[accent] ?? ACCENT_CLASSES.blue;
  const valColor = VALUE_COLOR[accent] ?? VALUE_COLOR.blue;
  const displayValue = value === undefined || value === null ? '—' : String(value);

  return (
    <div className={`rounded-xl border p-5 flex flex-col gap-3 ${border}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-text-secondary uppercase tracking-widest">{label}</span>
        {icon && <span className="opacity-60">{icon}</span>}
      </div>
      <div className={`font-mono font-semibold ${large ? 'text-4xl' : 'text-2xl'} ${valColor} leading-none`}>
        {displayValue}
      </div>
      {sub && <div className="text-xs text-text-muted">{sub}</div>}
    </div>
  );
}
