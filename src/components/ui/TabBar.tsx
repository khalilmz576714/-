import React from 'react';
import type { Tab } from '../../types';

interface Props {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  favoriteCount: number;
}

const tabs: { key: Tab; label: string; icon: string }[] = [
  { key: 'journal', label: '日记', icon: '📔' },
  { key: 'favorites', label: '收藏', icon: '❤️' },
  { key: 'summary', label: '汇总', icon: '📊' },
];

export default function TabBar({ activeTab, onTabChange, favoriteCount }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-lg mx-auto flex justify-around items-center h-16 px-4 pb-safe">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => onTabChange(t.key)}
            className="flex flex-col items-center gap-0.5 relative px-4 py-1 transition-colors"
          >
            <span className="text-xl">{t.icon}</span>
            <span
              className="text-xs font-medium"
              style={{ color: activeTab === t.key ? 'var(--color-accent)' : 'var(--color-muted)' }}
            >
              {t.label}
            </span>
            {t.key === 'favorites' && favoriteCount > 0 && (
              <span className="absolute -top-1 right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-bold text-white"
                style={{ backgroundColor: 'var(--color-accent)' }}
              >
                {favoriteCount}
              </span>
            )}
            {activeTab === t.key && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                style={{ backgroundColor: 'var(--color-accent)' }}
              />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
