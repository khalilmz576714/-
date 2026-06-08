import type { Entry } from '../types';

export function exportAsJSON(entries: Entry[]): void {
  const json = JSON.stringify(entries, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  downloadBlob(blob, `奶茶日记_备份_${formatDate(new Date())}.json`);
}

export function exportAsCSV(entries: Entry[]): void {
  const headers = ['名称', '店铺', '价格', '冰量', '糖度', '杯型', '评分', '评价', '收藏', '日期'];
  const rows = entries.map((e) => [
    e.name,
    e.shop,
    e.price,
    iceMap(e.iceLevel),
    sugarMap(e.sugarLevel),
    e.cupSize ? cupSizeMap(e.cupSize) : '',
    e.rating,
    e.review,
    e.isFavorite ? '是' : '否',
    e.drunkAt.slice(0, 10),
  ]);
  const csv = [headers.join(','), ...rows.map((r) => r.map(quoteCSV).join(','))].join('\n');
  const bom = '﻿';
  const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8' });
  downloadBlob(blob, `奶茶日记_导出_${formatDate(new Date())}.csv`);
}

function quoteCSV(val: string | number): string {
  const s = String(val);
  return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
}

function iceMap(level: string): string {
  const m: Record<string, string> = { 'no-ice': '去冰', 'less-ice': '少冰', 'normal-ice': '正常冰', 'more-ice': '多冰' };
  return m[level] || level;
}

function sugarMap(level: string): string {
  const m: Record<string, string> = { 'no-sugar': '无糖', 'less-sugar': '三分糖', 'half-sugar': '半糖', 'normal-sugar': '正常糖', 'more-sugar': '多糖' };
  return m[level] || level;
}

function cupSizeMap(size: string): string {
  const m: Record<string, string> = { medium: '中杯', large: '大杯', xlarge: '超大杯' };
  return m[size] || size;
}

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
