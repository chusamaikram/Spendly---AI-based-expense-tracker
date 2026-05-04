'use client';

import { useEffect, useRef } from 'react';
import { formatCurrency } from '../../lib/utils/expenseParser';

export default function CategoryDonut({ data }) {
  const ref = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!data?.length || !ref.current) return;

    import('echarts').then(echarts => {
      if (chartRef.current) chartRef.current.dispose();
      const chart = echarts.init(ref.current, null, { renderer: 'svg' });
      chartRef.current = chart;

      chart.setOption({
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          backgroundColor: '#1e293b',
          borderColor: 'rgba(34,211,238,0.2)',
          textStyle: { color: '#f0f9ff', fontSize: 12 },
          formatter: p => `${p.marker}${p.name}<br/><b>${formatCurrency(p.value)}</b> (${p.percent}%)`,
        },
        legend: { show: false },
        series: [{
          type: 'pie',
          radius: ['52%', '78%'],
          center: ['35%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: { borderRadius: 6, borderColor: 'transparent', borderWidth: 2 },
          label: { show: false },
          emphasis: { label: { show: false }, itemStyle: { shadowBlur: 12, shadowColor: 'rgba(34,211,238,0.3)' } },
          data: data.slice(0, 6).map(d => ({
            name: d.label,
            value: d.total,
            itemStyle: { color: d.color },
          })),
        }],
        graphic: [{
          type: 'text',
          left: '28%',
          top: '44%',
          style: { text: 'Total', fill: 'rgba(240,249,255,0.4)', fontSize: 11, fontFamily: 'DM Sans' },
        }, {
          type: 'text',
          left: '22%',
          top: '52%',
          style: {
            text: `Rs.${(data.reduce((s, d) => s + d.total, 0) / 1000).toFixed(1)}k`,
            fill: '#f0f9ff', fontSize: 13, fontWeight: 'bold', fontFamily: 'Syne',
          },
        }],
      });

      const ro = new ResizeObserver(() => chart.resize());
      ro.observe(ref.current);
      return () => ro.disconnect();
    });

    return () => { chartRef.current?.dispose(); };
  }, [data]);

  if (!data?.length) return null;

  return (
    <div className="flex items-center gap-4">
      <div ref={ref} style={{ width: '180px', height: '160px', flexShrink: 0 }} />
      <div className="flex-1 space-y-2 min-w-0">
        {data.slice(0, 6).map(item => (
          <div key={item.category} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
            <div className="flex items-center justify-between flex-1 min-w-0 gap-2">
              <span className="text-xs text-[var(--text-secondary)] truncate">{item.label}</span>
              <span className="text-xs font-mono text-[var(--text-primary)] flex-shrink-0">{formatCurrency(item.total)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
