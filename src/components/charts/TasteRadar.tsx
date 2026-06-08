import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import type { Entry } from '../../types';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface Props {
  entries: Entry[];
}

function computeProfile(entries: Entry[]) {
  if (entries.length === 0) return null;

  // Sugar level → 0-100 score
  const sugarOrder = ['no-sugar', 'less-sugar', 'half-sugar', 'normal-sugar', 'more-sugar'];
  const sugarScores = entries.map(e => (sugarOrder.indexOf(e.sugarLevel) / (sugarOrder.length - 1)) * 100);
  const avgSugar = sugarScores.reduce((a, b) => a + b, 0) / sugarScores.length;

  // Ice level → 0-100 score
  const iceOrder = ['no-ice', 'less-ice', 'normal-ice', 'more-ice'];
  const iceScores = entries.map(e => (iceOrder.indexOf(e.iceLevel) / (iceOrder.length - 1)) * 100);
  const avgIce = iceScores.reduce((a, b) => a + b, 0) / iceScores.length;

  // Average price → normalize to 0-100 (cap at ¥40)
  const avgPrice = entries.reduce((a, b) => a + b.price, 0) / entries.length;
  const priceScore = Math.min(100, (avgPrice / 40) * 100);

  // Average rating → 0-100
  const avgRating = entries.reduce((a, b) => a + b.rating, 0) / entries.length;
  const ratingScore = (avgRating / 5) * 100;

  // Frequency (entries per week over last 30 days) → normalize
  const now = Date.now();
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
  const recentEntries = entries.filter(e => new Date(e.drunkAt).getTime() >= thirtyDaysAgo);
  const freqPerWeek = (recentEntries.length / 30) * 7;
  const freqScore = Math.min(100, (freqPerWeek / 7) * 100);

  return {
    labels: ['甜度', '冰量', '均价', '评分', '频次'],
    data: [
      Math.round(avgSugar),
      Math.round(avgIce),
      Math.round(priceScore),
      Math.round(ratingScore),
      Math.round(freqScore),
    ],
  };
}

export default function TasteRadar({ entries }: Props) {
  const profile = computeProfile(entries);

  if (!profile) return null;

  const data = {
    labels: profile.labels,
    datasets: [
      {
        label: '你的口味',
        data: profile.data,
        backgroundColor: 'rgba(201, 169, 110, 0.12)',
        borderColor: '#C9A96E',
        borderWidth: 2,
        pointBackgroundColor: '#C9A96E',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          display: false,
          stepSize: 20,
        },
        grid: {
          color: 'rgba(212, 197, 178, 0.2)',
        },
        angleLines: {
          color: 'rgba(212, 197, 178, 0.2)',
        },
        pointLabels: {
          font: { size: 13, family: "'Georgia', 'Noto Serif SC', serif" },
          color: '#4A3728',
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
          label: (ctx: any) => ` ${ctx.raw} 分`,
        },
      },
    },
  };

  return (
    <div className="rounded-card p-4" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
      <div className="text-xs font-medium mb-3" style={{ color: 'var(--color-muted)' }}>
        🎯 口味画像
      </div>
      <div style={{ maxWidth: 280, margin: '0 auto' }}>
        <Radar data={data} options={options} />
      </div>
    </div>
  );
}
