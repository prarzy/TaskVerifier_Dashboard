import { useAppData } from '../hooks/useAppData';
import EmptyState from '../components/shared/EmptyState';
import type { TimelineEvent } from '../types';
import { Clock, Rocket, Code, Cpu, RefreshCw, CheckCircle, Calendar, Monitor } from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  rocket: Rocket,
  code: Code,
  cpu: Cpu,
  refresh: RefreshCw,
  check: CheckCircle,
  calendar: Calendar,
  monitor: Monitor,
  clock: Clock,
};

const CATEGORY_COLORS: Record<string, string> = {
  milestone: 'border-accent-blue bg-accent-blue/10 text-accent-blue',
  development: 'border-accent-purple bg-accent-purple/10 text-accent-purple',
  improvement: 'border-accent-cyan bg-accent-cyan/10 text-accent-cyan',
  experiment: 'border-accent-green bg-accent-green/10 text-accent-green',
  planned: 'border-text-muted bg-bg-hover text-text-muted',
};

const CATEGORY_LABELS: Record<string, string> = {
  milestone: 'Milestone',
  development: 'Development',
  improvement: 'Improvement',
  experiment: 'Experiment',
  planned: 'Planned',
};

function TimelineItem({ event, isLast }: { event: TimelineEvent; isLast: boolean }) {
  const IconComp = ICON_MAP[event.icon ?? ''] ?? Clock;
  const colorClass = CATEGORY_COLORS[event.category ?? ''] ?? CATEGORY_COLORS.milestone;

  return (
    <div className="flex gap-4">
      {/* Timeline line */}
      <div className="flex flex-col items-center w-8 flex-shrink-0">
        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${colorClass}`}>
          <IconComp size={14} />
        </div>
        {!isLast && <div className="w-px flex-1 bg-bg-border mt-1" />}
      </div>

      {/* Content */}
      <div className="pb-8 flex-1 min-w-0">
        <div className="flex items-start gap-3 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-semibold text-text-primary">{event.title ?? 'Untitled'}</h3>
              {event.category && (
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${colorClass}`}>
                  {CATEGORY_LABELS[event.category] ?? event.category}
                </span>
              )}
            </div>
            {event.date && (
              <div className="text-[10px] font-mono text-text-dim mt-0.5">{event.date}</div>
            )}
            {event.description && (
              <p className="text-xs text-text-muted mt-2 leading-relaxed">{event.description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TimelinePage() {
  const { timeline, loading } = useAppData();
  const events = timeline?.events ?? [];

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-text-muted text-sm">Loading…</div>;
  }

  return (
    <div className="p-8 space-y-6 max-w-3xl mx-auto">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-text-primary">Timeline</h2>
        <p className="text-sm text-text-muted">Chronological project progress, experiments, and milestones.</p>
      </div>

      {events.length === 0 ? (
        <EmptyState title="No timeline data" message="Add events to public/data/timeline.json." icon={<Clock size={20} />} />
      ) : (
        <div className="pt-2">
          {events.map((event, i) => (
            <TimelineItem key={event.id} event={event} isLast={i === events.length - 1} />
          ))}
        </div>
      )}
    </div>
  );
}
