'use client';

export default function FilterChip({ label, active, onClick, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all border"
      style={
        active
          ? { background: 'rgba(34,211,238,0.12)', color: '#22d3ee', borderColor: 'rgba(34,211,238,0.3)' }
          : { background: 'var(--bg-glass)', color: 'var(--text-secondary)', borderColor: 'var(--border-subtle)' }
      }
    >
      {Icon && <Icon size={12} />}
      <span>{label}</span>
    </button>
  );
}
