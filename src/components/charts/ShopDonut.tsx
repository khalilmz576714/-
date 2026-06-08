import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import type { Entry } from '../../types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  entries: Entry[];
}

const SHOP_COLORS = [
  '#C9A96E', '#D4C5B2', '#E8DCC8', '#B8954E',
  '#A68A4E', '#D4B896', '#C4A060', '#E0D0B0',
  '#BFA870', '#D8CCA0',
];

function computeShops(entries: Entry[]) {
  const map = new Map<string, number>();
  for (const e of entries) {
    const key = e.shop || '未标记';
    map.set(key, (map.get(key) || 0) + e.price);
  }
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
}

export default function ShopDonut({ entries }: Props) {
  const shops = computeShops(entries);

  if (shops.length === 0) return null;

  const total = shops.reduce((a, b) => a + b[1], 0);

  const data = {
    labels: shops.map(([name]) => name),
    datasets: [
      {
        data: shops.map(([, spent]) => spent),
        backgroundColor: SHOP_COLORS.slice(0, shops.length),
        borderColor: '#fff',
        borderWidth: 2,
        hoverBorderColor: '#fff',
        hoverBorderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: '62%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#4A3728',
        titleFont: { family: "'Georgia', serif" },
        bodyFont: { family: "'Georgia', serif" },
        callbacks: {
          label: (ctx: any) => {
            const pct = ((ctx.raw / total) * 100).toFixed(0);
            return ` ¥${ctx.raw} · ${pct}%`;
          },
        },
      },
    },
  };

  return (
    <div className="rounded-card p-4" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
      <div className="text-xs font-medium mb-3" style={{ color: 'var(--color-muted)' }}>
        🏪 店铺占比
      </div>
      <div className="flex items-center gap-3">
        <div style={{ width: 110, height: 110, flexShrink: 0 }}>
          <Doughnut data={data} options={options} />
        </div>
        <div className="flex-1 space-y-1.5">
          {shops.map(([name, spent], i) => (
            <div key={name} className="flex items-center gap-2 text-xs">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: SHOP_COLORS[i] }}
              />
              <span className="flex-1 truncate" style={{ color: 'var(--color-text)' }}>{name}</span>
              <span className="font-semibold" style={{ color: 'var(--color-accent)' }}>
                ¥{spent}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
