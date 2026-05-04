export default function Skeleton({ className = '', style = {} }) {
  return (
    <div
      className={`rounded-xl shimmer-bg ${className}`}
      style={{ background: 'var(--bg-glass)', ...style }}
    />
  );
}
