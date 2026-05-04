'use client';

export default function Button({
  children, onClick, type = 'button', variant = 'primary',
  size = 'md', disabled = false, loading = false, className = '', icon: Icon,
}) {
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2.5 text-sm', lg: 'px-6 py-3.5 text-base' };

  const variants = {
    primary: 'btn-primary',
    ghost: 'btn-ghost',
    danger: 'border border-[var(--border-subtle)] text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all',
    income: 'border text-emerald-400 hover:bg-emerald-500/10 transition-all',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`rounded-xl font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-syne ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {loading
        ? <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
        : Icon && <Icon size={size === 'sm' ? 13 : size === 'lg' ? 18 : 15} />}
      {children}
    </button>
  );
}
