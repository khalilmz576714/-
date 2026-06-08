import React, { useEffect, useState } from 'react';

// Detect if already running as PWA
function isPwa(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches
    || (navigator as any).standalone === true;
}

// Detect if on iOS
function isIOS(): boolean {
  return /iPhone|iPad|iPod/.test(navigator.userAgent);
}

export default function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (isPwa()) return;

    // Chrome / Android: listen for beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // iOS: always show after a short delay
    if (isIOS()) {
      const t = setTimeout(() => setShowBanner(true), 2000);
      return () => clearTimeout(t);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === 'accepted') {
        setShowBanner(false);
      }
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
      <span className="flex-1 font-medium">
        {isIOS() ? '点分享按钮 → 添加到主屏幕' : '添加到主屏幕，像 App 一样使用'}
      </span>
      {deferredPrompt ? (
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
