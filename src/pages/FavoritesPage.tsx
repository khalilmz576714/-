import React, { useState } from 'react';
import { useTeaDiary } from '../context/TeaDiaryContext';
import EntryCard from '../components/cards/EntryCard';
import EmptyState from '../components/ui/EmptyState';
import SearchBar from '../components/ui/SearchBar';

export default function FavoritesPage() {
  const { favorites, openModal, toggleFavorite } = useTeaDiary();
  const [search, setSearch] = useState('');

  const filtered = search
    ? favorites.filter((e) =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.shop.toLowerCase().includes(search.toLowerCase())
      )
    : favorites;

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

      {favorites.length > 0 && (
        <div className="px-4 pb-1">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="搜索收藏的奶茶..."
          />
        </div>
      )}

      <div className="px-4 space-y-3 mt-4">
        {favorites.length === 0 ? (
          <EmptyState
            icon="❤️"
            title="还没有收藏"
            description="在记录列表点击爱心，收藏你最喜欢的奶茶"
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="没有匹配的收藏"
            description="试试换一个关键词"
          />
        ) : (
          filtered.map((entry) => (
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
