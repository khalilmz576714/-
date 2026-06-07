import React, { useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: Props) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="flex items-center justify-between px-4 h-14 border-b flex-shrink-0" style={{ borderColor: 'var(--color-border)' }}>
        <button onClick={onClose} className="text-lg px-2" style={{ color: 'var(--color-muted)' }}>
          ✕
        </button>
        {title && (
          <h2 className="text-lg font-serif tracking-wider font-semibold" style={{ color: 'var(--color-text)' }}>
            {title}
          </h2>
        )}
        <div className="w-10" />
      </div>
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
