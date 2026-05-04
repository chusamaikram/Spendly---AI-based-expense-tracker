'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, LayoutDashboard, List, LogOut, X, Sun, Moon, Plus, Users, Bot } from 'lucide-react';
import { logOut } from '../../lib/firebase/auth';
import { useTheme } from '../../lib/hooks/useTheme';

const NAV = [
  { id: 'overview',     label: 'Overview',     icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: List },
  { id: 'khata',        label: 'Khata',        icon: Users },
];

export default function Sidebar({ activeTab, setActiveTab, user, isOpen, onClose, onManualAdd, onOpenChat }) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => { await logOut(); router.push('/'); };

  const initials = user?.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 z-30 flex flex-col transition-transform duration-300 border-r border-[var(--border-subtle)] ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      style={{ background: 'var(--bg-secondary)' }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-[var(--border-subtle)]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#22d3ee,#0891b2)' }}>
            <Zap size={15} className="text-slate-950 fill-current" />
          </div>
          <span className="font-syne font-800 text-lg text-[var(--text-primary)]">Spendly</span>
        </Link>
        <button onClick={onClose} className="lg:hidden text-[var(--text-muted)] hover:text-[var(--text-primary)]">
          <X size={18} />
        </button>
      </div>

      {/* Quick add + AI button row */}
      <div className="px-3 pt-4 flex gap-2">
        <button
          onClick={() => { onManualAdd(); onClose(); }}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-syne font-700 transition-all"
          style={{ background: 'rgba(34,211,238,0.1)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.2)' }}
        >
          <Plus size={15} />
          Add
        </button>
        <button
          onClick={() => { onOpenChat(); onClose(); }}
          className="w-11 h-10 flex items-center justify-center rounded-xl transition-all flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#22d3ee,#0891b2)', boxShadow: '0 0 12px rgba(34,211,238,0.3)' }}
          title="AI Logger"
        >
          <Bot size={17} className="text-slate-950" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-1">
        {NAV.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => { setActiveTab(id); onClose(); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
              style={active
                ? { background: 'rgba(34,211,238,0.1)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.2)' }
                : { color: 'var(--text-secondary)', border: '1px solid transparent' }}
            >
              <Icon size={17} />
              {label}
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: '#22d3ee' }} />}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 space-y-2 border-t border-[var(--border-subtle)] pt-4">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)] transition-all"
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>

        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--border-subtle)]" style={{ background: 'var(--bg-glass)' }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,rgba(34,211,238,0.3),rgba(45,212,191,0.3))' }}>
            <span className="text-xs font-syne font-700 text-[var(--text-primary)]">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{user?.displayName || 'User'}</p>
            <p className="text-xs text-[var(--text-muted)] truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-[var(--text-secondary)] hover:text-rose-400 hover:bg-rose-500/10 transition-all"
        >
          <LogOut size={17} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
