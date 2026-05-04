'use client';

import { useState } from 'react';
import { Users, ArrowDownLeft, ArrowUpRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useExpenses } from '../../lib/hooks/useExpenses';
import { formatCurrency, formatDate } from '../../lib/utils/expenseParser';
import PageHeader from '../ui/PageHeader';
import EmptyState from '../ui/EmptyState';
import Skeleton from '../ui/Skeleton';

export default function KhataPage({ onMenuClick }) {
  const { stats, loading } = useExpenses();
  const { personLedger = [] } = stats;
  const [expanded, setExpanded] = useState(null);

  const toggle = (name) => setExpanded(prev => prev === name ? null : name);

  // Summary totals across all persons
  const totalGiven = personLedger.reduce((s, p) => s + p.given, 0);
  const totalTaken = personLedger.reduce((s, p) => s + p.taken, 0);

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader onMenuClick={onMenuClick} title="Khata" subtitle="Person-wise money tracker" />

      <div className="flex-1 px-6 py-6 space-y-6">

        {/* Summary cards */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="rounded-2xl p-5 space-y-3" style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)' }}>
                <Skeleton className="w-9 h-9" />
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-6 w-28" />
              </div>
            ))}
          </div>
        ) : personLedger.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl p-5" style={{ background: 'rgba(251,113,133,0.08)', border: '1px solid rgba(251,113,133,0.2)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                style={{ background: 'rgba(251,113,133,0.15)', border: '1px solid rgba(251,113,133,0.25)' }}>
                <ArrowUpRight size={17} style={{ color: '#fb7185' }} />
              </div>
              <p className="text-xs text-[var(--text-muted)] mb-1">Total Given</p>
              <p className="font-syne font-700 text-xl" style={{ color: '#fb7185' }}>{formatCurrency(totalGiven)}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">to {personLedger.length} {personLedger.length === 1 ? 'person' : 'people'}</p>
            </div>
            <div className="rounded-2xl p-5" style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.25)' }}>
                <ArrowDownLeft size={17} style={{ color: '#34d399' }} />
              </div>
              <p className="text-xs text-[var(--text-muted)] mb-1">Total Taken</p>
              <p className="font-syne font-700 text-xl" style={{ color: '#34d399' }}>{formatCurrency(totalTaken)}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">from {personLedger.length} {personLedger.length === 1 ? 'person' : 'people'}</p>
            </div>
          </div>
        )}

        {/* Person list */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card p-4 flex items-center gap-4">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-40" />
                </div>
                <Skeleton className="h-5 w-20" />
              </div>
            ))}
          </div>
        ) : personLedger.length === 0 ? (
          <EmptyState
            emoji="👥"
            message={'No person transactions yet. Try saying "gave 500 to Ali" or "Ahmed returned 200" in the AI Logger.'}
          />
        ) : (
          <div className="space-y-3">
            {personLedger.map(person => {
              const isExpanded = expanded === person.name;
              const initials = person.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

              return (
                <div key={person.name} className="card overflow-hidden">
                  {/* Person header — clickable to expand */}
                  <button
                    onClick={() => toggle(person.name)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-[var(--bg-glass)] transition-colors"
                  >
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-syne font-700 text-sm"
                      style={{ background: 'rgba(129,140,248,0.15)', color: '#818cf8', border: '1px solid rgba(129,140,248,0.25)' }}>
                      {initials}
                    </div>

                    {/* Name + summary */}
                    <div className="flex-1 min-w-0 text-left">
                      <p className="font-syne font-700 text-sm text-[var(--text-primary)]">{person.name}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs" style={{ color: '#fb7185' }}>
                          Given {formatCurrency(person.given)}
                        </span>
                        <span className="text-[var(--text-muted)] text-xs">·</span>
                        <span className="text-xs" style={{ color: '#34d399' }}>
                          Taken {formatCurrency(person.taken)}
                        </span>
                      </div>
                    </div>

                    {/* Net balance */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="text-right">
                        <p className="text-xs text-[var(--text-muted)]">
                          {person.given > person.taken ? 'They owe you' : person.taken > person.given ? 'You owe them' : 'Settled'}
                        </p>
                        <p className="font-syne font-700 text-sm" style={{
                          color: person.given > person.taken ? '#34d399' : person.taken > person.given ? '#fb7185' : '#94a3b8'
                        }}>
                          {person.given > person.taken ? '+' : person.taken > person.given ? '-' : ''}
                          {formatCurrency(Math.abs(person.balance))}
                        </p>
                      </div>
                      {isExpanded
                        ? <ChevronUp size={16} className="text-[var(--text-muted)]" />
                        : <ChevronDown size={16} className="text-[var(--text-muted)]" />}
                    </div>
                  </button>

                  {/* Expanded transactions */}
                  {isExpanded && (
                    <div className="border-t border-[var(--border-subtle)] divide-y divide-[var(--border-subtle)]">
                      {person.transactions
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map(tx => {
                          const isOut = tx.type === 'outgoing';
                          return (
                            <div key={tx.id} className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg-glass)] transition-colors">
                              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{
                                  background: isOut ? 'rgba(251,113,133,0.12)' : 'rgba(52,211,153,0.12)',
                                  border: `1px solid ${isOut ? 'rgba(251,113,133,0.25)' : 'rgba(52,211,153,0.25)'}`,
                                }}>
                                {isOut
                                  ? <ArrowUpRight size={14} style={{ color: '#fb7185' }} />
                                  : <ArrowDownLeft size={14} style={{ color: '#34d399' }} />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-[var(--text-primary)]">
                                  {isOut ? `Given to ${person.name}` : `Taken from ${person.name}`}
                                </p>
                                <p className="text-xs text-[var(--text-muted)]">
                                  {formatDate(tx.date)} · {tx.paymentMethod || 'cash'}
                                  {tx.description && tx.description !== tx.merchant ? ` · ${tx.description}` : ''}
                                </p>
                              </div>
                              <span className="font-syne font-700 text-sm flex-shrink-0"
                                style={{ color: isOut ? '#fb7185' : '#34d399' }}>
                                {isOut ? '-' : '+'}{formatCurrency(tx.amount)}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
