'use client';

import Link from 'next/link';
import { ArrowLeft, Zap } from 'lucide-react';
import ThemeToggle from '../../components/ui/ThemeToggle';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] relative">

      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[130px]"
          style={{ background: 'rgba(34,211,238,0.05)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px]"
          style={{ background: 'rgba(129,140,248,0.04)' }} />
        <div className="grid-bg absolute inset-0" />
      </div>

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to home</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#22d3ee,#0891b2)' }}>
              <Zap size={13} className="text-slate-950 fill-current" />
            </div>
            <span className="font-syne font-700 text-sm text-[var(--text-primary)]">Spendly</span>
          </Link>
          <ThemeToggle />
        </div>
      </div>

      {/* Form content */}
      <div className="relative z-10 flex items-center justify-center px-4 py-8 min-h-[calc(100vh-72px)]">
        {children}
      </div>
    </div>
  );
}
