import { ArrowDownLeft, ArrowUpRight, Wallet, Plus, Sparkles } from 'lucide-react';
import { formatCurrency } from '../../lib/utils/expenseParser';
import { useExpenses } from '../../lib/hooks/useExpenses';
import { useAuth } from '../../lib/hooks/useAuth';
import CategoryDonut from './CategoryDonut';
import SpendingBar from './SpendingBar';
import TransactionRow from '../ui/TransactionRow';
import EmptyState from '../ui/EmptyState';
import PageHeader from '../ui/PageHeader';
import Button from '../ui/Button';
import Skeleton from '../ui/Skeleton';

export default function DashboardOverview({ onManualAdd, onMenuClick }) {
  const { expenses, loading, stats } = useExpenses();
  const { user } = useAuth();
  const { totalIncome, totalExpense, balance, monthIncome, monthExpense, categoryTotals, monthlyTrend } = stats;
  const firstName = user?.displayName?.split(' ')[0] || 'there';

  const STAT_CARDS = [
    {
      label: 'Net Balance',
      value: formatCurrency(balance),
      sub: 'Total income minus expenses',
      icon: Wallet,
      color: balance >= 0 ? '#22d3ee' : '#fb7185',
      bg: balance >= 0 ? 'rgba(34,211,238,0.08)' : 'rgba(251,113,133,0.08)',
      border: balance >= 0 ? 'rgba(34,211,238,0.2)' : 'rgba(251,113,133,0.2)',
    },
    {
      label: 'Total Income',
      value: formatCurrency(totalIncome),
      sub: `This month: ${formatCurrency(monthIncome)}`,
      icon: ArrowDownLeft,
      color: '#34d399',
      bg: 'rgba(52,211,153,0.08)',
      border: 'rgba(52,211,153,0.2)',
    },
    {
      label: 'Total Expenses',
      value: formatCurrency(totalExpense),
      sub: `This month: ${formatCurrency(monthExpense)}`,
      icon: ArrowUpRight,
      color: '#fb7185',
      bg: 'rgba(251,113,133,0.08)',
      border: 'rgba(251,113,133,0.2)',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        onMenuClick={onMenuClick}
        title={`Hey, ${firstName} 👋`}
        subtitle={new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      >
        <Button variant="ghost" icon={Plus} onClick={onManualAdd}>
          <span className="hidden sm:inline">Add</span>
        </Button>
      </PageHeader>

      <div className="flex-1 px-6 py-6 space-y-6">

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {loading
            ? [...Array(3)].map((_, i) => (
                <div key={i} className="rounded-2xl p-5 space-y-3" style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)' }}>
                  <Skeleton className="w-9 h-9" />
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              ))
            : STAT_CARDS.map(({ label, value, sub, icon: Icon, color, bg, border }) => (
                <div key={label} className="rounded-2xl p-5 transition-all hover:-translate-y-0.5"
                  style={{ background: bg, border: `1px solid ${border}` }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: color + '20', border: `1px solid ${color}30` }}>
                      <Icon size={17} style={{ color }} />
                    </div>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mb-1">{label}</p>
                  <p className="font-syne font-700 text-xl mb-1" style={{ color }}>{value}</p>
                  <p className="text-xs text-[var(--text-muted)]">{sub}</p>
                </div>
              ))
          }
        </div>

        {/* ── Charts ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Bar chart */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-syne font-700 text-sm text-[var(--text-primary)]">Monthly Overview</h2>
              <span className="text-xs text-[var(--text-muted)] font-mono">Last 6 months</span>
            </div>
            {loading ? (
              <div className="flex items-end gap-3 h-44 pt-4">
                {[60, 85, 45, 90, 55, 75].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 justify-end">
                    <Skeleton style={{ height: `${h}%`, width: '100%', borderRadius: '6px 6px 0 0' }} />
                    <Skeleton className="h-2 w-6" />
                  </div>
                ))}
              </div>
            ) : monthlyTrend.length === 0 ? (
              <EmptyState message="No data yet" />
            ) : (
              <SpendingBar data={monthlyTrend} />
            )}
          </div>

          {/* Donut chart */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-syne font-700 text-sm text-[var(--text-primary)]">By Category</h2>
              <span className="text-xs text-[var(--text-muted)] font-mono">Expenses only</span>
            </div>
            {loading ? (
              <div className="flex items-center gap-5">
                {/* Donut placeholder */}
                <div className="flex-shrink-0 relative w-[120px] h-[120px]">
                  <Skeleton className="w-full h-full rounded-full" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full" style={{ background: 'var(--bg-card)' }} />
                  </div>
                </div>
                {/* Legend placeholder */}
                <div className="flex-1 space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Skeleton className="w-2 h-2 rounded-full flex-shrink-0" />
                      <Skeleton className="h-3 flex-1" />
                      <Skeleton className="h-3 w-16 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            ) : categoryTotals.length === 0 ? (
              <EmptyState message="No categories yet" />
            ) : (
              <CategoryDonut data={categoryTotals} />
            )}
          </div>
        </div>

        {/* ── Recent transactions ── */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-syne font-700 text-sm text-[var(--text-primary)]">Recent Transactions</h2>
            {!loading && (
              <span className="text-xs text-[var(--text-muted)] font-mono">
                {Math.min(expenses.length, 6)} of {expenses.length}
              </span>
            )}
          </div>
          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-1 py-2">
                  <Skeleton className="w-9 h-9 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-2.5 w-1/2" />
                  </div>
                  <div className="space-y-2 items-end flex flex-col">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-2.5 w-12" />
                  </div>
                </div>
              ))}
            </div>
          ) : expenses.length === 0 ? (
            <EmptyState
              message="No transactions yet. Add one with AI Logger!"
              action={{ label: 'Open AI Logger', onClick: onManualAdd }}
            />
          ) : (
            <div className="divide-y divide-[var(--border-subtle)]">
              {expenses.slice(0, 6).map(e => <TransactionRow key={e.id} expense={e} />)}
            </div>
          )}
        </div>

        {/* ── AI Banner ── */}
        <div
          className="rounded-2xl p-5 border flex items-center justify-between gap-4 cursor-pointer hover:-translate-y-0.5 transition-transform"
          style={{ background: 'rgba(34,211,238,0.04)', borderColor: 'rgba(34,211,238,0.15)' }}
          onClick={onManualAdd}
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(34,211,238,0.12)' }}>
              <Sparkles size={18} style={{ color: '#22d3ee' }} />
            </div>
            <div>
              <p className="font-syne font-700 text-sm text-[var(--text-primary)]">Gemini AI Logger</p>
              <p className="text-xs text-[var(--text-muted)]">Describe any transaction — AI parses and saves it instantly</p>
            </div>
          </div>
          <div className="text-xs font-mono px-3 py-1.5 rounded-lg flex-shrink-0"
            style={{ color: '#22d3ee', background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)' }}>
            Try it →
          </div>
        </div>

      </div>
    </div>
  );
}
