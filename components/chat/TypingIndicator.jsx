'use client';

import { Brain } from 'lucide-react';

export default function TypingIndicator() {
  return (
    <div className="flex justify-start bubble-in">
      <div className="border border-[var(--border-subtle)] rounded-2xl rounded-tl-sm px-4 py-3"
        style={{ background: 'var(--bg-glass)' }}>
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
