import React from 'react';

interface Props {
  value: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = { sm: 'text-sm', md: 'text-xl', lg: 'text-3xl' };

export default function StarRating({ value, onChange, readonly = false, size = 'md' }: Props) {
  return (
    <div className={`flex gap-1 ${sizeMap[size]}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`transition-colors ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
          style={{ color: star <= value ? 'var(--color-accent)' : 'var(--color-border)' }}
        >
          {star <= value ? '★' : '☆'}
        </button>
      ))}
    </div>
  );
}
