import React from 'react';
import { TeaDiaryProvider, useTeaDiary } from './context/TeaDiaryContext';
import TabBar from './components/ui/TabBar';
import Modal from './components/ui/Modal';
import StarRating from './components/ui/StarRating';
import JournalPage from './pages/JournalPage';
import FavoritesPage from './pages/FavoritesPage';
import SummaryPage from './pages/SummaryPage';
import EntryForm from './components/forms/EntryForm';
import SettingsPanel from './components/ui/SettingsPanel';
import { ICE_LABELS, SUGAR_LABELS, CUP_SIZE_LABELS } from './types';

function AppContent() {
  const { state, setTab, openModal, closeModal, addEntry, updateEntry, deleteEntry, toggleFavorite } = useTeaDiary();
  const editingEntry = state.editingId ? state.entries.find((e) => e.id === state.editingId) || null : null;

  const renderPage = () => {
    switch (state.activeTab) {
      case 'journal': return <JournalPage />;
      case 'favorites': return <FavoritesPage />;
      case 'summary': return <SummaryPage />;
    }
  };

  return (
    <div className="max-w-lg mx-auto min-h-screen relative" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Header */}
      <header className="px-4 pt-6 pb-2 flex items-center justify-between">
        <h1 className="text-xl font-serif tracking-wider font-semibold" style={{ color: 'var(--color-text)' }}>
          奶茶日记
        </h1>
        <button
          onClick={() => openModal('settings')}
          className="text-xl p-2 rounded-xl transition-colors"
          style={{ color: 'var(--color-muted)' }}
        >
          ⚙️
        </button>
      </header>

      {/* Page content */}
      <main>{renderPage()}</main>

      {/* Tab bar */}
      <TabBar
        activeTab={state.activeTab}
        onTabChange={setTab}
        favoriteCount={state.entries.filter((e) => e.isFavorite).length}
      />

      {/* DB Error warning */}
      {state.dbError && (
        <div className="fixed top-0 left-0 right-0 text-center py-2 text-xs z-50" style={{ backgroundColor: '#fee2e2', color: '#e8505b' }}>
          ⚠️ 数据库不可用，数据将无法持久保存
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={state.activeModal === 'add' || state.activeModal === 'edit'} onClose={closeModal} title={state.activeModal === 'edit' ? '编辑记录' : '新记录'}>
        <EntryForm
          initial={state.activeModal === 'edit' ? editingEntry : null}
          onSave={addEntry}
          onUpdate={updateEntry}
          onClose={closeModal}
        />
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={state.activeModal === 'detail'} onClose={closeModal} title="详情">
        {editingEntry && (
          <div className="px-5 py-6 space-y-5 max-w-lg mx-auto">
            {editingEntry.image && (
              <div className="rounded-2xl overflow-hidden">
                <img src={editingEntry.image} alt={editingEntry.name} className="w-full object-cover max-h-80" />
              </div>
            )}
            <div>
              <h2 className="text-2xl font-serif font-semibold" style={{ color: 'var(--color-text)' }}>{editingEntry.name}</h2>
              {editingEntry.shop && <div className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>{editingEntry.shop}</div>}
            </div>
            <div className="text-3xl font-bold font-serif" style={{ color: 'var(--color-accent)' }}>¥{editingEntry.price}</div>
            <div className="flex gap-2">
              <span className="text-sm px-3 py-1.5 rounded-pill" style={{ backgroundColor: 'var(--color-surface-hover)', color: 'var(--color-text)' }}>
                {ICE_LABELS[editingEntry.iceLevel]}
              </span>
              <span className="text-sm px-3 py-1.5 rounded-pill" style={{ backgroundColor: 'var(--color-surface-hover)', color: 'var(--color-text)' }}>
                {SUGAR_LABELS[editingEntry.sugarLevel]}
              </span>
              {editingEntry.cupSize && (
                <span className="text-sm px-3 py-1.5 rounded-pill" style={{ backgroundColor: 'var(--color-surface-hover)', color: 'var(--color-text)' }}>
                  {CUP_SIZE_LABELS[editingEntry.cupSize]}
                </span>
              )}
            </div>
            <StarRating value={editingEntry.rating} readonly size="lg" />
            {editingEntry.review && (
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text)' }}>{editingEntry.review}</p>
            )}
            <div className="text-xs" style={{ color: 'var(--color-muted)' }}>
              饮用日期: {new Date(editingEntry.drunkAt).toLocaleDateString('zh-CN')}
            </div>
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => { closeModal(); setTimeout(() => openModal('edit', editingEntry.id), 100); }}
                className="flex-1 py-3 rounded-xl text-sm font-medium transition-opacity hover:opacity-90"
                style={{ backgroundColor: 'var(--color-card)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
              >
                编辑
              </button>
              <button
                onClick={() => { if (confirm('确定删除这条记录吗？')) { deleteEntry(editingEntry.id); closeModal(); } }}
                className="flex-1 py-3 rounded-xl text-sm font-medium transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#fee2e2', color: '#e8505b' }}
              >
                删除
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Settings Modal */}
      <Modal isOpen={state.activeModal === 'settings'} onClose={closeModal} title="设置">
        <SettingsPanel />
      </Modal>
    </div>
  );
}

export default function App() {
  return (
    <TeaDiaryProvider>
      <AppContent />
    </TeaDiaryProvider>
  );
}
