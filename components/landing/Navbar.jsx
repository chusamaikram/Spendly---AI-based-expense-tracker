import Link from 'next/link';
import { Zap } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';

const NAV_LINKS = [
  {
    name: 'Home',
    href: '/',
  },
  {
    name: 'Features',
    href: '#features',
  },
  {
    name: 'How it Works',
    href: '#how-it-works',
  }]

export default function Navbar() {
  return (
    <nav className="sticky top-0 left-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 glass border-b border-[var(--border-subtle)]"
      style={{ background: 'var(--bg-secondary)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
    >
      <Link href={`/`} className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg,#22d3ee,#0891b2)' }}
        >
          <Zap size={16} className="text-slate-950 fill-current" />
        </div>
        <span className="font-syne font-800 text-xl tracking-tight text-[var(--text-primary)]">Spendly</span>
      </Link>

      <ul className="hidden md:flex items-center gap-8">
        {NAV_LINKS.map(item => (
          <li key={item.name}>
            <Link
              
              href={item.href}
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-medium"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Link
          href="/login"
          className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors px-4 py-2"
        >
          Sign In
        </Link>
        <Link
          href="/signup"
          className="btn-primary text-sm rounded-xl px-5 py-2.5 font-syne font-semibold"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}
