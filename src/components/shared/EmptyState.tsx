import { Database } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title = 'No data available',
  message = 'Data not available or experiments still in progress.',
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <div className="w-12 h-12 rounded-full bg-bg-hover border border-bg-border flex items-center justify-center text-text-muted">
        {icon ?? <Database size={20} />}
      </div>
      <div className="text-sm font-medium text-text-secondary">{title}</div>
      <div className="text-xs text-text-muted max-w-xs">{message}</div>
    </div>
  );
}
