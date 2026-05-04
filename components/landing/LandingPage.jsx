import Link from 'next/link';
import { Zap, Brain, MessageSquare, Shield, ArrowRight, ChevronDown, Sparkles, CreditCard, PieChart, Clock } from 'lucide-react';
import Navbar from './Navbar';
import HeroDemo from './HeroDemo';

const FEATURES = [
  { icon: Brain,        title: 'Gemini AI Parsing',    description: 'Describe any transaction naturally. Gemini AI extracts amount, type, category, merchant and date instantly.',              color: '#22d3ee' },
  { icon: MessageSquare,title: 'Chat-Style Logging',   description: "Log income and expenses in a conversation — no forms, no friction. Just describe it and you're done.",                    color: '#2dd4bf' },
  { icon: PieChart,     title: 'Smart Analytics',      description: 'ECharts-powered visualizations — donut charts, bar graphs, income vs expense trends at a glance.',                        color: '#34d399' },
  { icon: Clock,        title: 'Natural Date Parsing', description: '"Last night", "yesterday", "last Monday" — Spendly understands when your transaction happened.',                          color: '#a78bfa' },
  { icon: CreditCard,   title: 'Income & Expense',     description: 'Track both incoming and outgoing money. See your real balance, not just what you spent.',                                  color: '#fb923c' },
  { icon: Shield,       title: 'Secure & Private',     description: 'Firebase-backed with per-user isolation. Your financial data stays completely private.',                                   color: '#f472b6' },
];

