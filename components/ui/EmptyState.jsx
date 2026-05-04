export default function EmptyState({ emoji = '📊', message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-3">
      <div
        className="w-10 h-10 rounded-full border border-[var(--border-subtle)] flex items-center justify-center text-lg"
        style={{ background: 'var(--bg-glass)' }}
      >
        {emoji}
      </div>
      <p className="text-sm text-[var(--text-muted)] text-center">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="text-xs font-medium transition-colors hover:opacity-80"
          style={{ color: '#22d3ee' }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
