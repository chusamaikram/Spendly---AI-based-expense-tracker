'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Brain, Plus, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatCurrency } from '../../lib/utils/expenseParser';
import { useExpenses } from '../../lib/hooks/useExpenses';
import { useAuth } from '../../lib/hooks/useAuth';
import { saveChatSession, updateChatSession, getChatSessions, deleteChatSession } from '../../lib/firebase/expenses';
import ChatHistorySidebar from './ChatHistorySidebar';
import ChatInput from './ChatInput';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

const SUGGESTIONS = [
  'Aaj chai pe 150 kharch kiye',
  'Meny Usama ko 500 diye',
  'Salary aayi 45000',
  'Show my monthly report',
];

const makeWelcome = () => ({
  id: 'welcome', role: 'ai', type: 'chat',
  text: "Assalam o Alaikum! 👋 Main Spendly AI hoon.\n\n• **English** — \"Spent 500 on food\"\n• **Roman Urdu** — \"Meny Ali ko 400 diye\"\n• **Mixed** — \"Aaj petrol dala 2000 ka\"\n\nBas batao, main record kar lunga!",
  timestamp: new Date(),
});

export default function ChatInterface({ onMenuClick }) {
  const { addNewExpense, expenses } = useExpenses();
  const { user } = useAuth();

  const [messages, setMessages]               = useState([makeWelcome()]);
  const [input, setInput]                     = useState('');
  const [isProcessing, setIsProcessing]       = useState(false);
  const [isListening, setIsListening]         = useState(false);
  const [sessions, setSessions]               = useState([]);
  const [activeChatId, setActiveChatId]       = useState(null);
  const [historyOpen, setHistoryOpen]         = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(true);

  const bottomRef      = useRef(null);
  const recognitionRef = useRef(null);
  const historyRef     = useRef([]);
  const saveTimerRef   = useRef(null);

  useEffect(() => {
    if (!user) return;
    getChatSessions(user.uid)
      .then(setSessions)
      .finally(() => setLoadingSessions(false));
  }, [user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const scheduleSave = useCallback((msgs) => {
    if (!user) return;
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      const nonWelcome = msgs.filter(m => m.id !== 'welcome');
      if (nonWelcome.length === 0) return;
      try {
        if (activeChatId) {
          await updateChatSession(user.uid, activeChatId, msgs);
          setSessions(prev => prev.map(s =>
            s.id === activeChatId
              ? { ...s, title: msgs.find(m => m.role === 'user')?.text?.slice(0, 40) || s.title }
              : s
          ));
        } else {
          const id = await saveChatSession(user.uid, msgs);
          setActiveChatId(id);
          const title = msgs.find(m => m.role === 'user')?.text?.slice(0, 40) || 'New Chat';
          setSessions(prev => [{ id, title, messages: msgs, updatedAt: new Date() }, ...prev]);
        }
      } catch (e) {
        console.error('Auto-save failed:', e);
      }
    }, 2000);
  }, [user, activeChatId]);

  const addMsg = useCallback((msg) => {
    setMessages(prev => {
      const next = [...prev, { id: Date.now() + Math.random(), timestamp: new Date(), ...msg }];
      scheduleSave(next);
      return next;
    });
  }, [scheduleSave]);

  const newChat = () => {
    setMessages([makeWelcome()]);
    historyRef.current = [];
    setActiveChatId(null);
  };

  const loadSession = (session) => {
    const msgs = (session.messages || []).map(m => ({
      ...m,
      timestamp: m.timestamp ? new Date(m.timestamp) : new Date(),
      expense: m.expense ? { ...m.expense, date: m.expense.date ? new Date(m.expense.date) : new Date() } : null,
    }));
    setMessages(msgs.length ? msgs : [makeWelcome()]);
    historyRef.current = msgs.filter(m => m.id !== 'welcome').map(m => ({ role: m.role, text: m.text }));
    setActiveChatId(session.id);
    if (window.innerWidth < 1024) setHistoryOpen(false);
  };

  const deleteSession = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteChatSession(user.uid, id);
      setSessions(prev => prev.filter(s => s.id !== id));
      if (activeChatId === id) newChat();
      toast.success('Chat deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleSend = async (text = input.trim()) => {
    if (!text || isProcessing) return;
    setInput('');
    addMsg({ role: 'user', type: 'text', text });
    historyRef.current.push({ role: 'user', text });
    setIsProcessing(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: historyRef.current.slice(-10),
          userId: user?.uid,
          transactions: expenses.map(e => ({
            id: e.id, type: e.type, amount: e.amount,
            category: e.category, merchant: e.merchant,
            paymentMethod: e.paymentMethod,
            date: e.date instanceof Date ? e.date.toISOString() : e.date,
            description: e.description,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');

      if (data.reply) historyRef.current.push({ role: 'ai', text: data.reply });

      if (data.intent === 'transaction' && data.transaction?.amount) {
        const tx = data.transaction;
        const txData = {
          type: tx.type || 'outgoing',
          amount: Number(tx.amount),
          category: tx.category || 'other',
          merchant: tx.person || tx.merchant || 'Unknown',
          paymentMethod: tx.paymentMethod || 'cash',
          date: tx.date ? new Date(tx.date) : new Date(),
          description: tx.description || text,
          ...(tx.person ? { person: tx.person } : {}),
        };
        await addNewExpense(txData);
        toast.success(`${txData.type === 'incoming' ? '💰' : '💸'} ${formatCurrency(txData.amount)} saved`);
        addMsg({ role: 'ai', type: 'transaction', text: data.reply, expense: txData });
      } else if (data.intent === 'report') {
        addMsg({ role: 'ai', type: 'report', text: data.reply, report: data.report, meta: data.meta });
      } else {
        addMsg({ role: 'ai', type: 'chat', text: data.reply });
      }
    } catch {
      addMsg({ role: 'ai', type: 'chat', text: 'Sorry, something went wrong. Please try again!' });
      toast.error('Failed to get response');
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      toast.error('Voice input not supported'); return;
    }
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.continuous = false; rec.interimResults = false; rec.lang = 'en-US';
    rec.onresult = e => { setInput(e.results[0][0].transcript); setIsListening(false); };
    rec.onerror  = () => setIsListening(false);
    rec.onend    = () => setIsListening(false);
    rec.start();
    recognitionRef.current = rec;
    setIsListening(true);
  };

  return (
    <div className="flex h-full">

      {/* History Sidebar */}
      <ChatHistorySidebar
        sessions={sessions}
        activeChatId={activeChatId}
        loadingSessions={loadingSessions}
        historyOpen={historyOpen}
        onNewChat={newChat}
        onLoadSession={loadSession}
        onDeleteSession={deleteSession}
      />

      {/* Main Chat */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <div className="flex-shrink-0 border-b border-[var(--border-subtle)] px-4 py-3.5 flex items-center gap-3"
          style={{ background: 'var(--bg-secondary)' }}>

          {/* Mobile menu button */}
          {onMenuClick && (
            <button onClick={onMenuClick}
              className="lg:hidden w-8 h-8 rounded-xl border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)] flex-shrink-0"
              style={{ background: 'var(--bg-glass)' }}>
              <ChevronRight size={15} />
            </button>
          )}

          {/* Toggle history sidebar */}
          <button
            onClick={() => setHistoryOpen(p => !p)}
            className="w-8 h-8 rounded-xl border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors flex-shrink-0"
            style={{ background: 'var(--bg-glass)' }}
          >
            {historyOpen ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
          </button>

          {/* Title */}
          <div className="flex items-center gap-2.5 flex-1">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#22d3ee,#0891b2)' }}>
              <Brain size={15} className="text-slate-950" />
            </div>
            <div>
              <p className="font-syne font-700 text-sm text-[var(--text-primary)]">Spendly AI</p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#22d3ee' }} />
                <span className="text-xs text-[var(--text-muted)]">Gemini powered</span>
              </div>
            </div>
          </div>

          {/* New chat */}
          <button onClick={newChat}
            className="w-8 h-8 rounded-xl border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            style={{ background: 'var(--bg-glass)' }} title="New chat">
            <Plus size={15} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-5 space-y-4">
          {messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}
          {isProcessing && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="px-4 md:px-6 pb-3">
            <p className="text-xs text-[var(--text-muted)] mb-2 flex items-center gap-1.5">
              <Sparkles size={11} style={{ color: '#22d3ee' }} /> Try asking
            </p>
            <div className="flex gap-2 flex-wrap">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => handleSend(s)}
                  className="text-xs border text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-3 py-1.5 rounded-xl transition-all"
                  style={{ background: 'var(--bg-glass)', borderColor: 'var(--border-subtle)' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <ChatInput
          input={input}
          setInput={setInput}
          isListening={isListening}
          isProcessing={isProcessing}
          onSend={handleSend}
          onToggleVoice={toggleVoice}
        />
      </div>
    </div>
  );
}
