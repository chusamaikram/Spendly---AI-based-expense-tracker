import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { CATEGORY_META, formatCurrency, formatDate } from '../../lib/utils/expenseParser';

export default function TransactionRow({ expense, onDelete, deleting }) {
  const meta        = CATEGORY_META[expense.category] || CATEGORY_META.other;
  const isIncoming  = expense.type === 'incoming';
  const accentColor = isIncoming ? '#34d399' : '#fb7185';
  const CatIcon     = meta.icon;

  return (
    <div className="flex items-center gap-3 px-4 py-3.5 hover:bg-[var(--bg-glass)] transition-colors group">
      {/* Category icon */}
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${meta.bgClass}`}
      >
        <CatIcon size={16} />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--text-primary)] truncate">
          {expense.merchant || expense.description || 'Transaction'}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-xs capitalize ${meta.textClass}`}>{meta.label}</span>
          <span className="text-[var(--text-muted)] text-xs">·</span>
          <span className="text-xs text-[var(--text-muted)]">{formatDate(expense.date)}</span>
          <span className="text-[var(--text-muted)] text-xs">·</span>
          <span className="text-xs text-[var(--text-muted)] capitalize">{expense.paymentMethod || 'cash'}</span>
        </div>
      </div>

      {/* Amount + delete */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end gap-0.5">
          <span className="font-syne font-700 text-sm" style={{ color: accentColor }}>
            {isIncoming ? '+' : '-'}{formatCurrency(expense.amount)}
          </span>
          <span className="text-xs flex items-center gap-0.5" style={{ color: accentColor, opacity: 0.7 }}>
            {isIncoming ? <ArrowDownLeft size={10} /> : <ArrowUpRight size={10} />}
            {isIncoming ? 'income' : 'expense'}
          </span>
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(expense.id)}
            disabled={deleting === expense.id}
            className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg flex items-center justify-center transition-all disabled:opacity-50"
            style={{ background: 'rgba(251,113,133,0.1)', color: '#fb7185' }}
          >
            {deleting === expense.id
              ? <div className="w-3 h-3 border border-rose-400/40 border-t-rose-400 rounded-full animate-spin" />
              : <ArrowUpRight size={13} style={{ transform: 'rotate(45deg)' }} />}
          </button>
        )}
      </div>
    </div>
  );
}
