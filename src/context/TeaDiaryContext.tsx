import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { DiaryState, DiaryAction, Entry, EntryInput, Filters, Theme, Tab, ModalType, Stats } from '../types';
import { loadTheme, applyTheme } from '../utils/theme';
import { getFilteredEntries, computeStats } from '../utils/stats';
import { exportAsJSON, exportAsCSV } from '../utils/export';
import { loadAllEntries, addEntry as dbAdd, updateEntry as dbUpdate, deleteEntry as dbDelete, toggleFavorite as dbToggleFav, importEntries as dbImport } from '../db';

const initialState: DiaryState = {
  entries: [],
  activeTab: 'journal',
  activeModal: null,
  editingId: null,
  filters: { period: null, iceLevel: null, sugarLevel: null, cupSize: null, customStart: null, customEnd: null, search: '' },
  theme: 'wabisabi',
  dbReady: false,
  dbError: false,
};

function reducer(state: DiaryState, action: DiaryAction): DiaryState {
  switch (action.type) {
    case 'SET_ENTRIES':
      return { ...state, entries: action.payload };
    case 'ADD_ENTRY':
      return { ...state, entries: [action.payload, ...state.entries] };
    case 'UPDATE_ENTRY':
      return { ...state, entries: state.entries.map((e) => (e.id === action.payload.id ? action.payload : e)) };
    case 'DELETE_ENTRY':
      return { ...state, entries: state.entries.filter((e) => e.id !== action.payload) };
    case 'TOGGLE_FAVORITE':
      return { ...state, entries: state.entries.map((e) => (e.id === action.payload ? { ...e, isFavorite: !e.isFavorite } : e)) };
    case 'SET_TAB':
      return { ...state, activeTab: action.payload, filters: { ...initialState.filters } };
    case 'OPEN_MODAL':
      return { ...state, activeModal: action.payload.modal, editingId: action.payload.editingId || null };
    case 'CLOSE_MODAL':
      return { ...state, activeModal: null, editingId: null };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_DB_READY':
      return { ...state, dbReady: action.payload };
    case 'SET_DB_ERROR':
      return { ...state, dbError: action.payload };
    default:
      return state;
  }
}

interface TeaDiaryContextValue {
  state: DiaryState;
  dispatch: React.Dispatch<DiaryAction>;
  entries: Entry[];
  favorites: Entry[];
  stats: Stats;
  addEntry: (input: EntryInput) => Promise<void>;
  updateEntry: (id: string, input: Partial<EntryInput>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  exportData: (format: 'json' | 'csv') => void;
  importData: (file: File) => Promise<{ added: number; skipped: number }>;
  setFilter: (filters: Partial<Filters>) => void;
  setTheme: (theme: Theme) => void;
  setTab: (tab: Tab) => void;
  openModal: (modal: ModalType, editingId?: string) => void;
  closeModal: () => void;
}

const TeaDiaryContext = createContext<TeaDiaryContextValue | null>(null);

export function TeaDiaryProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load theme on mount
  useEffect(() => {
    const theme = loadTheme();
    dispatch({ type: 'SET_THEME', payload: theme });
    applyTheme(theme);
  }, []);

  // Load entries from DB on mount
  useEffect(() => {
    loadAllEntries()
      .then((entries) => {
        dispatch({ type: 'SET_ENTRIES', payload: entries });
        dispatch({ type: 'SET_DB_READY', payload: true });
      })
      .catch(() => {
        dispatch({ type: 'SET_DB_ERROR', payload: true });
      });
  }, []);

  const entries = getFilteredEntries(state.entries, state.filters);
  const favorites = state.entries.filter((e) => e.isFavorite);
  const stats = computeStats(state.entries, state.entries, state.filters);

  const addEntry = useCallback(async (input: EntryInput) => {
    const entry = await dbAdd(input);
    dispatch({ type: 'ADD_ENTRY', payload: entry });
  }, []);

  const updateEntry = useCallback(async (id: string, input: Partial<EntryInput>) => {
    const updated = await dbUpdate(id, input);
    if (updated) dispatch({ type: 'UPDATE_ENTRY', payload: updated });
  }, []);

  const deleteEntry = useCallback(async (id: string) => {
    await dbDelete(id);
    dispatch({ type: 'DELETE_ENTRY', payload: id });
  }, []);

  const toggleFavorite = useCallback(async (id: string) => {
    const updated = await dbToggleFav(id);
    if (updated) dispatch({ type: 'TOGGLE_FAVORITE', payload: id });
  }, []);

  const exportData = useCallback((format: 'json' | 'csv') => {
    if (format === 'json') exportAsJSON(state.entries);
    else exportAsCSV(state.entries);
  }, [state.entries]);

  const importData = useCallback(async (file: File) => {
    const text = await file.text();
    const data = JSON.parse(text);
    if (!Array.isArray(data)) throw new Error('无效的备份文件格式');
    const result = await dbImport(data);
    const all = await loadAllEntries();
    dispatch({ type: 'SET_ENTRIES', payload: all });
    return result;
  }, []);

  const setFilter = useCallback((filters: Partial<Filters>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  const setTheme = useCallback((theme: Theme) => {
    dispatch({ type: 'SET_THEME', payload: theme });
    applyTheme(theme);
  }, []);

  const setTab = useCallback((tab: Tab) => {
    dispatch({ type: 'SET_TAB', payload: tab });
  }, []);

  const openModal = useCallback((modal: ModalType, editingId?: string) => {
    dispatch({ type: 'OPEN_MODAL', payload: { modal, editingId } });
  }, []);

  const closeModal = useCallback(() => {
    dispatch({ type: 'CLOSE_MODAL' });
  }, []);

  const value: TeaDiaryContextValue = {
    state, dispatch, entries, favorites, stats,
    addEntry, updateEntry, deleteEntry, toggleFavorite,
    exportData, importData, setFilter, setTheme, setTab,
    openModal, closeModal,
  };

  return (
    <TeaDiaryContext.Provider value={value}>
      {children}
    </TeaDiaryContext.Provider>
  );
}

export function useTeaDiary(): TeaDiaryContextValue {
  const ctx = useContext(TeaDiaryContext);
  if (!ctx) throw new Error('useTeaDiary must be used within TeaDiaryProvider');
  return ctx;
}
