import React from 'react';
import { useTeaDiary } from '../context/TeaDiaryContext';
import StatCard from '../components/cards/StatCard';
import ChipGroup from '../components/ui/ChipGroup';
import EmptyState from '../components/ui/EmptyState';
import TasteRadar from '../components/charts/TasteRadar';
import ShopDonut from '../components/charts/ShopDonut';
import SpendingTrend from '../components/charts/SpendingTrend';
import ErrorBoundary from '../components/ui/ErrorBoundary';
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

          {/* Custom date range */}
          {state.filters.period === 'custom' && (
            <div className="px-4 pb-3 flex gap-3 items-center">
              <input
                type="date"
                value={state.filters.customStart || ''}
                onChange={(e) => setFilter({ customStart: e.target.value || null })}
                max={new Date().toISOString().split('T')[0]}
                className="flex-1 px-3 py-2.5 rounded-xl text-sm border transition-colors"
                style={{
                  backgroundColor: 'var(--color-card)',
                  color: 'var(--color-text)',
                  borderColor: 'var(--color-border)',
                }}
              />
              <span style={{ color: 'var(--color-muted)' }}>至</span>
              <input
                type="date"
                value={state.filters.customEnd || ''}
                onChange={(e) => setFilter({ customEnd: e.target.value || null })}
                max={new Date().toISOString().split('T')[0]}
                className="flex-1 px-3 py-2.5 rounded-xl text-sm border transition-colors"
                style={{
                  backgroundColor: 'var(--color-card)',
                  color: 'var(--color-text)',
                  borderColor: 'var(--color-border)',
                }}
              />
            </div>
          )}

          {/* Stat cards */}
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
            <div className="px-4 mt-3">
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

          {/* Charts */}
          <div className="px-4 mt-4 space-y-3">
            <ErrorBoundary fallback={<div className="rounded-card p-4 text-xs" style={{backgroundColor:'var(--color-card)',border:'1px solid var(--color-border)',color:'var(--color-muted)'}}>📈 消费趋势加载失败</div>}>
              <SpendingTrend entries={entries} />
            </ErrorBoundary>
            <ErrorBoundary fallback={<div className="rounded-card p-4 text-xs" style={{backgroundColor:'var(--color-card)',border:'1px solid var(--color-border)',color:'var(--color-muted)'}}>🏪 店铺占比加载失败</div>}>
              <ShopDonut entries={entries} />
            </ErrorBoundary>
            <ErrorBoundary fallback={<div className="rounded-card p-4 text-xs" style={{backgroundColor:'var(--color-card)',border:'1px solid var(--color-border)',color:'var(--color-muted)'}}>🎯 口味画像加载失败</div>}>
              <TasteRadar entries={entries} />
            </ErrorBoundary>
          </div>
        </>
      )}
    </div>
  );
}
