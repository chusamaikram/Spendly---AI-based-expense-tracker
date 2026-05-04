import { ShieldCheck } from 'lucide-react';

export default function SecurityBadge() {
  return (
    <div className="flex items-center justify-center gap-4 mt-6">
      {/* App Check badge */}
      <div className="flex items-center gap-1.5">
        <ShieldCheck size={13} style={{ color: '#34d399' }} />
        <span className="text-xs text-[var(--text-muted)]">App Check</span>
      </div>

      <div className="w-px h-3 bg-[var(--border-subtle)]" />

      {/* Firebase badge */}
      <div className="flex items-center gap-1.5">
        <svg width="13" height="13" viewBox="0 0 32 32" fill="none">
          <path d="M5.85 23.5L10.9 3.7a.6.6 0 011.15.05l2.95 8.6 1.6-3.05a.6.6 0 011.08 0L26.15 23.5H5.85z" fill="#FFA000"/>
          <path d="M18.1 17.15l-3.1-9.05-9.15 15.4 12.25-6.35z" fill="#F57F17"/>
          <path d="M26.15 23.5l-4.4-14.8a.6.6 0 00-1.1-.05L5.85 23.5l8.55 4.8a3 3 0 002.9 0l8.85-4.8z" fill="#FFCA28"/>
          <path d="M21.75 8.7a.6.6 0 00-1.1-.05L5.85 23.5l8.55 4.8a3 3 0 001.45.4V9.1l-.1-.4z" fill="#FFA000"/>
        </svg>
        <span className="text-xs text-[var(--text-muted)]">Firebase</span>
      </div>

      <div className="w-px h-3 bg-[var(--border-subtle)]" />

      {/* reCAPTCHA badge */}
      <div className="flex items-center gap-1.5">
        <svg width="13" height="13" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="32" fill="#4A90D9"/>
          <path d="M32 12C21 12 12 21 12 32s9 20 20 20 20-9 20-20S43 12 32 12zm0 36c-8.8 0-16-7.2-16-16S23.2 16 32 16s16 7.2 16 16-7.2 16-16 16z" fill="white"/>
          <path d="M32 24v8l6 3" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        </svg>
        <span className="text-xs text-[var(--text-muted)]">reCAPTCHA v3</span>
      </div>
    </div>
  );
}
