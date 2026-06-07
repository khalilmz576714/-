import React from 'react';
import type { Entry } from '../../types';
import { ICE_LABELS, SUGAR_LABELS } from '../../types';
import StarRating from '../ui/StarRating';

interface Props {
  entry: Entry;
  onTap: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export default function EntryCard({ entry, onTap, onToggleFavorite }: Props) {
  const formattedDate = new Date(entry.drunkAt).toLocaleDateString('zh-CN', {
    month: 'numeric',
    day: 'numeric',
  });

  return (
    <div
      onClick={() => onTap(entry.id)}
      className="rounded-card p-4 cursor-pointer transition-all hover:opacity-90 active:scale-[0.98]"
      style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}
    >
      <div className="flex gap-3">
        {/* Image thumbnail */}
        <div
          className="w-[72px] h-[72px] rounded-xl flex-shrink-0 flex items-center justify-center text-3xl overflow-hidden"
          style={{ backgroundColor: 'var(--color-surface-hover)' }}
        >
          {entry.image ? (
            <img src={entry.image} alt={entry.name} className="w-full h-full object-cover" />
          ) : (
            <span>🧋</span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline">
            <h3 className="text-base font-medium truncate" style={{ color: 'var(--color-text)' }}>
              {entry.name}
            </h3>
            <span className="text-base font-semibold ml-2 flex-shrink-0" style={{ color: 'var(--color-accent)' }}>
              ¥{entry.price}
            </span>
          </div>

          <div className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
            {entry.shop ? `${entry.shop} · ` : ''}{formattedDate}
          </div>

          {/* Tags + Rating row */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span
              className="text-[10px] px-2.5 py-0.5 rounded-pill"
              style={{ backgroundColor: 'var(--color-surface-hover)', color: 'var(--color-text)' }}
            >
              {ICE_LABELS[entry.iceLevel]}
            </span>
            <span
              className="text-[10px] px-2.5 py-0.5 rounded-pill"
              style={{ backgroundColor: 'var(--color-surface-hover)', color: 'var(--color-text)' }}
            >
              {SUGAR_LABELS[entry.sugarLevel]}
            </span>

            <div className="ml-auto flex items-center gap-1">
              <StarRating value={entry.rating} readonly size="sm" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(entry.id);
                }}
                className="ml-2 text-lg transition-transform active:scale-125"
              >
                {entry.isFavorite ? '❤️' : '🤍'}
              </button>
            </div>
          </div>

          {/* Review preview */}
          {entry.review && (
            <p
              className="text-xs mt-2 leading-relaxed line-clamp-2"
              style={{ color: 'var(--color-muted)' }}
            >
              {entry.review}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
