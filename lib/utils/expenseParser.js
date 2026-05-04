import { UtensilsCrossed, Car, ShoppingBag, Zap, HeartPulse, Clapperboard, TrendingUp, MoreHorizontal, Users } from 'lucide-react';

export const CATEGORY_META = {
  food:          { label: 'Food & Dining',    icon: UtensilsCrossed, color: '#fb923c', bgClass: 'cat-food-bg',          textClass: 'cat-food' },
  transport:     { label: 'Transport',        icon: Car,             color: '#22d3ee', bgClass: 'cat-transport-bg',     textClass: 'cat-transport' },
  shopping:      { label: 'Shopping',         icon: ShoppingBag,     color: '#f472b6', bgClass: 'cat-shopping-bg',     textClass: 'cat-shopping' },
  bills:         { label: 'Bills & Utils',    icon: Zap,             color: '#a78bfa', bgClass: 'cat-bills-bg',         textClass: 'cat-bills' },
  health:        { label: 'Health',           icon: HeartPulse,      color: '#34d399', bgClass: 'cat-health-bg',        textClass: 'cat-health' },
  entertainment: { label: 'Entertainment',    icon: Clapperboard,    color: '#fbbf24', bgClass: 'cat-entertainment-bg', textClass: 'cat-entertainment' },
  income:        { label: 'Income',           icon: TrendingUp,      color: '#34d399', bgClass: 'cat-income-bg',        textClass: 'cat-income' },
  person:        { label: 'Person',           icon: Users,           color: '#818cf8', bgClass: 'cat-person-bg',        textClass: 'cat-person' },
  other:         { label: 'Other',            icon: MoreHorizontal,  color: '#94a3b8', bgClass: 'cat-other-bg',         textClass: 'cat-other' },
};

export const formatCurrency = (amount) =>
  `Rs. ${Number(amount || 0).toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

export const formatDate = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const getCategoryTotals = (expenses) => {
  const totals = {};
  expenses
    .filter(e => e.type !== 'incoming' && e.category !== 'person')
    .forEach(exp => {
      const cat = exp.category || 'other';
      totals[cat] = (totals[cat] || 0) + (exp.amount || 0);
    });
  return Object.entries(totals)
    .map(([category, total]) => ({ category, total, ...(CATEGORY_META[category] || CATEGORY_META.other) }))
    .sort((a, b) => b.total - a.total);
};

export const getMonthlyTrend = (expenses) => {
  const months = {};
  expenses.forEach(exp => {
    const d = exp.date instanceof Date ? exp.date : new Date(exp.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!months[key]) months[key] = { income: 0, expense: 0 };
    if (exp.type === 'incoming') months[key].income += exp.amount || 0;
    else months[key].expense += exp.amount || 0;
  });
  return Object.entries(months)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, data]) => ({
      month,
      label: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short' }),
      ...data,
    }));
};

// Build per-person ledger from all expenses where category === 'person'
export const getPersonLedger = (expenses) => {
  const ledger = {};
  expenses
    .filter(e => e.category === 'person' && e.person)
    .forEach(e => {
      const name = e.person.trim();
      if (!ledger[name]) ledger[name] = { name, given: 0, taken: 0, transactions: [] };
      if (e.type === 'outgoing') ledger[name].given  += e.amount || 0;
      else                       ledger[name].taken  += e.amount || 0;
      ledger[name].transactions.push(e);
    });

  return Object.values(ledger)
    .map(p => ({ ...p, balance: p.taken - p.given }))
    .sort((a, b) => a.name.localeCompare(b.name));
};
