import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  BarChart3,
  Cpu,
  Info,
  Shield,
  ChevronRight,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, exact: true },
  { to: '/cve-explorer', label: 'CVE Explorer', icon: Search },
  { to: '/analysis', label: 'Analysis', icon: BarChart3 },
  { to: '/models', label: 'Models', icon: Cpu },
  { to: '/about', label: 'About', icon: Info },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-60 flex-shrink-0 bg-bg-secondary border-r border-bg-border flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-bg-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center flex-shrink-0">
            <Shield size={16} className="text-white" />
          </div>
          <div>
            <div className="font-semibold text-sm text-text-primary tracking-wide">TaskVerifier</div>
            <div className="text-[10px] text-text-muted font-mono uppercase tracking-widest">Research Dashboard</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ to, label, icon: Icon, exact }) => {
          const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-bg-hover text-text-primary border border-bg-border'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
              }`}
            >
              <Icon
                size={16}
                className={isActive ? 'text-accent-blue' : 'text-text-muted group-hover:text-text-secondary'}
              />
              <span className="flex-1">{label}</span>
              {isActive && <ChevronRight size={12} className="text-accent-blue opacity-60" />}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-bg-border">
        <div className="text-[10px] text-text-muted font-mono">
          <div className="text-text-dim">Benchmark</div>
          <div className="text-text-secondary">CyberGym · ARVO</div>
        </div>
      </div>
    </aside>
  );
}