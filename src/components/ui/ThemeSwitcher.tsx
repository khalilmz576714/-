import React from 'react';
import type { Theme } from '../../types';
import { THEME_LABELS } from '../../types';

interface Props {
  current: Theme;
  onChange: (theme: Theme) => void;
}

const themes: Theme[] = ['wabisabi', 'matcha', 'dark'];

export default function ThemeSwitcher({ current, onChange }: Props) {
  return (
    <div className="flex gap-2 p-1 rounded-pill" style={{ backgroundColor: 'var(--color-card)' }}>
      {themes.map((t) => {
        const isSelected = current === t;
        return (
          <button
            key={t}
            onClick={() => onChange(t)}
            className="flex-1 py-2.5 px-4 rounded-pill text-xs font-medium transition-all"
            style={{
              backgroundColor: isSelected ? 'var(--color-selected-bg)' : 'transparent',
              color: isSelected ? 'var(--color-selected-text)' : 'var(--color-muted)',
            }}
          >
            {THEME_LABELS[t]}
          </button>
        );
      })}
    </div>
  );
}
