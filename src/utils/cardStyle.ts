import type { Entry } from '../types';

export interface CardStyle {
  bg: string;
  cardBg: string;
  accentColor: string;
  textColor: string;
  mutedColor: string;
  tagBg: string;
  tagText: string;
  borderStyle: string;
  accentBar: { side: 'top' | 'left' | 'right' | null; color: string };
  decoration: string; // emoji decoration
  gradient: string;
}

// Name keywords → palette mapping
const PALETTES: Record<string, { bg: string; accent: string; text: string; deco: string }> = {
  '抹茶':  { bg: '#f2f7f0', accent: '#5b8c4e', text: '#3d5a2e', deco: '🍃' },
  '绿茶':  { bg: '#f4f9f2', accent: '#6b9e5a', text: '#4a6b3a', deco: '🍃' },
  '茉莉':  { bg: '#faf9f2', accent: '#c9b96e', text: '#5a4e2e', deco: '🌸' },
  '桂花':  { bg: '#fdf8f0', accent: '#d4a84b', text: '#5a3e1e', deco: '🌼' },
  '玫瑰':  { bg: '#fdf5f7', accent: '#c97a8a', text: '#5a2e3a', deco: '🌹' },
  '草莓':  { bg: '#fef5f5', accent: '#e08090', text: '#5a3038', deco: '🍓' },
  '莓':    { bg: '#fdf5f8', accent: '#d47090', text: '#5a3040', deco: '🫐' },
  '芒果':  { bg: '#fffaf0', accent: '#e0a830', text: '#5a4020', deco: '🥭' },
  '橙':    { bg: '#fff8f0', accent: '#e08840', text: '#5a3820', deco: '🍊' },
  '柠檬':  { bg: '#fefff0', accent: '#c8b820', text: '#4a4418', deco: '🍋' },
  '柚子':  { bg: '#fefff4', accent: '#b8a830', text: '#4a4018', deco: '🍊' },
  '葡萄':  { bg: '#f9f4fc', accent: '#9060b8', text: '#3a2050', deco: '🍇' },
  '蓝莓':  { bg: '#f6f4fc', accent: '#7060c0', text: '#2a1850', deco: '🫐' },
  '黑糖':  { bg: '#faf6f0', accent: '#8b6040', text: '#3a2010', deco: '🍯' },
  '焦糖':  { bg: '#faf5ed', accent: '#a07040', text: '#3a2010', deco: '🍮' },
  '巧克力':{ bg: '#faf6f2', accent: '#7b5040', text: '#3a1810', deco: '🍫' },
  '可可':  { bg: '#faf5f2', accent: '#805848', text: '#3a1810', deco: '🍫' },
  '珍珠':  { bg: '#faf6f0', accent: '#6b5040', text: '#3a2010', deco: '🫧' },
  '波霸':  { bg: '#faf6f0', accent: '#7b5040', text: '#3a2010', deco: '🫧' },
  '乌龙':  { bg: '#faf5ed', accent: '#8b6030', text: '#3a2010', deco: '🍂' },
  '红茶':  { bg: '#faf3ed', accent: '#904828', text: '#3a1808', deco: '🫖' },
  '普洱':  { bg: '#f8f3ec', accent: '#704828', text: '#3a1808', deco: '🍂' },
  '铁观音':{ bg: '#f6f4ec', accent: '#687040', text: '#2a2808', deco: '🍃' },
  '芝士':  { bg: '#fdfcf8', accent: '#c8b880', text: '#4a3828', deco: '🧀' },
  '奶盖':  { bg: '#fdfcf6', accent: '#d0c098', text: '#4a3828', deco: '🥛' },
  '椰':    { bg: '#fdfcf8', accent: '#a8a080', text: '#3a3028', deco: '🥥' },
  '西瓜':  { bg: '#fef6f6', accent: '#d06870', text: '#4a2028', deco: '🍉' },
  '蜜桃':  { bg: '#fef6f4', accent: '#e09890', text: '#4a2828', deco: '🍑' },
  '桃':    { bg: '#fef6f4', accent: '#e89890', text: '#4a2828', deco: '🍑' },
  '荔枝':  { bg: '#fefaf8', accent: '#d09088', text: '#4a2820', deco: '🍒' },
  '杨枝甘露':{ bg: '#fffaf0', accent: '#e8a830', text: '#4a3020', deco: '🥭' },
  '芋泥':  { bg: '#faf6f8', accent: '#9078a0', text: '#3a2040', deco: '🍠' },
  '芋':    { bg: '#faf6f8', accent: '#9878a8', text: '#3a2040', deco: '🍠' },
  '紫薯':  { bg: '#f9f5f9', accent: '#8868a0', text: '#381840', deco: '🍠' },
  '豆乳':  { bg: '#fdfaf6', accent: '#b89870', text: '#3a2818', deco: '🫘' },
  '红豆':  { bg: '#fdf6f4', accent: '#b86868', text: '#3a1818', deco: '🫘' },
  '绿豆':  { bg: '#f8faf4', accent: '#78a068', text: '#283818', deco: '🫘' },
  '咖啡':  { bg: '#faf6f2', accent: '#684838', text: '#281810', deco: '☕' },
  '拿铁':  { bg: '#faf7f2', accent: '#785840', text: '#381810', deco: '☕' },
};

