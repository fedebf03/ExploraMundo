const WISHLIST_KEY = 'exploramundo_wishlist';
const HISTORY_KEY = 'exploramundo_history';

export interface WishlistItem {
  id: string;
  countryCode: string;
  countryName: string;
  flag: string;
  priority: number;
  category: string;
  note?: string;
  createdAt: string;
}

export interface HistoryItem {
  id: string;
  countryCode: string;
  countryName: string;
  flag: string;
  visitedAt: string;
}

// helpers de localStorage
function getItem<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

function setItem<T>(key: string, value: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

// favoritos


export function getWishlist(): WishlistItem[] {
  return getItem<WishlistItem>(WISHLIST_KEY).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function isCountryInWishlist(countryCode: string): boolean {
  const code = countryCode.trim().toUpperCase();
  return getWishlist().some((item) => item.countryCode.toUpperCase() === code);
}

export function addToWishlist(item: Omit<WishlistItem, 'id' | 'createdAt'>): WishlistItem {
  const current = getWishlist();
  const existing = current.find((x) => x.countryCode === item.countryCode);

  const entry: WishlistItem = {
    ...item,
    id: existing ? existing.id : `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: existing ? existing.createdAt : new Date().toISOString(),
  };

  const next = [entry, ...current.filter((x) => x.countryCode !== item.countryCode)];
  setItem(WISHLIST_KEY, next);
  return entry;
}

export function removeFromWishlist(id: string): void {
  setItem(WISHLIST_KEY, getWishlist().filter((x) => x.id !== id));
}


// historial


export function getHistory(): HistoryItem[] {
  return getItem<HistoryItem>(HISTORY_KEY).sort(
    (a, b) => new Date(b.visitedAt).getTime() - new Date(a.visitedAt).getTime()
  );
}

export function addToHistory(item: { countryCode: string; countryName: string; flag: string; visitedAt?: string }): HistoryItem {
  const current = getHistory();
  const entry: HistoryItem = {
    id: `${item.countryCode}-${Date.now()}`,
    countryCode: item.countryCode,
    countryName: item.countryName,
    flag: item.flag,
    visitedAt: item.visitedAt || new Date().toISOString(),
  };


  const next = [entry, ...current.filter((x) => x.countryCode !== item.countryCode)].slice(0, 12);
  setItem(HISTORY_KEY, next);
  return entry;
}


