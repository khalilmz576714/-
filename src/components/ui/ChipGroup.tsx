import React from 'react';

interface Chip {
  value: string;
  label: string;
}

interface Props {
  chips: Chip[];
  selected: string | null;
  onChange: (value: string | null) => void;
  label?: string;
}

export default function ChipGroup({ chips, selected, onChange, label }: Props) {
  return (
    <div>
      {label && <div className="text-xs font-medium mb-2" style={{ color: 'var(--color-muted)' }}>{label}</div>}
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => {
          const isSelected = selected === chip.value;
          return (
            <button
              key={chip.value}
              onClick={() => onChange(isSelected ? null : chip.value)}
              className="px-4 py-2 rounded-pill text-xs font-medium transition-all"
              style={{
                backgroundColor: isSelected ? 'var(--color-selected-bg)' : 'var(--color-card)',
                color: isSelected ? 'var(--color-selected-text)' : 'var(--color-text)',
                borderColor: 'var(--color-border)',
                borderWidth: isSelected ? '0' : '1px',
              }}
            >
              {chip.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
