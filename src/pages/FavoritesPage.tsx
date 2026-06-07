import React from 'react';
import { useTeaDiary } from '../context/TeaDiaryContext';
import EntryCard from '../components/cards/EntryCard';
import EmptyState from '../components/ui/EmptyState';

export default function FavoritesPage() {
  const { favorites, openModal, toggleFavorite } = useTeaDiary();

  return (
    <div className="pb-24">
      <div className="px-4 pt-6 pb-2">
        <h1 className="text-xl font-serif tracking-wider font-semibold" style={{ color: 'var(--color-text)' }}>
          我的收藏
        </h1>
        <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>
          {favorites.length > 0 ? `共 ${favorites.length} 杯心头好` : ''}
        </p>
      </div>

      <div className="px-4 space-y-3 mt-4">
        {favorites.length === 0 ? (
          <EmptyState
            icon="❤️"
            title="还没有收藏"
            description="在记录列表点击爱心，收藏你最喜欢的奶茶"
          />
        ) : (
          favorites.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              onTap={(id) => openModal('detail', id)}
              onToggleFavorite={toggleFavorite}
            />
          ))
        )}
      </div>
    </div>
  );
}
