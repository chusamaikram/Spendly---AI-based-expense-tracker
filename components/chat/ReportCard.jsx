import { FileText } from 'lucide-react';

export default function ReportCard({ report, meta }) {
  const lines = report.split('\n').filter(l => l.trim());

  const renderLine = (line, i) => {
    // Table row
    if (line.startsWith('|') && !line.startsWith('|---')) {
      const cells = line.split('|').filter(c => c.trim());
      if (cells.length === 2) {
        const isHeader = cells[0].trim().toLowerCase() === 'category';
        return isHeader ? null : (
          <div key={i} className="flex items-center justify-between py-2 border-b border-[var(--border-subtle)] last:border-0">
            <span className="text-sm text-[var(--text-secondary)] capitalize">{cells[0].trim()}</span>
            <span className="text-sm font-syne font-700 text-[var(--text-primary)]">{cells[1].trim()}</span>
          </div>
        );
      }
    }
    // Section header
    if (line.startsWith('**') && line.endsWith('**')) {
      return (
        <p key={i} className="text-xs font-syne font-700 text-[var(--text-muted)] uppercase tracking-widest mt-4 mb-2 first:mt-0">
          {line.replace(/\*\*/g, '')}
        </p>
      );
    }
    // Emoji summary lines
    if (/^[\u{1F000}-\u{1FFFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u.test(line)) {
      const [emoji, ...rest] = line.split(' ');
      const content    = rest.join(' ');
      const isBalance  = line.includes('Net Balance');
      const isIncome   = line.includes('Income:');
      const isExpense  = line.includes('Expenses:');
      const valueColor = isBalance
        ? (meta?.balance >= 0 ? '#34d399' : '#fb7185')
        : isIncome ? '#34d399' : isExpense ? '#fb7185' : 'var(--text-primary)';
      return (
        <div key={i} className="flex items-center justify-between py-1.5">
          <span className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
            <span>{emoji}</span>
            <span>{content.split(':')[0]}</span>
          </span>
          <span className="text-sm font-syne font-700" style={{ color: valueColor }}>
            {content.split(':')[1]?.trim()}
          </span>
        </div>
      );
    }
    // Numbered tips
    if (/^\d\./.test(line)) {
      return (
        <div key={i} className="flex gap-2 py-1">
          <span className="text-xs font-700 flex-shrink-0 mt-0.5" style={{ color: '#22d3ee' }}>
            {line.match(/^\d/)[0]}.
          </span>
          <span className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {line.replace(/^\d\.\s*/, '')}
          </span>
        </div>
      );
    }
    return <p key={i} className="text-sm text-[var(--text-secondary)] leading-relaxed">{line}</p>;
  };

  return (
    <div className="border rounded-2xl overflow-hidden min-w-[280px]"
      style={{ background: 'var(--bg-card)', borderColor: 'rgba(34,211,238,0.2)' }}>
      <div className="px-4 pt-3 pb-2 border-b flex items-center justify-between"
        style={{ borderColor: 'rgba(34,211,238,0.12)' }}>
        <div className="flex items-center gap-2">
          <FileText size={13} style={{ color: '#22d3ee' }} />
          <span className="text-xs font-mono font-medium" style={{ color: '#22d3ee' }}>Financial Report</span>
        </div>
        <span className="text-xs text-[var(--text-muted)] font-mono">{meta?.period || 'all time'}</span>
      </div>
      <div className="px-4 py-3">
        {lines.map((line, i) => renderLine(line, i))}
      </div>
    </div>
  );
}
