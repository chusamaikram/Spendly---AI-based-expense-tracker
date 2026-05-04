'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getUserExpenses, addExpense, deleteExpense, updateExpense } from '../firebase/expenses';
import { useAuth } from './useAuth';
import { getCategoryTotals, getMonthlyTrend, getPersonLedger } from '../utils/expenseParser';

const ExpensesContext = createContext(null);

export function ExpensesProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const fetchExpenses = useCallback(async () => {
    if (authLoading) return;
    if (!user) { setExpenses([]); setLoading(false); return; }
    try {
      setLoading(true);
      setError(null);
      const data = await getUserExpenses(user.uid, 200);
      setExpenses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, authLoading]);

  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

  const addNewExpense = async (expenseData) => {
    if (!user) throw new Error('Not authenticated');
    const id = await addExpense(user.uid, expenseData);
    setExpenses(prev => [{ id, ...expenseData, userId: user.uid }, ...prev]);
    return id;
  };

  const removeExpense = async (expenseId) => {
    await deleteExpense(user.uid, expenseId);
    setExpenses(prev => prev.filter(e => e.id !== expenseId));
  };

  const editExpense = async (expenseId, updates) => {
    await updateExpense(user.uid, expenseId, updates);
    setExpenses(prev => prev.map(e => e.id === expenseId ? { ...e, ...updates } : e));
  };

  const now = new Date();
  const thisMonth = expenses.filter(e => {
    const d = e.date instanceof Date ? e.date : new Date(e.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const totalIncome  = expenses.filter(e => e.type === 'incoming').reduce((s, e) => s + (e.amount || 0), 0);
  const totalExpense = expenses.filter(e => e.type !== 'incoming').reduce((s, e) => s + (e.amount || 0), 0);
  const monthIncome  = thisMonth.filter(e => e.type === 'incoming').reduce((s, e) => s + (e.amount || 0), 0);
  const monthExpense = thisMonth.filter(e => e.type !== 'incoming').reduce((s, e) => s + (e.amount || 0), 0);

  const stats = {
    totalIncome, totalExpense,
    balance: totalIncome - totalExpense,
    monthIncome, monthExpense,
    monthBalance: monthIncome - monthExpense,
    totalCount: expenses.length,
    monthCount: thisMonth.length,
    categoryTotals: getCategoryTotals(expenses),
    monthlyTrend: getMonthlyTrend(expenses),
    personLedger: getPersonLedger(expenses),
  };

  return (
    <ExpensesContext.Provider value={{ expenses, loading, error, stats, addNewExpense, removeExpense, editExpense, refetch: fetchExpenses }}>
      {children}
    </ExpensesContext.Provider>
  );
}

export function useExpenses() {
  const ctx = useContext(ExpensesContext);
  if (!ctx) throw new Error('useExpenses must be used within ExpensesProvider');
  return ctx;
}
