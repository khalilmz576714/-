import React from 'react';
import { useTeaDiary } from '../context/TeaDiaryContext';
import StatCard from '../components/cards/StatCard';
import ChipGroup from '../components/ui/ChipGroup';
import EmptyState from '../components/ui/EmptyState';
import type { Period } from '../types';
import { PERIOD_LABELS } from '../types';

export default function SummaryPage() {
  const { stats, state, setFilter, entries } = useTeaDiary();

  const periodChips = Object.entries(PERIOD_LABELS).map(([value, label]) => ({
    value: value as Period,
    label,
  }));

  const hasData = state.entries.length > 0;

  return (
    <div className="pb-24">
      <div className="px-4 pt-6 pb-2">
        <h1 className="text-xl font-serif tracking-wider font-semibold" style={{ color: 'var(--color-text)' }}>
          消费汇总
        </h1>
      </div>

      {!hasData ? (
        <EmptyState icon="📊" title="还没有数据" description="先记录几杯奶茶再来看统计吧" />
      ) : (
        <>
          {/* Period selector */}
          <div className="px-4 py-3">
            <ChipGroup
              chips={periodChips}
              selected={state.filters.period}
              onChange={(v) => setFilter({ period: v as Period | null })}
            />
          </div>

          {/* Stat cards grid */}
          <div className="px-4 flex gap-3 flex-wrap">
            <StatCard label="总花费" value={`¥${stats.totalSpent}`} subtitle={`${stats.count} 杯`} accent />
            <StatCard label="均价" value={`¥${stats.avgPrice}`} />
            <div className="flex gap-3 w-full">
              <StatCard
                label="最贵一杯"
                value={stats.maxPriceEntry ? `¥${stats.maxPrice}` : '-'}
                subtitle={stats.maxPriceEntry?.name || ''}
              />
              <StatCard label="杯数" value={`${stats.count}`} />
            </div>
          </div>

          {/* Comparison */}
          {stats.comparison && (
            <div className="px-4 mt-4">
              <div className="rounded-card p-4" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
                <div className="text-xs font-medium mb-3" style={{ color: 'var(--color-muted)' }}>
                  {stats.comparison.currentLabel} vs {stats.comparison.previousLabel}
                </div>
                <div className="flex gap-6">
                  <div>
                    <div className="text-[10px] opacity-50" style={{ color: 'var(--color-muted)' }}>花费变化</div>
                    <div className="text-lg font-semibold font-serif" style={{
                      color: stats.comparison.spentDiff > 0 ? '#e8505b' : stats.comparison.spentDiff < 0 ? 'var(--color-accent)' : 'var(--color-muted)',
                    }}>
                      {stats.comparison.spentDiff > 0 ? '+' : ''}{stats.comparison.spentDiff < 0 ? '-' : ''}¥{Math.abs(stats.comparison.spentDiff)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] opacity-50" style={{ color: 'var(--color-muted)' }}>杯数变化</div>
                    <div className="text-lg font-semibold font-serif" style={{
                      color: stats.comparison.countDiff > 0 ? '#e8505b' : stats.comparison.countDiff < 0 ? 'var(--color-accent)' : 'var(--color-muted)',
                    }}>
                      {stats.comparison.countDiff > 0 ? '+' : ''}{stats.comparison.countDiff}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Shop breakdown */}
          <div className="px-4 mt-4">
            <div className="rounded-card p-4" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
              <div className="text-xs font-medium mb-3" style={{ color: 'var(--color-muted)' }}>按店铺分布</div>
              {(() => {
                const shopMap = new Map<string, { count: number; spent: number }>();
                for (const e of entries) {
                  const key = e.shop || '未标记';
                  const cur = shopMap.get(key) || { count: 0, spent: 0 };
                  cur.count++;
                  cur.spent += e.price;
                  shopMap.set(key, cur);
                }
                const shops = [...shopMap.entries()].sort((a, b) => b[1].spent - a[1].spent);
                if (shops.length === 0) return <div className="text-xs" style={{ color: 'var(--color-muted)' }}>暂无数据</div>;
                return shops.slice(0, 5).map(([name, data]) => (
                  <div key={name} className="flex items-center justify-between py-2 border-b last:border-b-0" style={{ borderColor: 'var(--color-border)' }}>
                    <span className="text-sm" style={{ color: 'var(--color-text)' }}>{name}</span>
                    <span className="text-sm font-medium" style={{ color: 'var(--color-accent)' }}>
                      ¥{data.spent} <span className="text-xs opacity-50">{data.count}杯</span>
                    </span>
                  </div>
                ));
              })()}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
