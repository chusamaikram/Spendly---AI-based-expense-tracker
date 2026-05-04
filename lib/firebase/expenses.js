import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';

// ── Helpers ───────────────────────────────────────────────────────────────────

const userExpensesCol = (userId) =>
  collection(db, 'users', userId, 'expenses');

const toTimestamp = (date) => {
  if (date instanceof Timestamp) return date;
  if (date instanceof Date) return Timestamp.fromDate(date);
  return Timestamp.fromDate(new Date(date));
};

const docToExpense = (d) => {
  const data = d.data();
  return {
    id: d.id,
    ...data,
    date: data.date?.toDate ? data.date.toDate() : new Date(data.date),
  };
};

// ── CRUD ──────────────────────────────────────────────────────────────────────

export const addExpense = async (userId, expenseData) => {
  const ref = await addDoc(userExpensesCol(userId), {
    ...expenseData,
    date: toTimestamp(expenseData.date || new Date()),
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

export const getUserExpenses = async (userId, limitCount = 200) => {
  const q = query(
    userExpensesCol(userId),
    orderBy('date', 'desc'),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map(docToExpense);
};

export const deleteExpense = async (userId, expenseId) => {
  await deleteDoc(doc(db, 'users', userId, 'expenses', expenseId));
};

export const updateExpense = async (userId, expenseId, updates) => {
  await updateDoc(doc(db, 'users', userId, 'expenses', expenseId), {
    ...updates,
    date: updates.date ? toTimestamp(updates.date) : undefined,
    updatedAt: serverTimestamp(),
  });
};

// ── Chat Sessions ─────────────────────────────────────────────────────────────

const userChatsCol = (userId) => collection(db, 'users', userId, 'chats');

export const saveChatSession = async (userId, messages) => {
  const title = messages.find(m => m.role === 'user')?.text?.slice(0, 40) || 'New Chat';
  const ref = await addDoc(userChatsCol(userId), {
    title,
    messages: messages.map(m => ({
      id: m.id,
      role: m.role,
      type: m.type,
      text: m.text || '',
      expense: m.expense ? {
        type: m.expense.type,
        amount: m.expense.amount,
        category: m.expense.category,
        merchant: m.expense.merchant,
        paymentMethod: m.expense.paymentMethod,
        description: m.expense.description,
        date: m.expense.date instanceof Date ? m.expense.date.toISOString() : m.expense.date,
      } : null,
      report: m.report || null,
      meta: m.meta || null,
      timestamp: m.timestamp instanceof Date ? m.timestamp.toISOString() : new Date().toISOString(),
    })),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
};

export const updateChatSession = async (userId, chatId, messages) => {
  const title = messages.find(m => m.role === 'user')?.text?.slice(0, 40) || 'Chat';
  await updateDoc(doc(db, 'users', userId, 'chats', chatId), {
    title,
    messages: messages.map(m => ({
      id: m.id,
      role: m.role,
      type: m.type,
      text: m.text || '',
      expense: m.expense ? {
        type: m.expense.type,
        amount: m.expense.amount,
        category: m.expense.category,
        merchant: m.expense.merchant,
        paymentMethod: m.expense.paymentMethod,
        description: m.expense.description,
        date: m.expense.date instanceof Date ? m.expense.date.toISOString() : m.expense.date,
      } : null,
      report: m.report || null,
      meta: m.meta || null,
      timestamp: m.timestamp instanceof Date ? m.timestamp.toISOString() : new Date().toISOString(),
    })),
    updatedAt: serverTimestamp(),
  });
};

export const getChatSessions = async (userId) => {
  const q = query(userChatsCol(userId), orderBy('updatedAt', 'desc'), limit(30));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const deleteChatSession = async (userId, chatId) => {
  await deleteDoc(doc(db, 'users', userId, 'chats', chatId));
};
