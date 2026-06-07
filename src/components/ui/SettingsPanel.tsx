import React from 'react';
import { useTeaDiary } from '../../context/TeaDiaryContext';
import ThemeSwitcher from './ThemeSwitcher';

export default function SettingsPanel() {
  const { state, setTheme, exportData, importData } = useTeaDiary();

  const handleImport = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const result = await importData(file);
        alert(`导入完成！新增 ${result.added} 条，跳过 ${result.skipped} 条`);
      } catch {
        alert('导入失败，请检查文件格式');
      }
    };
    input.click();
  };

  return (
    <div className="px-5 py-6 space-y-6 max-w-lg mx-auto">
      <div>
        <h2 className="text-lg font-serif font-semibold mb-2" style={{ color: 'var(--color-text)' }}>主题</h2>
        <ThemeSwitcher current={state.theme} onChange={setTheme} />
      </div>

      <hr style={{ borderColor: 'var(--color-border)' }} />

      <div>
        <h2 className="text-lg font-serif font-semibold mb-3" style={{ color: 'var(--color-text)' }}>数据管理</h2>
        <div className="space-y-3">
          <button
            onClick={() => exportData('json')}
            className="w-full py-3.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--color-selected-bg)', color: 'var(--color-selected-text)' }}
          >
            导出 JSON 备份
          </button>
          <button
            onClick={() => exportData('csv')}
            className="w-full py-3.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--color-card)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
          >
            导出 CSV（不含图片）
          </button>
          <button
            onClick={handleImport}
            className="w-full py-3.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--color-card)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
          >
            导入 JSON 备份
          </button>
        </div>
      </div>

      <hr style={{ borderColor: 'var(--color-border)' }} />

      <div className="text-center">
        <div className="text-lg font-serif tracking-wider font-semibold" style={{ color: 'var(--color-text)' }}>
          奶茶日记
        </div>
        <div className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>
          数据仅保存在本设备浏览器中
        </div>
      </div>
    </div>
  );
}
