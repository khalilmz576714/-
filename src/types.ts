export type IceLevel = 'no-ice' | 'less-ice' | 'normal-ice' | 'more-ice';
export type SugarLevel = 'no-sugar' | 'less-sugar' | 'half-sugar' | 'normal-sugar' | 'more-sugar';
export type Theme = 'wabisabi' | 'matcha' | 'dark';
export type Tab = 'journal' | 'favorites' | 'summary';
export type ModalType = 'add' | 'edit' | 'detail' | 'settings' | null;
export type Period = 'week' | 'month' | '30days' | 'custom';

export interface Entry {
  id: string;
  name: string;
  shop: string;
  price: number;
  image: string | null;
  iceLevel: IceLevel;
  sugarLevel: SugarLevel;
  rating: number;
  review: string;
  isFavorite: boolean;
  drunkAt: string;
  createdAt: string;
}

export type EntryInput = Omit<Entry, 'id' | 'createdAt'>;

export interface Filters {
  period: Period | null;
  iceLevel: IceLevel | null;
  sugarLevel: SugarLevel | null;
  customStart: string | null;
  customEnd: string | null;
}

export interface Stats {
  totalSpent: number;
  count: number;
  avgPrice: number;
  maxPrice: number;
  maxPriceEntry: Entry | null;
  comparison: {
    currentLabel: string;
    previousLabel: string;
    currentSpent: number;
    previousSpent: number;
    currentCount: number;
    previousCount: number;
    spentDiff: number;
    countDiff: number;
  } | null;
}

export interface DiaryState {
  entries: Entry[];
  activeTab: Tab;
  activeModal: ModalType;
  editingId: string | null;
  filters: Filters;
  theme: Theme;
  dbReady: boolean;
  dbError: boolean;
}

export type DiaryAction =
  | { type: 'SET_ENTRIES'; payload: Entry[] }
  | { type: 'ADD_ENTRY'; payload: Entry }
  | { type: 'UPDATE_ENTRY'; payload: Entry }
  | { type: 'DELETE_ENTRY'; payload: string }
  | { type: 'SET_TAB'; payload: Tab }
  | { type: 'OPEN_MODAL'; payload: { modal: ModalType; editingId?: string } }
  | { type: 'CLOSE_MODAL' }
  | { type: 'SET_FILTERS'; payload: Partial<Filters> }
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_DB_READY'; payload: boolean }
  | { type: 'SET_DB_ERROR'; payload: boolean }
  | { type: 'TOGGLE_FAVORITE'; payload: string };

export const ICE_LABELS: Record<IceLevel, string> = {
  'no-ice': '去冰',
  'less-ice': '少冰',
  'normal-ice': '正常冰',
  'more-ice': '多冰',
};

export const SUGAR_LABELS: Record<SugarLevel, string> = {
  'no-sugar': '无糖',
  'less-sugar': '三分糖',
  'half-sugar': '半糖',
  'normal-sugar': '正常糖',
  'more-sugar': '多糖',
};

export const THEME_LABELS: Record<Theme, string> = {
  wabisabi: '侘寂米',
  matcha: '抹茶绿',
  dark: '暗夜黑',
};

export const PERIOD_LABELS: Record<Period, string> = {
  week: '本周',
  month: '本月',
  '30days': '近30天',
  custom: '自定义',
};
