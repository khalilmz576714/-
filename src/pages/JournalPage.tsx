import React from 'react';
import { useTeaDiary } from '../context/TeaDiaryContext';
import EntryCard from '../components/cards/EntryCard';
import EmptyState from '../components/ui/EmptyState';
import ChipGroup from '../components/ui/ChipGroup';
import { PERIOD_LABELS, ICE_LABELS, SUGAR_LABELS } from '../types';

export default function JournalPage() {
  const { entries, state, stats, setFilter, openModal, toggleFavorite } = useTeaDiary();

  const periodChips = [
    { value: '__all__', label: '全部' },
    ...Object.entries(PERIOD_LABELS).map(([value, label]) => ({ value, label })),
  ];
  const iceChips = Object.entries(ICE_LABELS).map(([value, label]) => ({ value, label }));
  const sugarChips = Object.entries(SUGAR_LABELS).map(([value, label]) => ({ value, label }));

  return (
    <div className="pb-24">
      {/* Month summary bar */}
      <div className="px-4 pt-4 pb-2">
        <div className="rounded-card px-5 py-4 flex items-center justify-between"
          style={{ backgroundColor: 'var(--color-selected-bg)', color: 'var(--color-selected-text)' }}>
          <div>
            <div className="text-[10px] tracking-widest opacity-60">本月已喝</div>
            <div className="text-2xl font-bold font-serif mt-0.5">
              {stats.count} <span className="text-sm font-normal opacity-70">杯</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] tracking-widest opacity-60">总花费</div>
            <div className="text-2xl font-bold font-serif mt-0.5">¥{stats.totalSpent}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 py-3 space-y-3">
        <ChipGroup chips={periodChips} selected={state.filters.period || '__all__'} onChange={(v) => setFilter({ period: v === '__all__' ? null : v as any })} />
        <ChipGroup chips={iceChips} selected={state.filters.iceLevel} onChange={(v) => setFilter({ iceLevel: v as any })} />
        <ChipGroup chips={sugarChips} selected={state.filters.sugarLevel} onChange={(v) => setFilter({ sugarLevel: v as any })} />
      </div>

      {/* Entry list */}
      <div className="px-4 space-y-3">
        {entries.length === 0 ? (
          <EmptyState
            icon="🧋"
            title={state.entries.length === 0 ? '还没有记录' : '没有匹配的记录'}
            description={state.entries.length === 0 ? '开始记录今天喝的第一杯奶茶吧' : '试试调整筛选条件'}
            actionLabel={state.entries.length === 0 ? '添加记录' : '清除筛选'}
            onAction={() => state.entries.length === 0 ? openModal('add') : setFilter({ period: null, iceLevel: null, sugarLevel: null })}
          />
        ) : (
          entries.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              onTap={(id) => openModal('detail', id)}
              onToggleFavorite={toggleFavorite}
            />
          ))
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => openModal('add')}
        className="fixed right-5 bottom-24 w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg transition-transform active:scale-95 z-30"
        style={{ backgroundColor: 'var(--color-selected-bg)', color: 'var(--color-selected-text)' }}
      >
        +
      </button>
    </div>
  );
}
