import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import type { Entry } from '../../types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface Props {
  entries: Entry[];
}

function computeDaily(entries: Entry[]) {
  const now = new Date();
  const days: { label: string; spent: number; count: number }[] = [];

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const label = `${d.getMonth() + 1}/${d.getDate()}`;

    let spent = 0;
    let count = 0;
    for (const e of entries) {
      if (e.drunkAt.slice(0, 10) === key) {
        spent += e.price;
        count++;
      }
    }
    days.push({ label, spent, count });
  }

  // Thin out labels to ~6
  const step = Math.max(1, Math.floor(days.length / 6));
  const labels = days.map((d, i) => (i % step === 0 || i === days.length - 1) ? d.label : '');

  return { labels, data: days };
}

export default function SpendingTrend({ entries }: Props) {
  const { labels, data: days } = computeDaily(entries);

  const chartData = {
    labels,
    datasets: [
      {
        label: '消费金额',
        data: days.map(d => d.spent),
        borderColor: '#C9A96E',
        backgroundColor: (ctx: any) => {
          if (!ctx.chart.chartArea) return 'rgba(201,169,110,0.08)';
          const gradient = ctx.chart.ctx.createLinearGradient(
            0, ctx.chart.chartArea.top, 0, ctx.chart.chartArea.bottom
          );
          gradient.addColorStop(0, 'rgba(201, 169, 110, 0.25)');
          gradient.addColorStop(1, 'rgba(201, 169, 110, 0.02)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: (ctx: any) => ctx.raw > 0 ? 4 : 0,
        pointBackgroundColor: '#C9A96E',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { size: 10, family: "'Georgia', serif" },
          color: '#9B8C7C',
          maxRotation: 0,
        },
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(212, 197, 178, 0.15)' },
        ticks: {
          font: { size: 10, family: "'Georgia', serif" },
          color: '#9B8C7C',
          callback: (v: any) => '¥' + v,
          stepSize: 10,
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#4A3728',
        titleFont: { family: "'Georgia', serif" },
        bodyFont: { family: "'Georgia', serif" },
        callbacks: {
          label: (ctx: any) => {
            const day = days[ctx.dataIndex];
            return ` ¥${day.spent} · ${day.count}杯`;
          },
        },
      },
    },
  };

  const total = days.reduce((s, d) => s + d.spent, 0);

  return (
    <div className="rounded-card p-4" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>
          📈 近30天消费趋势
        </span>
        <span className="text-xs font-semibold" style={{ color: 'var(--color-accent)' }}>
          合计 ¥{total}
        </span>
      </div>
      <Line data={chartData} options={options} />
    </div>
  );
}
