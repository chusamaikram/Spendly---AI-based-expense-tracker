import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { CATEGORY_META, formatCurrency } from '../../lib/utils/expenseParser';

export default function TransactionCard({ expense }) {
  const meta        = CATEGORY_META[expense.category] || CATEGORY_META.other;
  const isIncoming  = expense.type === 'incoming';
  const accentColor = isIncoming ? '#34d399' : '#fb7185';
  const date        = expense.date instanceof Date ? expense.date : new Date(expense.date || Date.now());
  const CatIcon     = meta.icon;

  return (
    <div className="border rounded-2xl overflow-hidden min-w-[240px]"
      style={{ background: 'var(--bg-card)', borderColor: `${accentColor}25` }}>
      <div className="px-4 pt-3 pb-2 border-b flex items-center gap-2"
        style={{ borderColor: `${accentColor}15` }}>
        <div className="w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: `${accentColor}20` }}>
          {isIncoming
            ? <ArrowDownLeft size={10} style={{ color: accentColor }} />
            : <ArrowUpRight size={10} style={{ color: accentColor }} />}
        </div>
        <span className="text-xs font-mono font-medium" style={{ color: accentColor }}>
          {isIncoming ? 'Income Logged ✓' : 'Expense Logged ✓'}
        </span>
      </div>
      <div className="px-4 py-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[var(--text-muted)]">Amount</span>
          <span className="font-syne font-700 text-base" style={{ color: accentColor }}>
            {isIncoming ? '+' : '-'}{formatCurrency(expense.amount)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-[var(--text-muted)]">Category</span>
          <span className={`text-xs px-2 py-0.5 rounded-lg font-medium border flex items-center gap-1 ${meta.bgClass} ${meta.textClass}`}>
            <CatIcon size={11} /> {meta.label}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-[var(--text-muted)]">Merchant</span>
          <span className="text-xs text-[var(--text-primary)] font-medium">{expense.merchant}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-[var(--text-muted)]">Date</span>
          <span className="text-xs text-[var(--text-primary)]">
            {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>
    </div>
  );
}
