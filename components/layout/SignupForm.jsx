'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { signUpWithEmail, signInWithGoogle } from '../../lib/firebase/auth';
import SecurityBadge from '../ui/SecurityBadge';

const RULES = [
  { test: v => v.length >= 8,    label: '8+ characters' },
  { test: v => /[A-Z]/.test(v),  label: 'Uppercase' },
  { test: v => /[0-9]/.test(v),  label: 'Number' },
];

const STRENGTH_COLORS = ['#dc2626', '#f59e0b', '#22d3ee'];
const STRENGTH_LABELS = ['Weak', 'Fair', 'Strong'];

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

export default function SignupForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [pwdFocused, setPwdFocused] = useState(false);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signUpWithEmail(form.email, form.password, form.name);
      router.push('/dashboard');
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setGoogleLoading(false);
    }
  };

  const strength = RULES.filter(r => r.test(form.password)).length;

  return (
    <div className="w-full max-w-sm">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-syne font-700 text-3xl text-[var(--text-primary)] mb-2">Create account</h1>
        <p className="text-sm text-[var(--text-muted)]">Start tracking your finances for free</p>
      </div>

      {/* Card */}
      <div className="card p-6 space-y-5" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>

        {/* Google */}
        <button
          onClick={handleGoogle}
          disabled={loading || googleLoading}
          className="w-full  flex items-center justify-center gap-3 py-3 rounded-xl border border-[var(--border-subtle)] text-sm font-medium text-[var(--text-primary)] transition-all hover:border-[var(--border-glow)] hover:bg-[var(--bg-glass)] disabled:opacity-50"
          
        >
          {googleLoading
            ? <div className="w-4 h-4 border-2 border-[var(--border-subtle)] border-t-[var(--accent)] rounded-full animate-spin" />
            : <GoogleIcon />}
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[var(--border-subtle)]" />
          <span className="text-xs text-[var(--text-muted)] px-1">or</span>
          <div className="flex-1 h-px bg-[var(--border-subtle)]" />
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-sm px-4 py-3 rounded-xl"
            style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', color: '#dc2626' }}>
            <AlertCircle size={14} className="flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-secondary)]">Full Name</label>
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                name="name" type="text" placeholder="Your name"
                value={form.name} onChange={handleChange} required
                className="input-field !pl-10"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-secondary)]">Email</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                name="email" type="email" placeholder="you@example.com"
                value={form.email} onChange={handleChange} required
                className="input-field !pl-10"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-secondary)]">Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                name="password" type={showPwd ? 'text' : 'password'} placeholder="Create a password"
                value={form.password} onChange={handleChange} required
                onFocus={() => setPwdFocused(true)} onBlur={() => setPwdFocused(false)}
                className="input-field !pl-10 pr-10"
              />
              <button type="button" onClick={() => setShowPwd(p => !p)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
                {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {/* Strength indicator */}
            {(pwdFocused || form.password) && (
              <div className="space-y-2">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
                      style={{ background: i < strength ? STRENGTH_COLORS[strength - 1] : 'var(--border-subtle)' }} />
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    {RULES.map(({ test, label }) => (
                      <span key={label} className="flex items-center gap-1 text-xs transition-colors"
                        style={{ color: test(form.password) ? 'var(--accent)' : 'var(--text-muted)' }}>
                        <CheckCircle2 size={10} />
                        {label}
                      </span>
                    ))}
                  </div>
                  {form.password && (
                    <span className="text-xs font-medium" style={{ color: STRENGTH_COLORS[strength - 1] }}>
                      {STRENGTH_LABELS[strength - 1] || ''}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading || googleLoading}
            className="btn-primary w-full py-3 rounded-xl text-sm font-syne font-700 flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none">
            {loading
              ? <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
              : <>Create Account <ArrowRight size={15} /></>}
          </button>
        </form>
      </div>

      {/* Footer */}
      <p className="text-center text-sm text-[var(--text-muted)] mt-6">
        Already have an account?{' '}
        <Link href="/login" className="font-medium transition-colors hover:opacity-80" style={{ color: 'var(--accent)' }}>
          Sign in
        </Link>
      </p>

      <SecurityBadge />
    </div>
  );
}

function friendlyError(code) {
  const map = {
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/weak-password': 'Password is too weak.',
    'auth/network-request-failed': 'Network error. Check your connection.',
  };
  return map[code] || 'Something went wrong. Please try again.';
}
