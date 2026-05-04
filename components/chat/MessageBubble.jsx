import { Brain } from 'lucide-react';
import TransactionCard from './TransactionCard';
import ReportCard from './ReportCard';

export default function MessageBubble({ message }) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end bubble-in">
        <div className="max-w-[80%] rounded-2xl rounded-tr-sm px-4 py-3 border"
          style={{ background: 'rgba(34,211,238,0.08)', borderColor: 'rgba(34,211,238,0.15)' }}>
          <p className="text-sm text-[var(--text-primary)] leading-relaxed">{message.text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start bubble-in">
      <div className="max-w-[88%] space-y-2">

        {/* AI label */}
        <div className="flex items-center gap-1.5 px-1">
          <div className="w-4 h-4 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(34,211,238,0.15)' }}>
            <Brain size={9} style={{ color: '#22d3ee' }} />
          </div>
          <span className="text-xs font-mono" style={{ color: '#22d3ee' }}>Spendly AI</span>
        </div>

        {/* Reply text */}
        {message.text && (
          <div className="border border-[var(--border-subtle)] rounded-2xl rounded-tl-sm px-4 py-3"
            style={{ background: 'var(--bg-glass)' }}>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
              {message.text.split('**').map((part, i) =>
                i % 2 === 1
                  ? <strong key={i} className="text-[var(--text-primary)] font-semibold">{part}</strong>
                  : part
              )}
            </p>
          </div>
        )}

        {message.type === 'transaction' && message.expense && (
          <TransactionCard expense={message.expense} />
        )}
        {message.type === 'report' && message.report && (
          <ReportCard report={message.report} meta={message.meta} />
        )}
      </div>
    </div>
  );
}
