import React from 'react';

interface Props {
  value: string;
  onChange: (date: string) => void;
}

export default function DatePicker({ value, onChange }: Props) {
  return (
    <div>
      <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--color-muted)' }}>饮用日期</label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        max={new Date().toISOString().slice(0, 10)}
        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors"
        style={{
          backgroundColor: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text)',
        }}
      />
    </div>
  );
}
