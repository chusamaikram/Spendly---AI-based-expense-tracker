'use client';
 
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../lib/hooks/useTheme';
 
export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
 
  return (
    <button
      onClick={toggleTheme}
      className={`w-9 h-9 rounded-xl glass border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-glow)] transition-all ${className}`}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}