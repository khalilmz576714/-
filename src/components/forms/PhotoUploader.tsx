import React, { useRef, useState } from 'react';
import { compressImage } from '../../utils/image';

interface Props {
  currentImage: string | null;
  onImageChange: (base64: string | null) => void;
}

export default function PhotoUploader({ currentImage, onImageChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    try {
      const base64 = await compressImage(file);
      onImageChange(base64);
    } catch (err: any) {
      setError(err.message || '图片处理失败');
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleFile} className="hidden" />

      <div
        onClick={() => fileRef.current?.click()}
        className="w-28 h-28 rounded-2xl flex items-center justify-center cursor-pointer transition-opacity hover:opacity-80 overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface-hover)', border: '2px dashed var(--color-border)' }}
      >
        {currentImage ? (
          <img src={currentImage} alt="preview" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center">
            <div className="text-3xl">📸</div>
            <div className="text-[10px] mt-1" style={{ color: 'var(--color-muted)' }}>拍照/选图</div>
          </div>
        )}
      </div>

      {currentImage && (
        <button
          onClick={() => onImageChange(null)}
          className="text-xs underline" style={{ color: 'var(--color-muted)' }}
        >
          移除图片
        </button>
      )}

      {error && <div className="text-xs" style={{ color: '#e8505b' }}>{error}</div>}
    </div>
  );
}
