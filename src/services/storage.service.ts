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

// favoritos

export function getWishlist(): WishlistItem[] {
  const data = localStorage.getItem(WISHLIST_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveWishlist(list: WishlistItem[]): void {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
  } catch {}
}


export function addToWishlist(item: {
  countryCode: string;
  countryName: string;
  flag: string;
  priority: number;
  category: string;
  note?: string;
}): WishlistItem {
  const list = getWishlist();
  const existingIndex = list.findIndex((fav) => fav.countryCode === item.countryCode);

  if (existingIndex !== -1) {
    list[existingIndex].priority = item.priority;
    list[existingIndex].category = item.category;
    list[existingIndex].note = item.note;
    saveWishlist(list);
    return list[existingIndex];
  }

  const newItem: WishlistItem = {
    id: 'fav_' + Date.now(),
    countryCode: item.countryCode,
    countryName: item.countryName,
    flag: item.flag,
    priority: item.priority,
    category: item.category,
    note: item.note,
    createdAt: new Date().toISOString(),
  };

  list.unshift(newItem);
  saveWishlist(list);
  return newItem;
}

export function removeFromWishlist(id: string): void {
  const list = getWishlist();
  const filtered = list.filter((fav) => fav.id !== id);
  saveWishlist(filtered);
}

// historial

export function getHistory(): HistoryItem[] {
  const data = localStorage.getItem(HISTORY_KEY);
  if (!data) return [];
  try {
    const list: HistoryItem[] = JSON.parse(data);
    return list.sort((a, b) => new Date(b.visitedAt).getTime() - new Date(a.visitedAt).getTime());
  } catch {
    return [];
  }
}

function saveHistory(list: HistoryItem[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
  } catch {}
}


export function addToHistory(item: {
  countryCode: string;
  countryName: string;
  flag: string;
  visitedAt?: string;
}): HistoryItem {
  let list = getHistory();

  list = list.filter((h) => h.countryCode !== item.countryCode);

  const newEntry: HistoryItem = {
    id: 'hist_' + item.countryCode + '_' + Date.now(),
    countryCode: item.countryCode,
    countryName: item.countryName,
    flag: item.flag,
    visitedAt: item.visitedAt || new Date().toISOString(),
  };

  list.unshift(newEntry);

  if (list.length > 12) {
    list = list.slice(0, 12);
  }

  saveHistory(list);
  return newEntry;
}
