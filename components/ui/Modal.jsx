'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ children, onClose, title, icon: Icon, accentColor = '#22d3ee', maxWidth = 'max-w-md' }) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative w-full ${maxWidth} border rounded-3xl overflow-hidden`}
        style={{ background: 'var(--bg-secondary)', borderColor: `${accentColor}20`, boxShadow: `0 0 50px ${accentColor}08` }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}25` }}>
                <Icon size={15} style={{ color: accentColor }} />
              </div>
            )}
            {title && <h2 className="font-syne font-700 text-base text-[var(--text-primary)]">{title}</h2>}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            style={{ background: 'var(--bg-glass)' }}
          >
            <X size={15} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
