import React from 'react';

interface Props {
  label: string;
  value: string;
  subtitle?: string;
  accent?: boolean;
  comparison?: { label: string; diff: string; isPositive: boolean } | null;
}

export default function StatCard({ label, value, subtitle, accent = false, comparison }: Props) {
  return (
    <div
      className="rounded-card p-4 flex-1 min-w-[100px]"
      style={{
        backgroundColor: accent ? 'var(--color-selected-bg)' : 'var(--color-card)',
        border: accent ? 'none' : '1px solid var(--color-border)',
        color: accent ? 'var(--color-selected-text)' : 'var(--color-text)',
      }}
    >
      <div className="text-[10px] tracking-widest uppercase font-medium opacity-70">{label}</div>
      <div className="text-2xl font-bold mt-1 font-serif tracking-wide">{value}</div>
      {subtitle && <div className="text-[10px] mt-1 opacity-60">{subtitle}</div>}
      {comparison && (
        <div className="flex items-center gap-1 mt-2 text-[10px]">
          <span className="opacity-60">{comparison.label}</span>
          <span style={{ color: comparison.isPositive ? '#e8505b' : 'var(--color-accent)' }}>
            {comparison.isPositive ? '↑' : '↓'} {comparison.diff}
          </span>
        </div>
      )}
    </div>
  );
}
