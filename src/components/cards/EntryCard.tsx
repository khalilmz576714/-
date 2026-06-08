import React, { useEffect, useState } from 'react';
import type { Entry } from '../../types';
import { ICE_LABELS, SUGAR_LABELS, CUP_SIZE_LABELS } from '../../types';
import { generateCardStyle, extractImageColor } from '../../utils/cardStyle';
import type { CardStyle } from '../../utils/cardStyle';
import StarRating from '../ui/StarRating';

interface Props {
  entry: Entry;
  onTap: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export default function EntryCard({ entry, onTap, onToggleFavorite }: Props) {
  const [imageColor, setImageColor] = useState<string | null>(null);

  useEffect(() => {
    if (entry.image) {
      extractImageColor(entry.image).then(setImageColor);
    }
  }, [entry.image]);

  const style: CardStyle = generateCardStyle(entry, imageColor);
  const hasAccentTop = style.accentBar.side === 'top';
  const hasAccentLeft = style.accentBar.side === 'left';
  const hasAccentRight = style.accentBar.side === 'right';

  const formattedDate = new Date(entry.drunkAt).toLocaleDateString('zh-CN', {
    month: 'numeric',
    day: 'numeric',
  });

  return (
    <div
      onClick={() => onTap(entry.id)}
      className="rounded-card cursor-pointer transition-all hover:opacity-95 active:scale-[0.98] relative overflow-hidden"
      style={{
        background: style.gradient || style.bg,
        border: style.borderStyle,
        boxShadow: `0 1px 4px rgba(0,0,0,0.04)`,
      }}
    >
      {/* Accent bar — top */}
      {hasAccentTop && (
        <div style={{ height: '3px', background: style.accentColor, opacity: 0.6 }} />
      )}

      <div className="flex">
        {/* Accent bar — left */}
        {hasAccentLeft && (
          <div style={{ width: '4px', flexShrink: 0, background: style.accentColor, opacity: 0.5, borderRadius: '0 4px 4px 0' }} />
        )}

        <div className="flex-1 p-4 min-w-0">
          <div className="flex gap-3">
            {/* Image thumbnail */}
            <div
              className="w-[68px] h-[68px] rounded-xl flex-shrink-0 flex items-center justify-center text-3xl overflow-hidden"
              style={{ backgroundColor: imageColor ? `${imageColor}40` : style.tagBg }}
            >
              {entry.image ? (
                <img src={entry.image} alt={entry.name} className="w-full h-full object-cover" />
              ) : (
                <span>{style.decoration}</span>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h3 className="text-base font-semibold truncate" style={{ color: style.textColor }}>
                  {style.decoration} {entry.name}
                </h3>
                <span className="text-base font-bold ml-2 flex-shrink-0 font-serif" style={{ color: style.accentColor }}>
                  ¥{entry.price}
                </span>
              </div>

              <div className="text-[11px] mt-0.5" style={{ color: style.mutedColor }}>
                {entry.shop ? `${entry.shop} · ` : ''}{formattedDate}
              </div>

              {/* Tags */}
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <span className="text-[10px] px-2 py-0.5 rounded-pill" style={{ backgroundColor: style.tagBg, color: style.tagText }}>
                  {ICE_LABELS[entry.iceLevel]}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-pill" style={{ backgroundColor: style.tagBg, color: style.tagText }}>
                  {SUGAR_LABELS[entry.sugarLevel]}
                </span>
                {entry.cupSize && (
                  <span className="text-[10px] px-2 py-0.5 rounded-pill" style={{ backgroundColor: style.tagBg, color: style.tagText }}>
                    {CUP_SIZE_LABELS[entry.cupSize]}
                  </span>
                )}

                <div className="ml-auto flex items-center gap-1">
                  <StarRating value={entry.rating} readonly size="sm" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(entry.id);
                    }}
                    className="ml-1.5 text-lg transition-transform active:scale-125"
                  >
                    {entry.isFavorite ? '❤️' : '🤍'}
                  </button>
                </div>
              </div>

              {/* Review preview */}
              {entry.review && (
                <p className="text-[11px] mt-1.5 leading-relaxed line-clamp-2" style={{ color: style.mutedColor }}>
                  {entry.review}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Accent bar — right */}
        {hasAccentRight && (
          <div style={{ width: '4px', flexShrink: 0, background: style.accentColor, opacity: 0.5, borderRadius: '4px 0 0 4px' }} />
        )}
      </div>
    </div>
  );
}
