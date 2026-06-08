import React from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = '搜索奶茶名称或店铺...' }: Props) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none">
        🔍
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border outline-none transition-colors"
        style={{
          backgroundColor: 'var(--color-card)',
          color: 'var(--color-text)',
          borderColor: 'var(--color-border)',
        }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
          style={{ color: 'var(--color-muted)' }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
