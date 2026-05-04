'use client';

import { Send, Mic, MicOff } from 'lucide-react';

export default function ChatInput({ input, setInput, isListening, isProcessing, onSend, onToggleVoice }) {
  return (
    <div className="flex-shrink-0 border-t border-[var(--border-subtle)] px-4 md:px-6 py-4"
      style={{ background: 'var(--bg-secondary)' }}>
      <div
        className={`flex items-end gap-3 rounded-2xl border transition-all px-4 py-3 ${isListening ? 'border-animated' : ''}`}
        style={{ background: 'var(--bg-glass)', borderColor: isListening ? 'rgba(34,211,238,0.4)' : 'var(--border-subtle)' }}
      >
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); } }}
          placeholder={isListening ? '🎤 Listening...' : 'Ask anything or describe a transaction...'}
          rows={1}
          disabled={isProcessing}
          className="flex-1 bg-transparent resize-none text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none max-h-24 leading-relaxed disabled:opacity-50"
          style={{ scrollbarWidth: 'none' }}
        />
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onToggleVoice}
            disabled={isProcessing}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 ${isListening ? 'animate-pulse' : ''}`}
            style={isListening
              ? { background: 'rgba(251,113,133,0.15)', color: '#fb7185', border: '1px solid rgba(251,113,133,0.3)' }
              : { color: 'var(--text-muted)' }}
          >
            {isListening ? <MicOff size={15} /> : <Mic size={15} />}
          </button>
          <button
            onClick={() => onSend()}
            disabled={!input.trim() || isProcessing}
            className="w-8 h-8 rounded-xl btn-primary flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
          >
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
