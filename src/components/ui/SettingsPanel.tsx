import React, { useRef, useState } from 'react';
import { useTeaDiary } from '../../context/TeaDiaryContext';
import ThemeSwitcher from './ThemeSwitcher';

export default function SettingsPanel() {
  const { state, setTheme, exportData, importData } = useTeaDiary();
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleImport = async (file: File) => {
    try {
      const result = await importData(file);
      alert(`导入完成！新增 ${result.added} 条，跳过 ${result.skipped} 条（重复 ID）`);
    } catch {
      alert('导入失败，请检查是否为有效的奶茶日记 JSON 备份文件');
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await handleImport(file);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) await handleImport(file);
  };

  // Share backup via Web Share API (mobile-friendly, can send to WeChat/Email/AirDrop etc.)
  const handleShare = async () => {
    const json = JSON.stringify(state.entries, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const file = new File([blob], `奶茶日记_备份_${new Date().toISOString().slice(0, 10)}.json`, { type: 'application/json' });

    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          title: '奶茶日记备份',
          text: '奶茶日记数据备份，在另一台设备导入即可同步',
          files: [file],
        });
      } catch {
        // User cancelled — fall through to download
        exportData('json');
      }
    } else {
      // Fallback: download directly
      exportData('json');
      alert('已下载备份文件。请将文件发送到另一台设备，在设置中点击"导入备份"即可同步。');
    }
  };

  return (
    <div className="px-5 py-6 space-y-6 max-w-lg mx-auto">
      {/* Sync section — most prominent */}
      <div>
        <h2 className="text-lg font-serif font-semibold mb-1" style={{ color: 'var(--color-text)' }}>
          🔄 跨设备同步
        </h2>
        <p className="text-xs mb-4 leading-relaxed" style={{ color: 'var(--color-muted)' }}>
          数据保存在本设备浏览器中，不同设备之间的数据是独立的。使用下方功能可轻松转移数据。
        </p>

        {/* Step guide */}
        <div className="rounded-card p-4 mb-4 space-y-2 text-xs leading-relaxed" style={{ backgroundColor: 'var(--color-surface-hover)' }}>
          <div className="flex gap-2">
            <span style={{ color: 'var(--color-accent)', minWidth: '1.2rem' }}>①</span>
            <span style={{ color: 'var(--color-text)' }}>在<b>旧设备</b>点击「分享/导出备份」</span>
          </div>
          <div className="flex gap-2">
            <span style={{ color: 'var(--color-accent)', minWidth: '1.2rem' }}>②</span>
            <span style={{ color: 'var(--color-text)' }}>通过微信/邮件/AirDrop 发送到<b>新设备</b></span>
          </div>
          <div className="flex gap-2">
            <span style={{ color: 'var(--color-accent)', minWidth: '1.2rem' }}>③</span>
            <span style={{ color: 'var(--color-text)' }}>在<b>新设备</b>打开奶茶日记，点击下方导入</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleShare}
            className="w-full py-3.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
            style={{ backgroundColor: 'var(--color-selected-bg)', color: 'var(--color-selected-text)' }}
          >
            <span>📤</span> 分享 / 导出备份
          </button>

          {/* Drag & drop import zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className="w-full py-5 rounded-xl text-center cursor-pointer transition-all border-2 border-dashed"
            style={{
              backgroundColor: dragOver ? 'var(--color-surface-hover)' : 'var(--color-card)',
              borderColor: dragOver ? 'var(--color-accent)' : 'var(--color-border)',
            }}
          >
            <div className="text-2xl mb-1">📥</div>
            <div className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>导入备份</div>
            <div className="text-[10px] mt-0.5" style={{ color: 'var(--color-muted)' }}>点击选择文件或拖拽 JSON 文件到此处</div>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>

      <hr style={{ borderColor: 'var(--color-border)' }} />

      {/* CSV export — secondary */}
      <div>
        <button
          onClick={() => exportData('csv')}
          className="w-full py-3.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: 'var(--color-card)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
        >
          📊 导出 CSV 表格（不含图片）
        </button>
      </div>

      <hr style={{ borderColor: 'var(--color-border)' }} />

      {/* Theme */}
      <div>
        <h2 className="text-lg font-serif font-semibold mb-2" style={{ color: 'var(--color-text)' }}>主题</h2>
        <ThemeSwitcher current={state.theme} onChange={setTheme} />
      </div>

      <hr style={{ borderColor: 'var(--color-border)' }} />

      <div className="text-center">
        <div className="text-lg font-serif tracking-wider font-semibold" style={{ color: 'var(--color-text)' }}>
          奶茶日记
        </div>
        <div className="text-[10px] mt-1 leading-relaxed" style={{ color: 'var(--color-muted)' }}>
          数据仅保存在本设备浏览器中 · 请定期备份
        </div>
      </div>
    </div>
  );
}
