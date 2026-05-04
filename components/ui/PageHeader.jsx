'use client';

import { Menu } from 'lucide-react';

export default function PageHeader({ onMenuClick, title, subtitle, children }) {
  return (
    <header
      className="sticky top-0 z-20 border-b border-[var(--border-subtle)] px-6 py-4 flex items-center justify-between"
      style={{ background: 'var(--bg-secondary)', backdropFilter: 'blur(20px)' }}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 rounded-xl border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)]"
          style={{ background: 'var(--bg-glass)' }}
        >
          <Menu size={18} />
        </button>
        <div>
          <h1 className="font-syne font-700 text-lg text-[var(--text-primary)] leading-tight">{title}</h1>
          {subtitle && <p className="text-xs text-[var(--text-muted)]">{subtitle}</p>}
        </div>
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </header>
  );
}
