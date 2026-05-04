'use client';

import { Brain, Plus, Trash2 } from 'lucide-react';

export default function ChatHistorySidebar({ sessions, activeChatId, loadingSessions, historyOpen, onNewChat, onLoadSession, onDeleteSession }) {
  return (
    <div
      className={`shrink-0 flex flex-col border-r border-[var(--border-subtle)] transition-all duration-300 ${historyOpen ? 'w-56' : 'w-0 overflow-hidden'}`}
      style={{ background: 'var(--bg-secondary)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--border-subtle)]">
        <span className="font-syne font-700 text-sm text-[var(--text-primary)]">History</span>
        <button
          onClick={onNewChat}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-[var(--bg-glass)]"
          style={{ color: '#22d3ee' }}
          title="New chat"
        >
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
            <div
              key={s.id}
              onClick={() => onLoadSession(s)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && onLoadSession(s)}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all group cursor-pointer"
              style={activeChatId === s.id
                ? { background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)' }
                : { border: '1px solid transparent' }}
            >
              <Brain
                size={13}
                className="flex-shrink-0"
                style={{ color: activeChatId === s.id ? '#22d3ee' : 'var(--text-muted)' }}
              />
              <span className="flex-1 text-xs text-[var(--text-secondary)] truncate">
                {s.title || 'Chat'}
              </span>
              <button
                onClick={e => onDeleteSession(e, s.id)}
                className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded flex items-center justify-center transition-all flex-shrink-0"
                style={{ color: '#fb7185' }}
              >
                <Trash2 size={11} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
