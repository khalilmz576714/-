import React from 'react';
import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import type { Entry } from '../../types';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler, Tooltip, Legend);

interface Props {
  entries: Entry[];
}

interface DayData {
  label: string;
  spent: number;
  count: number;
  prices: number[];
}

function computeDaily(entries: Entry[]): { labels: string[]; days: DayData[] } {
  const now = new Date();
  const days: DayData[] = [];

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const label = `${d.getMonth() + 1}/${d.getDate()}`;

    const prices: number[] = [];
    for (const e of entries) {
      if (e.drunkAt.slice(0, 10) === key) {
        prices.push(e.price);
      }
    }
    days.push({
      label,
      spent: prices.reduce((a, b) => a + b, 0),
      count: prices.length,
      prices,
    });
  }

  const step = Math.max(1, Math.floor(days.length / 6));
  const labels = days.map((d, i) =>
    i % step === 0 || i === days.length - 1 ? d.label : ''
  );

  return { labels, days };
}

export default function SpendingTrend({ entries }: Props) {
  const { labels, days } = computeDaily(entries);

  // Scatter points: each drink's price mapped to its day index
  const scatterData = days.flatMap((day, dayIndex) =>
    day.prices.map((price) => ({ x: dayIndex, y: price }))
  );

  const chartData = {
    labels,
    datasets: [
      {
        type: 'bar' as const,
        label: '日总花费',
        data: days.map((d) => d.spent),
        backgroundColor: 'rgba(201, 169, 110, 0.15)',
        borderColor: 'rgba(201, 169, 110, 0)',
        borderWidth: 0,
        borderRadius: 4,
        order: 2,
      },
      {
        type: 'scatter' as const,
        label: '单杯价格',
        data: scatterData,
        backgroundColor: '#C9A96E',
        borderColor: '#fff',
        borderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 8,
        order: 1,
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
        grid: { color: 'rgba(212, 197, 178, 0.12)' },
        ticks: {
          font: { size: 10, family: "'Georgia', serif" },
          color: '#9B8C7C',
          callback: (v: any) => '¥' + v,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          boxWidth: 10,
          padding: 14,
          font: { size: 10, family: "'Georgia', serif" },
          color: '#9B8C7C',
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: '#4A3728',
        titleFont: { family: "'Georgia', serif" },
        bodyFont: { family: "'Georgia', serif" },
      },
    },
  };

  const total = days.reduce((s, d) => s + d.spent, 0);
  const totalCount = days.reduce((s, d) => s + d.count, 0);

  return (
    <div className="rounded-card p-4" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>
          📈 近30天消费趋势
        </span>
        <span className="text-xs font-semibold" style={{ color: 'var(--color-accent)' }}>
          {totalCount}杯 · ¥{total}
        </span>
      </div>
      <Chart type="bar" data={chartData} options={options} />
    </div>
  );
}
