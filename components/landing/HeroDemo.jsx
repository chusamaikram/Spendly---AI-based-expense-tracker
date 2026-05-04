'use client';

import { useState, useEffect } from 'react';
import { Brain, Zap, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

const DEMO_MESSAGES = [
  { text: 'Received salary 85000 from company',    parsed: { type: 'incoming', amount: 85000,  category: 'income',     merchant: 'Company'  } },
  { text: 'Bought coffee for 450 at Espresso',     parsed: { type: 'outgoing', amount: 450,    category: 'food',       merchant: 'Espresso' } },
  { text: 'Careem ride to office, paid 320 by card', parsed: { type: 'outgoing', amount: 320,  category: 'transport',  merchant: 'Careem'   } },
  { text: 'Netflix subscription 1500 last night',  parsed: { type: 'outgoing', amount: 1500,   category: 'bills',      merchant: 'Netflix'  } },
];

const TYPE_COLORS = { incoming: '#34d399', outgoing: '#fb7185' };
const CAT_COLORS  = { food: '#fb923c', transport: '#22d3ee', bills: '#a78bfa', income: '#34d399', other: '#94a3b8' };

export default function HeroDemo() {
  const [demoIndex, setDemoIndex]   = useState(0);
  const [typingText, setTypingText] = useState('');
  const [showParsed, setShowParsed] = useState(false);
  const [isTyping, setIsTyping]     = useState(true);

  useEffect(() => {
    const current = DEMO_MESSAGES[demoIndex].text;
    let i = 0;
    setTypingText('');
    setShowParsed(false);
    setIsTyping(true);

    const interval = setInterval(() => {
      if (i < current.length) {
        setTypingText(current.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        setTimeout(() => setShowParsed(true), 400);
        setTimeout(() => setDemoIndex(p => (p + 1) % DEMO_MESSAGES.length), 3500);
      }
    }, 38);

    return () => clearInterval(interval);
  }, [demoIndex]);

  const current = DEMO_MESSAGES[demoIndex];

  return (
    <div className="glass rounded-3xl border border-[var(--border-subtle)] overflow-hidden shadow-card">
      {/* Window chrome */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border-subtle)]">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-400/60" />
          <div className="w-3 h-3 rounded-full bg-amber-400/60" />
          <div className="w-3 h-3 rounded-full bg-emerald-400/60" />
        </div>
        <span className="font-mono text-xs text-[var(--text-muted)]">AI Transaction Logger</span>
        <div className="w-16" />
      </div>

      {/* Chat area */}
      <div className="p-5 space-y-4 min-h-[200px]">
        {/* User message */}
        <div className="flex justify-end">
          <div
            className="rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%] border"
            style={{ background: 'rgba(34,211,238,0.08)', borderColor: 'rgba(34,211,238,0.2)' }}
          >
            <p className="text-sm text-[var(--text-primary)] font-mono leading-relaxed">
              {typingText}
              {isTyping && (
                <span
                  className="inline-block w-0.5 h-4 ml-0.5 animate-pulse align-middle"
                  style={{ background: '#22d3ee' }}
                />
              )}
            </p>
          </div>
        </div>

        {/* AI parsed response */}
        {showParsed && (
          <div className="flex justify-start bubble-in">
            <div className="glass border border-[var(--border-subtle)] rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(34,211,238,0.15)' }}
                >
                  <Brain size={10} style={{ color: '#22d3ee' }} />
                </div>
                <span className="text-xs font-mono" style={{ color: '#22d3ee' }}>Gemini AI • Parsed ✓</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-6">
                  <span className="text-xs text-[var(--text-muted)]">Type</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium capitalize flex items-center gap-1"
                    style={{ color: TYPE_COLORS[current.parsed.type], background: TYPE_COLORS[current.parsed.type] + '20' }}
                  >
                    {current.parsed.type === 'incoming' ? <ArrowDownLeft size={10} /> : <ArrowUpRight size={10} />}
                    {current.parsed.type}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-6">
                  <span className="text-xs text-[var(--text-muted)]">Amount</span>
                  <span className="text-sm font-syne font-700" style={{ color: TYPE_COLORS[current.parsed.type] }}>
                    Rs. {current.parsed.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-6">
                  <span className="text-xs text-[var(--text-muted)]">Category</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
                    style={{
                      color: CAT_COLORS[current.parsed.category] || '#94a3b8',
                      background: (CAT_COLORS[current.parsed.category] || '#94a3b8') + '20',
                    }}
                  >
                    {current.parsed.category}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-6">
                  <span className="text-xs text-[var(--text-muted)]">Merchant</span>
                  <span className="text-xs text-[var(--text-primary)] font-medium">{current.parsed.merchant}</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#22d3ee' }} />
                <span className="text-xs text-[var(--text-muted)]">Saved to your dashboard</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="px-5 pb-5">
        <div
          className="flex items-center gap-3 border border-[var(--border-subtle)] rounded-2xl px-4 py-3"
          style={{ background: 'var(--bg-glass)' }}
        >
          <span className="text-xs text-[var(--text-muted)] flex-1 font-mono">Describe any transaction...</span>
          <div
            className="w-7 h-7 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(34,211,238,0.15)' }}
          >
            <Zap size={12} style={{ color: '#22d3ee' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
