'use client';

import { useEffect, useRef } from 'react';
import { formatCurrency } from '../../lib/utils/expenseParser';

export default function SpendingBar({ data }) {
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
          trigger: 'axis',
          backgroundColor: '#1e293b',
          borderColor: 'rgba(34,211,238,0.2)',
          textStyle: { color: '#f0f9ff', fontSize: 12 },
          formatter: params => {
            let s = `<b>${params[0].axisValue}</b><br/>`;
            params.forEach(p => { s += `${p.marker}${p.seriesName}: <b>${formatCurrency(p.value)}</b><br/>`; });
            return s;
          },
        },
        legend: {
          data: ['Income', 'Expense'],
          textStyle: { color: 'rgba(240,249,255,0.5)', fontSize: 11 },
          top: 0, right: 0,
        },
        grid: { left: 0, right: 0, top: 30, bottom: 0, containLabel: true },
        xAxis: {
          type: 'category',
          data: data.map(d => d.label),
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { color: 'rgba(240,249,255,0.4)', fontSize: 11 },
        },
        yAxis: {
          type: 'value',
          splitLine: { lineStyle: { color: 'rgba(34,211,238,0.06)' } },
          axisLabel: { color: 'rgba(240,249,255,0.4)', fontSize: 10, formatter: v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v },
        },
        series: [
          {
            name: 'Income',
            type: 'bar',
            data: data.map(d => d.income || 0),
            barMaxWidth: 20,
            itemStyle: { color: '#34d399', borderRadius: [4, 4, 0, 0] },
            emphasis: { itemStyle: { color: '#6ee7b7' } },
          },
          {
            name: 'Expense',
            type: 'bar',
            data: data.map(d => d.expense || 0),
            barMaxWidth: 20,
            itemStyle: { color: '#fb7185', borderRadius: [4, 4, 0, 0] },
            emphasis: { itemStyle: { color: '#fda4af' } },
          },
        ],
      });

      const ro = new ResizeObserver(() => chart.resize());
      ro.observe(ref.current);
      return () => ro.disconnect();
    });

    return () => { chartRef.current?.dispose(); };
  }, [data]);

  if (!data?.length) return null;
  return <div ref={ref} style={{ width: '100%', height: '180px' }} />;
}
