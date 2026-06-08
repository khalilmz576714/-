import type { Entry, Stats, Filters } from '../types';

function getPeriodRange(period: Filters['period'], customStart: string | null, customEnd: string | null): { start: Date; end: Date } | null {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  let start: Date;

  switch (period) {
    case 'week': {
      const day = now.getDay();
      const mondayOffset = day === 0 ? -6 : 1 - day;
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + mondayOffset);
      break;
    }
    case 'month':
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case '30days':
      start = new Date(now);
      start.setDate(start.getDate() - 30);
      break;
    case 'custom':
      if (customStart && customEnd) {
        return { start: new Date(customStart), end: new Date(customEnd + 'T23:59:59') };
      }
      return null;
    default:
      return null;
  }
  start.setHours(0, 0, 0, 0);
  return { start, end };
}

function filterByPeriod(entries: Entry[], filters: Filters): Entry[] {
  if (!filters.period) return entries;
  const range = getPeriodRange(filters.period, filters.customStart, filters.customEnd);
  if (!range) return entries;
  return entries.filter((e) => {
    const d = new Date(e.drunkAt);
    return d >= range.start && d <= range.end;
  });
}

export function getFilteredEntries(entries: Entry[], filters: Filters): Entry[] {
  let result = filterByPeriod(entries, filters);
  if (filters.iceLevel) {
    result = result.filter((e) => e.iceLevel === filters.iceLevel);
  }
  if (filters.sugarLevel) {
    result = result.filter((e) => e.sugarLevel === filters.sugarLevel);
  }
  if (filters.cupSize) {
    result = result.filter((e) => e.cupSize === filters.cupSize);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (e) => e.name.toLowerCase().includes(q) || e.shop.toLowerCase().includes(q)
    );
  }
  return result;
}

export function computeStats(entries: Entry[], allEntries: Entry[], filters: Filters): Stats {
  const filtered = getFilteredEntries(entries, filters);
  const totalSpent = filtered.reduce((sum, e) => sum + e.price, 0);
  const count = filtered.length;
  const avgPrice = count > 0 ? Math.round((totalSpent / count) * 100) / 100 : 0;
  let maxPrice = 0;
  let maxPriceEntry: Entry | null = null;
  for (const e of filtered) {
    if (e.price > maxPrice) {
      maxPrice = e.price;
      maxPriceEntry = e;
    }
  }

  let comparison: Stats['comparison'] = null;
  if (filters.period === 'week') {
    comparison = buildComparison(allEntries, 'week');
  } else if (filters.period === 'month') {
    comparison = buildComparison(allEntries, 'month');
  }

  return { totalSpent, count, avgPrice, maxPrice, maxPriceEntry, comparison };
}

function buildComparison(entries: Entry[], period: 'week' | 'month'): Stats['comparison'] {
  const now = new Date();
  let currentStart: Date, previousStart: Date, previousEnd: Date;

  if (period === 'week') {
    const day = now.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;
    currentStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + mondayOffset);
    currentStart.setHours(0, 0, 0, 0);
    previousEnd = new Date(currentStart.getTime() - 1);
    previousStart = new Date(previousEnd);
    previousStart.setDate(previousStart.getDate() - 6);
    previousStart.setHours(0, 0, 0, 0);
  } else {
    currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
    currentStart.setHours(0, 0, 0, 0);
    previousEnd = new Date(currentStart.getTime() - 1);
    previousStart = new Date(previousEnd.getFullYear(), previousEnd.getMonth(), 1);
    previousStart.setHours(0, 0, 0, 0);
  }

  const currentEntries = entries.filter((e) => {
    const d = new Date(e.drunkAt);
    return d >= currentStart && d <= now;
  });
  const previousEntries = entries.filter((e) => {
    const d = new Date(e.drunkAt);
    return d >= previousStart && d <= previousEnd;
  });

  const currentSpent = currentEntries.reduce((s, e) => s + e.price, 0);
  const previousSpent = previousEntries.reduce((s, e) => s + e.price, 0);

  return {
    currentLabel: period === 'week' ? '本周' : '本月',
    previousLabel: period === 'week' ? '上周' : '上月',
    currentSpent,
    previousSpent,
    currentCount: currentEntries.length,
    previousCount: previousEntries.length,
    spentDiff: currentSpent - previousSpent,
    countDiff: currentEntries.length - previousEntries.length,
  };
}