function matchPalette(name: string) {
  const lower = name.toLowerCase();
  // Longest match first
  const matches = Object.entries(PALETTES)
    .filter(([key]) => lower.includes(key))
    .sort((a, b) => b[0].length - a[0].length);
  return matches[0]?.[1] || null;
}

// Simple string hash → deterministic number
function hashName(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h) + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

// Extract average color from a base64 image
export function extractImageColor(base64: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const size = 10; // sample at tiny resolution
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve(null); return; }
      ctx.drawImage(img, 0, 0, size, size);
      const data = ctx.getImageData(0, 0, size, size).data;
      let r = 0, g = 0, b = 0, count = 0;
      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
      }
      r = Math.round(r / count);
      g = Math.round(g / count);
      b = Math.round(b / count);
      // Lighten for background use
      r = Math.min(255, r + 80);
      g = Math.min(255, g + 70);
      b = Math.min(255, b + 60);
      resolve(`rgb(${r},${g},${b})`);
    };
    img.onerror = () => resolve(null);
    img.src = base64;
  });
}

// Lighten a hex color
function lightenHex(hex: string, amount: number): string {
  const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + amount);
  const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + amount);
  const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + amount);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export function generateCardStyle(entry: Entry, imageColor?: string | null): CardStyle {
  const palette = matchPalette(entry.name);
  const h = hashName(entry.name);

  if (palette) {
    // Named palette
    const accentBarSide = (['top', 'left', 'right', null] as const)[h % 4];
    const gradientAngles = ['135deg', '180deg', '90deg', '225deg'];
    const angle = gradientAngles[h % 4];

    return {
      bg: palette.bg,
      cardBg: palette.bg,
      accentColor: palette.accent,
      textColor: palette.text,
      mutedColor: lightenHex(palette.accent, 40),
      tagBg: imageColor || `${palette.accent}18`,
      tagText: palette.text,
      borderStyle: `2px solid ${palette.accent}20`,
      accentBar: { side: accentBarSide, color: palette.accent },
      decoration: palette.deco,
      gradient: `linear-gradient(${angle}, ${palette.bg} 0%, ${palette.bg} 60%, ${palette.accent}12 100%)`,
    };
  }

  // Fallback: generate from image color or wabi-sabi default
  if (imageColor) {
    const sides = (['left', 'right', null] as const);
    return {
      bg: imageColor,
      cardBg: imageColor,
      accentColor: '#C9A96E',
      textColor: '#4A3728',
      mutedColor: '#9B8C7C',
      tagBg: '#F0EBE3',
      tagText: '#4A3728',
      borderStyle: '1px solid var(--color-border)',
      accentBar: { side: sides[h % 3], color: '#C9A96E' },
      decoration: '🧋',
      gradient: `linear-gradient(135deg, ${imageColor} 0%, ${imageColor} 80%, #C9A96E18 100%)`,
    };
  }

  // Default wabi-sabi
  return {
    bg: 'var(--color-card)',
    cardBg: 'var(--color-card)',
    accentColor: 'var(--color-accent)',
    textColor: 'var(--color-text)',
    mutedColor: 'var(--color-muted)',
    tagBg: 'var(--color-surface-hover)',
    tagText: 'var(--color-text)',
    borderStyle: '1px solid var(--color-border)',
    accentBar: { side: null, color: '' },
    decoration: '🧋',
    gradient: 'none',
  };
}
