import React from 'react';

interface Props {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon, title, description, actionLabel, onAction }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
      <div className="text-6xl mb-6 opacity-80">{icon}</div>
      <h3 className="text-lg font-serif tracking-wider font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
        {title}
      </h3>
      <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'var(--color-muted)' }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-6 px-8 py-3 rounded-pill text-sm font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: 'var(--color-selected-bg)', color: 'var(--color-selected-text)' }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