const STATS = [
  { value: '< 1s',  label: 'AI Parse Time' },
  { value: '8+',    label: 'Smart Categories' },
  { value: '100%',  label: 'Natural Language' },
  { value: '∞',     label: 'Transaction History' },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Type or speak naturally',       description: '"Received salary 85000" or "Grabbed biryani for 650 last night" — Spendly understands every variation.', color: '#22d3ee' },
  { step: '02', title: 'Gemini AI extracts everything', description: 'Transaction type, amount, category, merchant, payment method, and date are parsed instantly.',            color: '#2dd4bf' },
  { step: '03', title: 'Dashboard updates instantly',   description: 'Your balance, income, expenses, charts and transaction history update in real-time.',                     color: '#34d399' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">

      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[130px]"    style={{ background: 'rgba(34,211,238,0.06)' }} />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full blur-[100px]" style={{ background: 'rgba(45,212,191,0.05)' }} />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full blur-[80px]" style={{ background: 'rgba(167,139,250,0.04)' }} />
        <div className="grid-bg absolute inset-0" />
      </div>

      {/* ── Navbar (server) ── */}
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-20">
        <div
          className="inline-flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-full mb-8 animate-fade-in border"
          style={{ background: 'rgba(34,211,238,0.08)', borderColor: 'rgba(34,211,238,0.2)', color: '#22d3ee' }}
        >
          <Sparkles size={12} />
          Gemini AI • Income &amp; Expense • Real-time Analytics
        </div>

        <h1 className="font-syne font-bold text-5xl md:text-7xl lg:text-8xl tracking-tighter mb-6 max-w-5xl animate-slide-up">
          Your money,
          <br />
          <span
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: 'linear-gradient(135deg, #22d3ee, #2dd4bf, #34d399)' }}
          >
            fully understood.
          </span>
        </h1>

        <p
          className="text-[var(--text-secondary)] text-lg md:text-xl max-w-2xl leading-relaxed mb-10 animate-fade-in"
          style={{ animationDelay: '0.2s' }}
        >
          Track income and expenses by just describing them. Spendly&apos;s AI parses everything
          automatically — amount, type, category, merchant and date.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Link href="/signup" className="btn-primary rounded-2xl px-8 py-4 text-base font-syne font-700 flex items-center gap-2 group">
            Start Tracking Free
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/login" className="btn-ghost rounded-2xl px-8 py-4 text-base font-semibold">
            Sign In
          </Link>
        </div>

        {/* Social proof */}
        <div className="flex items-center gap-2 mt-8 text-[var(--text-muted)] text-sm">
          <div className="flex -space-x-2">
            {['#22d3ee', '#34d399', '#a78bfa', '#fb923c'].map((color, i) => (
              <div key={i} className="w-7 h-7 rounded-full border-2" style={{ backgroundColor: color + '30', borderColor: color + '60' }} />
            ))}
          </div>
          <span>Join thousands tracking smarter</span>
        </div>

        {/* ── HeroDemo (client island) ── */}
        <div className="mt-20 w-full max-w-lg animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <HeroDemo />
        </div>

        <Link
          href="#features"
          className="mt-12 flex flex-col items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
        >
          <span className="text-xs font-mono">Explore Features</span>
          <ChevronDown size={16} className="animate-bounce" />
        </Link>
      </section>

      {/* ── Stats bar ── */}
      <section className="relative z-10 border-y border-[var(--border-subtle)] glass">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-[var(--border-subtle)]">
          {STATS.map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center py-8 px-6">
              <span className="font-syne font-800 text-3xl mb-1" style={{ color: '#22d3ee' }}>{value}</span>
              <span className="text-xs text-[var(--text-muted)] text-center">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="relative z-10 px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: '#22d3ee' }}>Features</p>
            <h2 className="font-syne font-800 text-4xl md:text-5xl tracking-tight text-[var(--text-primary)] mb-4">
              Everything you need to<br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg,#22d3ee,#34d399)' }}>
                track smarter
              </span>
            </h2>
            <p className="text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed">
              Built for people who hate expense forms. Just describe it naturally, and Spendly handles the rest.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, description, color }) => (
              <div key={title} className="group card p-6 hover:border-[var(--border-glow)] transition-all duration-300 hover:-translate-y-1">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ background: color + '15', border: `1px solid ${color}25` }}
                >
                  <Icon size={20} style={{ color }} />
                </div>
                <h3 className="font-syne font-700 text-base text-[var(--text-primary)] mb-2">{title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="relative z-10 px-6 py-24 border-t border-[var(--border-subtle)]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: '#2dd4bf' }}>How it Works</p>
            <h2 className="font-syne font-800 text-4xl md:text-5xl tracking-tight text-[var(--text-primary)]">
              Three steps to zero friction
            </h2>
          </div>

          <div className="space-y-5">
            {HOW_IT_WORKS.map(({ step, title, description, color }) => (
              <div key={step} className="flex gap-6 card p-6 hover:border-[var(--border-glow)] hover:-translate-x-1 transition-all">
                <div className="flex-shrink-0">
                  <span className="font-syne font-800 text-3xl" style={{ color, opacity: 0.5 }}>{step}</span>
                </div>
                <div>
                  <h3 className="font-syne font-700 text-lg text-[var(--text-primary)] mb-2">{title}</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 px-6 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="card p-12 rounded-3xl"
            style={{ borderColor: 'rgba(34,211,238,0.2)', boxShadow: '0 0 60px rgba(34,211,238,0.06)' }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse-glow"
              style={{ background: 'linear-gradient(135deg,#22d3ee,#0891b2)' }}
            >
              <Zap size={24} className="text-slate-950 fill-current" />
            </div>
            <h2 className="font-syne font-800 text-4xl md:text-5xl tracking-tight text-[var(--text-primary)] mb-4">
              Start tracking today
            </h2>
            <p className="text-[var(--text-secondary)] mb-8 text-lg leading-relaxed">
              No credit card required. Free forever for personal use.
            </p>
            <Link href="/signup" className="btn-primary inline-flex items-center gap-2 rounded-2xl px-10 py-4 text-base font-syne font-700 group">
              Create Free Account
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-[var(--border-subtle)] px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href={`/`} className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#22d3ee,#0891b2)' }}>
              <Zap size={12} className="text-slate-950 fill-current" />
            </div>
            <span className="font-syne font-700 text-sm text-[var(--text-primary)]">Spendly</span>
          </Link>
          <p className="text-xs text-[var(--text-muted)]">© 2025 Spendly. AI-powered finance tracking.</p>
          <div className="flex gap-4 text-xs text-[var(--text-muted)]">
            <Link href="#" className="hover:text-[var(--text-secondary)] transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-[var(--text-secondary)] transition-colors">Terms</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
