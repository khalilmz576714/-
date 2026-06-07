import type { Theme } from '../types';

const THEME_KEY = 'tea-diary-theme';

export function loadTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'wabisabi' || stored === 'matcha' || stored === 'dark') return stored;
  } catch { /* noop */ }
  return 'wabisabi';
}

export function saveTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch { /* noop */ }
}

export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme);
  saveTheme(theme);
}
