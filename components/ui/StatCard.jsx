export default function StatCard({ label, value, sub, icon: Icon, color, bg, border, loading }) {
  return (
    <div
      className="rounded-2xl p-5 transition-all hover:-translate-y-0.5"
      style={{ background: bg, border: `1px solid ${border}` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: color + '20', border: `1px solid ${color}30` }}
        >
          <Icon size={17} style={{ color }} />
        </div>
      </div>
      <p className="text-xs text-[var(--text-muted)] mb-1">{label}</p>
      <p className="font-syne font-700 text-xl mb-1" style={{ color: loading ? 'var(--text-muted)' : color }}>
        {loading ? '—' : value}
      </p>
      <p className="text-xs text-[var(--text-muted)]">{sub}</p>
    </div>
  );
}
