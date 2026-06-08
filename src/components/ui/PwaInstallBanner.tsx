import React, { useEffect, useState } from 'react';

function isPwa(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches
    || (navigator as any).standalone === true;
}

type BrowserKind = 'chrome' | 'safari-ios' | 'safari-mac' | 'firefox' | 'samsung' | 'edge' | 'other';

function detectBrowser(): BrowserKind {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua)) return 'safari-ios';
  if (/Mac/.test(ua) && /Safari/.test(ua) && !/Chrome/.test(ua)) return 'safari-mac';
  if (/SamsungBrowser/i.test(ua)) return 'samsung';
  if (/Firefox/i.test(ua)) return 'firefox';
  if (/Edg/i.test(ua)) return 'edge';
  if (/Chrome/i.test(ua)) return 'chrome';
  return 'other';
}

const GUIDES: Record<BrowserKind, { text: string; canInstall: boolean }> = {
  'chrome':    { text: '点下方「安装」→ 添加到主屏幕', canInstall: true },
  'edge':      { text: '点下方「安装」→ 添加到主屏幕', canInstall: true },
  'samsung':   { text: '点下方「安装」→ 添加到主屏幕', canInstall: true },
  'safari-ios':{ text: '点底部 ↑ 分享 → 添加到主屏幕', canInstall: false },
  'safari-mac':{ text: '点菜单栏 文件 → 添加到程序坞', canInstall: false },
  'firefox':   { text: '点地址栏 ⋯ → 添加到主屏幕', canInstall: false },
  'other':     { text: '收藏到书签，或从设置下载离线版', canInstall: false },
};

export default function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const browser = detectBrowser();
  const guide = GUIDES[browser];

  useEffect(() => {
    if (isPwa()) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // Fallback: show after delay if no install prompt fired
    const t = setTimeout(() => {
      if (!deferredPrompt) setShowBanner(true);
    }, 2500);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      clearTimeout(t);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setShowBanner(false);
      setDeferredPrompt(null);
    }
  };

  if (!showBanner || dismissed) return null;

  return (
    <div
      className="mx-4 mt-3 px-4 py-3 rounded-card flex items-center gap-3 text-sm"
      style={{
        backgroundColor: 'var(--color-selected-bg)',
        color: 'var(--color-selected-text)',
      }}
    >
      <span className="text-lg">📲</span>
      <span className="flex-1 font-medium leading-snug">{guide.text}</span>
      {guide.canInstall && deferredPrompt ? (
        <button
          onClick={handleInstall}
          className="px-4 py-1.5 rounded-pill text-xs font-semibold whitespace-nowrap transition-opacity hover:opacity-85"
          style={{ backgroundColor: 'var(--color-selected-text)', color: 'var(--color-selected-bg)' }}
        >
          安装
        </button>
      ) : (
        <button
          onClick={() => setDismissed(true)}
          className="text-lg leading-none opacity-60"
        >
          ✕
        </button>
      )}
    </div>
  );
}
