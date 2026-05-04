'use client';

import { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatCurrency, formatDate, CATEGORY_META } from '../../lib/utils/expenseParser';
import { useExpenses } from '../../lib/hooks/useExpenses';
import TransactionRow from '../ui/TransactionRow';
import EmptyState from '../ui/EmptyState';
import PageHeader from '../ui/PageHeader';
import FilterChip from '../ui/FilterChip';

const CATS = ['all', 'food', 'transport', 'shopping', 'bills', 'health', 'entertainment', 'income', 'other'];
const TYPES = [
  { val: 'all', label: 'All' },
  { val: 'incoming', label: '↓ Income' },
  { val: 'outgoing', label: '↑ Expense' },
];

export default function TransactionList({ onMenuClick }) {
  const { expenses, loading, removeExpense } = useExpenses();
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [deleting, setDeleting] = useState(null);

  const filtered = expenses.filter(e => {
    const matchCat = filterCat === 'all' || e.category === filterCat;
    const matchType = filterType === 'all' || e.type === filterType;
    const q = search.toLowerCase();
    const matchSearch = !q
      || (e.merchant || '').toLowerCase().includes(q)
      || (e.description || '').toLowerCase().includes(q)
      || String(e.amount).includes(q);
    return matchCat && matchType && matchSearch;
  });

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await removeExpense(id);
      toast.success('Transaction deleted');
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(null);
    }
  };

  const grouped = filtered.reduce((acc, exp) => {
    const key = formatDate(exp.date);
    if (!acc[key]) acc[key] = [];
    acc[key].push(exp);
    return acc;
  }, {});

  const totalIncoming = filtered.filter(e => e.type === 'incoming').reduce((s, e) => s + e.amount, 0);
  const totalOutgoing = filtered.filter(e => e.type !== 'incoming').reduce((s, e) => s + e.amount, 0);

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader onMenuClick={onMenuClick} title="Transactions" subtitle={`${filtered.length} records`}>
        {/* Summary pills */}
        <span className="hidden sm:flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-mono"
          style={{ background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)' }}>
          <ArrowDownLeft size={11} /> {formatCurrency(totalIncoming)}
        </span>
        <span className="hidden sm:flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-mono"
          style={{ background: 'rgba(251,113,133,0.1)', color: '#fb7185', border: '1px solid rgba(251,113,133,0.2)' }}>
          <ArrowUpRight size={11} /> {formatCurrency(totalOutgoing)}
        </span>
      </PageHeader>

      {/* Filters */}
      <div className="px-6 pt-4 pb-2 border-b border-[var(--border-subtle)] space-y-3" style={{ background: 'var(--bg-secondary)' }}>
        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search by merchant, amount..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>

        {/* Type filter */}
        <div className="flex gap-2">
          {TYPES.map(t => (
            <FilterChip key={t.val} label={t.label} active={filterType === t.val} onClick={() => setFilterType(t.val)} />
          ))}
        </div>

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {CATS.map(cat => {
            const meta = CATEGORY_META[cat];
            const CatIcon = meta?.icon;
            return (
              <FilterChip
                key={cat}
                label={cat === 'all' ? 'All' : meta?.label || cat}
                icon={CatIcon}
                active={filterCat === cat}
                onClick={() => setFilterCat(cat)}
              />
            );
          })}
        </div>
      </div>

      <div className="flex-1 px-6 py-5">
        {loading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 rounded-xl shimmer-bg" style={{ background: 'var(--bg-glass)' }} />
            ))}
          </div>
        ) : Object.keys(grouped).length === 0 ? (
          <EmptyState
            emoji="🔍"
            message={search || filterCat !== 'all' || filterType !== 'all' ? 'No matching transactions' : 'No transactions yet'}
          />
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([date, items]) => {
              const dayIncome = items.filter(e => e.type === 'incoming').reduce((s, e) => s + e.amount, 0);
              const dayExpense = items.filter(e => e.type !== 'incoming').reduce((s, e) => s + e.amount, 0);
              return (
                <div key={date}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-syne font-700 text-[var(--text-muted)] uppercase tracking-widest">{date}</span>
                    <div className="flex-1 h-px bg-[var(--border-subtle)]" />
                    <div className="flex items-center gap-2">
                      {dayIncome > 0 && <span className="text-xs font-mono" style={{ color: '#34d399' }}>+{formatCurrency(dayIncome)}</span>}
                      {dayExpense > 0 && <span className="text-xs font-mono" style={{ color: '#fb7185' }}>-{formatCurrency(dayExpense)}</span>}
                    </div>
                  </div>
                  <div className="card overflow-hidden divide-y divide-[var(--border-subtle)]">
                    {items.map(expense => (
                      <TransactionRow
                        key={expense.id}
                        expense={expense}
                        onDelete={handleDelete}
                        deleting={deleting}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
