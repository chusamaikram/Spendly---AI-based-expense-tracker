'use client';

import { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';

export default function SplashScreen({ label = 'Loading...' }) {
  const [progress, setProgress] = useState(0);
  const [dots, setDots]         = useState('');

  // Animate progress bar
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 90) { clearInterval(timer); return 90; }
        return p + Math.random() * 12;
      });
    }, 180);
    return () => clearInterval(timer);
  }, []);

  // Animate dots
  useEffect(() => {
    const timer = setInterval(() => {
      setDots(d => d.length >= 3 ? '' : d + '.');
    }, 400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-[120px]"
          style={{ background: 'rgba(34,211,238,0.08)' }} />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full blur-[100px]"
          style={{ background: 'rgba(129,140,248,0.05)' }} />
        <div className="grid-bg absolute inset-0" />
      </div>

      {/* Content */}
      <div className="relative flex flex-col items-center gap-8">

        {/* Logo with pulse rings */}
        <div className="relative flex items-center justify-center">
          {/* Outer pulse ring */}
          <div className="absolute w-24 h-24 rounded-full animate-ping"
            style={{ background: 'rgba(34,211,238,0.06)', animationDuration: '2s' }} />
          {/* Middle ring */}
          <div className="absolute w-20 h-20 rounded-full animate-ping"
            style={{ background: 'rgba(34,211,238,0.08)', animationDuration: '2s', animationDelay: '0.3s' }} />
          {/* Logo circle */}
          <div
            className="relative w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #22d3ee, #0891b2)',
              boxShadow: '0 0 40px rgba(34,211,238,0.4)',
            }}
          >
            <Zap size={28} className="text-slate-950 fill-current" />
          </div>
        </div>

        {/* Brand name */}
        <div className="flex flex-col items-center gap-1">
          <h1 className="font-syne font-800 text-3xl text-[var(--text-primary)] tracking-tight">
            Spendly
          </h1>
          <p className="text-xs font-mono text-[var(--text-muted)]">
            AI-powered finance tracker
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-48 flex flex-col items-center gap-3">
          <div className="w-full h-0.5 rounded-full overflow-hidden"
            style={{ background: 'rgba(34,211,238,0.1)' }}>
            <div
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #22d3ee, #2dd4bf)',
                boxShadow: '0 0 8px rgba(34,211,238,0.6)',
              }}
            />
          </div>
          <span className="text-xs font-mono text-[var(--text-muted)]">
            {label}{dots}
          </span>
        </div>

      </div>
    </div>
  );
}
