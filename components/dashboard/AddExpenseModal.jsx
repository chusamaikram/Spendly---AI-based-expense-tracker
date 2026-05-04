'use client';

import { useState } from 'react';
import { Plus, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { CATEGORY_META } from '../../lib/utils/expenseParser';
import { useExpenses } from '../../lib/hooks/useExpenses';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const PAYMENT_METHODS = ['cash', 'card', 'online'];
const EXPENSE_CATS = Object.keys(CATEGORY_META).filter(c => c !== 'income');

const DEFAULT = {
  type: 'outgoing', amount: '', category: 'food', merchant: '',
  person: '', paymentMethod: 'cash', description: '',
  date: new Date().toISOString().split('T')[0],
};

export default function AddExpenseModal({ onClose }) {
  const { addNewExpense } = useExpenses();
  const [form, setForm] = useState(DEFAULT);
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const accentColor = form.type === 'incoming' ? '#34d399' : '#fb7185';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    setLoading(true);
    try {
      await addNewExpense({
        type: form.type,
        amount: Number(form.amount),
        category: form.type === 'incoming' ? 'income' : form.category,
        merchant: form.category === 'person' ? (form.person.trim() || 'Unknown') : (form.merchant.trim() || 'Unknown'),
        paymentMethod: form.paymentMethod,
        description: form.description.trim() || form.merchant.trim() || form.category,
        date: new Date(form.date),
        ...(form.category === 'person' && form.person.trim() ? { person: form.person.trim() } : {}),
      });
      toast.success(`${form.type === 'incoming' ? '💰 Income' : '💸 Expense'} saved!`);
      onClose();
    } catch {
      toast.error('Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose} title="Add Transaction" icon={Plus} accentColor={accentColor}>
      <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto">

        {/* Type toggle */}
        <div className="flex gap-2 p-1 rounded-xl border border-[var(--border-subtle)]" style={{ background: 'var(--bg-glass)' }}>
          {[
            { val: 'outgoing', label: 'Expense', icon: ArrowUpRight, color: '#fb7185' },
            { val: 'incoming', label: 'Income',  icon: ArrowDownLeft, color: '#34d399' },
          ].map(({ val, label, icon: Icon, color }) => (
            <button key={val} type="button" onClick={() => set('type', val)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={form.type === val
                ? { background: `${color}15`, color, border: `1px solid ${color}25` }
                : { color: 'var(--text-muted)', border: '1px solid transparent' }}>
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Amount */}
        <div>
          <label className="text-xs text-[var(--text-muted)] mb-1.5 block">Amount (PKR)</label>
          <input
            type="number" placeholder="0" value={form.amount} min="1" required
            onChange={e => set('amount', e.target.value)}
            className="input-field font-syne font-700 text-lg"
            style={{ borderColor: form.amount ? `${accentColor}40` : undefined }}
          />
        </div>

        {/* Category — only for outgoing */}
        {form.type === 'outgoing' && (
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1.5 block">Category</label>
            <div className="grid grid-cols-4 gap-2">
              {EXPENSE_CATS.map(cat => {
                const meta = CATEGORY_META[cat];
                const active = form.category === cat;
                const CatIcon = meta.icon;
                return (
                  <button key={cat} type="button" onClick={() => set('category', cat)}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs transition-all ${active ? `${meta.bgClass} ${meta.textClass}` : 'border-[var(--border-subtle)] text-[var(--text-muted)]'}`}
                    style={{ background: active ? undefined : 'var(--bg-glass)' }}>
                    <CatIcon size={18} style={{ color: active ? undefined : meta.color }} />
                    <span className="truncate w-full text-center px-1" style={{ fontSize: '10px' }}>
                      {meta.label.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Person name — only when category is person */}
        {form.type === 'outgoing' && form.category === 'person' && (
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1.5 block">Person Name</label>
            <input
              type="text" placeholder="e.g. Ali, Ahmed, Sara"
              value={form.person} onChange={e => set('person', e.target.value)}
              className="input-field"
            />
          </div>
        )}

        {/* Merchant & Date */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1.5 block">
              {form.type === 'incoming' ? 'Source' : 'Merchant'}
            </label>
            <input
              type="text"
              placeholder={form.type === 'incoming' ? 'e.g. Company' : 'e.g. Espresso'}
              value={form.merchant} onChange={e => set('merchant', e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1.5 block">Date</label>
            <input type="date" value={form.date} onChange={e => set('date', e.target.value)} required className="input-field" />
          </div>
        </div>

        {/* Payment method */}
        <div>
          <label className="text-xs text-[var(--text-muted)] mb-1.5 block">Payment Method</label>
          <div className="flex gap-2">
            {PAYMENT_METHODS.map(m => (
              <button key={m} type="button" onClick={() => set('paymentMethod', m)}
                className="flex-1 py-2.5 rounded-xl border text-xs font-medium capitalize transition-all"
                style={form.paymentMethod === m
                  ? { background: `${accentColor}12`, borderColor: `${accentColor}30`, color: accentColor }
                  : { background: 'var(--bg-glass)', borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="text-xs text-[var(--text-muted)] mb-1.5 block">
            Note <span className="opacity-50">(optional)</span>
          </label>
          <input
            type="text" placeholder="Brief note..." value={form.description} maxLength={80}
            onChange={e => set('description', e.target.value)} className="input-field"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <Button variant="ghost" onClick={onClose} className="flex-1 py-3">Cancel</Button>
          <button
            type="submit" disabled={loading}
            className="flex-1 py-3 rounded-xl text-sm font-syne font-700 disabled:opacity-60 flex items-center justify-center gap-2 transition-all"
            style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`, color: '#020617' }}
          >
            {loading
              ? <div className="w-4 h-4 border-2 border-slate-900/40 border-t-slate-900 rounded-full animate-spin" />
              : <Plus size={15} />}
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
