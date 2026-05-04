'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send, Mic, MicOff, Brain, Plus, Trash2,
  FileText, ArrowDownLeft, ArrowUpRight, ChevronLeft, ChevronRight, Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { CATEGORY_META, formatCurrency, formatDate } from '../../lib/utils/expenseParser';
import { useExpenses } from '../../lib/hooks/useExpenses';
import { useAuth } from '../../lib/hooks/useAuth';
import {
  saveChatSession, updateChatSession,
  getChatSessions, deleteChatSession,
} from '../../lib/firebase/expenses';

const SUGGESTIONS = [
  'Aaj chai pe 150 kharch kiye',
  'Meny Azhar ko 500 diye',
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

  const [messages, setMessages]         = useState([makeWelcome()]);
  const [input, setInput]               = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening]   = useState(false);
  const [sessions, setSessions]         = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [historyOpen, setHistoryOpen]   = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(true);

  const bottomRef      = useRef(null);
  const recognitionRef = useRef(null);
  const historyRef     = useRef([]);
  const saveTimerRef   = useRef(null);

  // Load sessions on mount
  useEffect(() => {
    if (!user) return;
    getChatSessions(user.uid)
      .then(setSessions)
      .finally(() => setLoadingSessions(false));
  }, [user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-save after 2s of inactivity
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

  const loadSession = (session) => {
    const msgs = (session.messages || []).map(m => ({
      ...m,
      timestamp: m.timestamp ? new Date(m.timestamp) : new Date(),
      expense: m.expense ? {
        ...m.expense,
        date: m.expense.date ? new Date(m.expense.date) : new Date(),
      } : null,
    }));
    setMessages(msgs.length ? msgs : [makeWelcome()]);
    historyRef.current = msgs.filter(m => m.role !== 'welcome').map(m => ({ role: m.role, text: m.text }));
    setActiveChatId(session.id);
    if (window.innerWidth < 1024) setHistoryOpen(false);
  };

  const newChat = () => {
    setMessages([makeWelcome()]);
    historyRef.current = [];
    setActiveChatId(null);
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
        const isIncoming = txData.type === 'incoming';
        toast.success(`${isIncoming ? '💰' : '💸'} ${formatCurrency(txData.amount)} saved`);
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
    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);
    rec.start();
    recognitionRef.current = rec;
    setIsListening(true);
  };

  return (
    <div className="flex h-full">

      {/* ── History Sidebar ── */}
      <div
        className={`shrink-0 flex flex-col border-r border-[var(--border-subtle)] transition-all duration-300 ${historyOpen ? 'w-56' : 'w-0 overflow-hidden'}`}
        style={{ background: 'var(--bg-secondary)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--border-subtle)]">
          <span className="font-syne font-700 text-sm text-[var(--text-primary)]">History</span>
          <button onClick={newChat}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-[var(--bg-glass)]"
            style={{ color: '#22d3ee' }} title="New chat">
            <Plus size={15} />
          </button>
        </div>

        {/* Session list */}
        <div className="flex-1 overflow-y-auto py-2 space-y-0.5 px-2">
          {loadingSessions ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="h-10 rounded-xl shimmer-bg mb-1" style={{ background: 'var(--bg-glass)' }} />
            ))
          ) : sessions.length === 0 ? (
            <p className="text-xs text-[var(--text-muted)] text-center py-6 px-2">No saved chats yet</p>
          ) : (
            sessions.map(s => (
              <div key={s.id}
                onClick={() => loadSession(s)}
                role="button" tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && loadSession(s)}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all group cursor-pointer"
                style={activeChatId === s.id
                  ? { background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)' }
                  : { border: '1px solid transparent' }}>
                <Brain size={13} className="flex-shrink-0" style={{ color: activeChatId === s.id ? '#22d3ee' : 'var(--text-muted)' }} />
                <span className="flex-1 text-xs text-[var(--text-secondary)] truncate">{s.title || 'Chat'}</span>
                <button onClick={e => deleteSession(e, s.id)}
                  className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded flex items-center justify-center transition-all flex-shrink-0"
                  style={{ color: '#fb7185' }}>
                  <Trash2 size={11} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Main Chat ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-[var(--border-subtle)] px-4 py-3.5 flex items-center gap-3"
          style={{ background: 'var(--bg-secondary)' }}>
          {/* Mobile menu */}
          {onMenuClick && (
            <button onClick={onMenuClick}
              className="lg:hidden w-8 h-8 rounded-xl border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)] flex-shrink-0"
              style={{ background: 'var(--bg-glass)' }}>
              <ChevronRight size={15} />
            </button>
          )}
          {/* Toggle history */}
          <button onClick={() => setHistoryOpen(p => !p)}
            className="w-8 h-8 rounded-xl border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors flex-shrink-0"
            style={{ background: 'var(--bg-glass)' }}>
            {historyOpen ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
          </button>

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
          input={input} setInput={setInput}
          isListening={isListening} isProcessing={isProcessing}
          onSend={handleSend} onToggleVoice={toggleVoice}
        />
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex justify-start bubble-in">
      <div className="border border-[var(--border-subtle)] rounded-2xl rounded-tl-sm px-4 py-3" style={{ background: 'var(--bg-glass)' }}>
        <div className="flex items-center gap-2">
          <Brain size={13} style={{ color: '#22d3ee' }} />
          <div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce"
                style={{ background: 'rgba(34,211,238,0.6)', animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatInput({ input, setInput, isListening, isProcessing, onSend, onToggleVoice }) {
  return (
    <div className="flex-shrink-0 border-t border-[var(--border-subtle)] px-4 md:px-6 py-4" style={{ background: 'var(--bg-secondary)' }}>
      <div
        className={`flex items-end gap-3 rounded-2xl border transition-all px-4 py-3 ${isListening ? 'border-animated' : ''}`}
        style={{ background: 'var(--bg-glass)', borderColor: isListening ? 'rgba(34,211,238,0.4)' : 'var(--border-subtle)' }}
      >
        <textarea
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); } }}
          placeholder={isListening ? '🎤 Listening...' : 'Ask anything or describe a transaction...'}
          rows={1} disabled={isProcessing}
          className="flex-1 bg-transparent resize-none text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none max-h-24 leading-relaxed disabled:opacity-50"
          style={{ scrollbarWidth: 'none' }}
        />
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={onToggleVoice} disabled={isProcessing}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 ${isListening ? 'animate-pulse' : ''}`}
            style={isListening
              ? { background: 'rgba(251,113,133,0.15)', color: '#fb7185', border: '1px solid rgba(251,113,133,0.3)' }
              : { color: 'var(--text-muted)' }}>
            {isListening ? <MicOff size={15} /> : <Mic size={15} />}
          </button>
          <button onClick={() => onSend()} disabled={!input.trim() || isProcessing}
            className="w-8 h-8 rounded-xl btn-primary flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none">
            <Send size={14} />
          </button>
        </div>
      </div>
      <p className="text-xs text-[var(--text-muted)] mt-2 text-center">
        Chat freely · Log transactions · Ask for reports · Auto-saved
      </p>
    </div>
  );
}

function MessageBubble({ message }) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end bubble-in">
        <div className="max-w-[80%] rounded-2xl rounded-tr-sm px-4 py-3 border"
          style={{ background: 'rgba(34,211,238,0.08)', borderColor: 'rgba(34,211,238,0.15)' }}>
          <p className="text-sm text-[var(--text-primary)] leading-relaxed">{message.text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start bubble-in">
      <div className="max-w-[88%] space-y-2">
        <div className="flex items-center gap-1.5 px-1">
          <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(34,211,238,0.15)' }}>
            <Brain size={9} style={{ color: '#22d3ee' }} />
          </div>
          <span className="text-xs font-mono" style={{ color: '#22d3ee' }}>Spendly AI</span>
        </div>

        {message.text && (
          <div className="border border-[var(--border-subtle)] rounded-2xl rounded-tl-sm px-4 py-3" style={{ background: 'var(--bg-glass)' }}>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
              {message.text.split('**').map((part, i) =>
                i % 2 === 1 ? <strong key={i} className="text-[var(--text-primary)] font-semibold">{part}</strong> : part
              )}
            </p>
          </div>
        )}

        {message.type === 'transaction' && message.expense && <TransactionCard expense={message.expense} />}
        {message.type === 'report' && message.report && <ReportCard report={message.report} meta={message.meta} />}
      </div>
    </div>
  );
}

function TransactionCard({ expense }) {
  const meta = CATEGORY_META[expense.category] || CATEGORY_META.other;
  const isIncoming = expense.type === 'incoming';
  const accentColor = isIncoming ? '#34d399' : '#fb7185';
  const date = expense.date instanceof Date ? expense.date : new Date(expense.date || Date.now());
  const CatIcon = meta.icon;

  return (
    <div className="border rounded-2xl overflow-hidden min-w-[240px]"
      style={{ background: 'var(--bg-card)', borderColor: `${accentColor}25` }}>
      <div className="px-4 pt-3 pb-2 border-b flex items-center gap-2" style={{ borderColor: `${accentColor}15` }}>
        <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: `${accentColor}20` }}>
          {isIncoming ? <ArrowDownLeft size={10} style={{ color: accentColor }} /> : <ArrowUpRight size={10} style={{ color: accentColor }} />}
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

function ReportCard({ report, meta }) {
  const lines = report.split('\n').filter(l => l.trim());

  const renderLine = (line, i) => {
    if (line.startsWith('|') && !line.startsWith('|---')) {
      const cells = line.split('|').filter(c => c.trim());
      if (cells.length === 2) {
        const isHeader = cells[0].trim().toLowerCase() === 'category';
        return isHeader ? null : (
          <div key={i} className="flex items-center justify-between py-2 border-b border-[var(--border-subtle)] last:border-0">
            <span className="text-sm text-[var(--text-secondary)] capitalize">{cells[0].trim()}</span>
            <span className="text-sm font-syne font-700 text-[var(--text-primary)]">{cells[1].trim()}</span>
          </div>
        );
      }
    }
    if (line.startsWith('**') && line.endsWith('**')) {
      return <p key={i} className="text-xs font-syne font-700 text-[var(--text-muted)] uppercase tracking-widest mt-4 mb-2 first:mt-0">{line.replace(/\*\*/g, '')}</p>;
    }
    if (/^[\u{1F000}-\u{1FFFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u.test(line)) {
      const [emoji, ...rest] = line.split(' ');
      const content = rest.join(' ');
      const isBalance = line.includes('Net Balance');
      const isIncome  = line.includes('Income:');
      const isExpense = line.includes('Expenses:');
      const valueColor = isBalance ? (meta?.balance >= 0 ? '#34d399' : '#fb7185') : isIncome ? '#34d399' : isExpense ? '#fb7185' : 'var(--text-primary)';
      return (
        <div key={i} className="flex items-center justify-between py-1.5">
          <span className="text-sm text-[var(--text-secondary)] flex items-center gap-2"><span>{emoji}</span><span>{content.split(':')[0]}</span></span>
          <span className="text-sm font-syne font-700" style={{ color: valueColor }}>{content.split(':')[1]?.trim()}</span>
        </div>
      );
    }
    if (/^\d\./.test(line)) {
      return (
        <div key={i} className="flex gap-2 py-1">
          <span className="text-xs font-700 flex-shrink-0 mt-0.5" style={{ color: '#22d3ee' }}>{line.match(/^\d/)[0]}.</span>
          <span className="text-sm text-[var(--text-secondary)] leading-relaxed">{line.replace(/^\d\.\s*/, '')}</span>
        </div>
      );
    }
    return <p key={i} className="text-sm text-[var(--text-secondary)] leading-relaxed">{line}</p>;
  };

  return (
    <div className="border rounded-2xl overflow-hidden min-w-[280px]"
      style={{ background: 'var(--bg-card)', borderColor: 'rgba(34,211,238,0.2)' }}>
      <div className="px-4 pt-3 pb-2 border-b flex items-center justify-between" style={{ borderColor: 'rgba(34,211,238,0.12)' }}>
        <div className="flex items-center gap-2">
          <FileText size={13} style={{ color: '#22d3ee' }} />
          <span className="text-xs font-mono font-medium" style={{ color: '#22d3ee' }}>Financial Report</span>
        </div>
        <span className="text-xs text-[var(--text-muted)] font-mono">{meta?.period || 'all time'}</span>
      </div>
      <div className="px-4 py-3">{lines.map((line, i) => renderLine(line, i))}</div>
    </div>
  );
}
