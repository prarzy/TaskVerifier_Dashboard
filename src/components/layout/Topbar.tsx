import { useLocation } from 'react-router-dom';
import { Activity } from 'lucide-react';

const PAGE_TITLES: Record<string, string> = {
  '/': 'Overview',
  '/cve-explorer': 'CVE Explorer',
  '/analysis': 'Analysis',
  '/models': 'Models',
  '/about': 'About',
};

function getTitle(pathname: string): string {
  if (pathname.startsWith('/cve-explorer/')) return 'CVE Detail';
  return PAGE_TITLES[pathname] ?? 'TaskVerifier';
}

export default function Topbar() {
  const { pathname } = useLocation();
  const title = getTitle(pathname);

  return (
    <header className="h-14 bg-bg-secondary border-b border-bg-border flex items-center justify-between px-6 flex-shrink-0">
      <h1 className="text-sm font-medium text-text-primary">{title}</h1>
      <div className="flex items-center gap-2 text-xs text-text-muted font-mono">
        <Activity size={13} className="text-accent-green" />
        <span>Experiments Active</span>
        <span className="text-text-dim">·</span>
        <span className="text-text-dim">v0.1.0-alpha</span>
      </div>
    </header>
  );
}