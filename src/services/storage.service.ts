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

function getItem<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function setItem<T>(key: string, value: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error guardando en localStorage:', error);
  }
}

function sanitizeWishlistItem(item: any): WishlistItem | null {
  if (!item || typeof item !== 'object') return null;

  const countryCode = String(item.countryCode || item.code || '').trim();
  const countryName = String(item.countryName || item.name || '').trim();
  const flag = String(item.flag || item.flagUrl || 'https://flagcdn.com/w640/un.png').trim();
  const priority = Number(item.priority);
  const category = String(item.category || 'General').trim();
  const note = typeof item.note === 'string' ? item.note : undefined;
  const id = String(item.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const createdAt = String(item.createdAt || item.dateAdded || new Date().toISOString());

  if (!countryCode || !countryName) return null;

  return {
    id,
    countryCode,
    countryName,
    flag,
    priority: Number.isFinite(priority) && priority > 0 ? priority : 1,
    category: category || 'General',
    note,
    createdAt
  };
}

export function getWishlist(): WishlistItem[] {
  const rawList = getItem<any>(WISHLIST_KEY);
  const validItems: WishlistItem[] = [];
  const seen = new Set<string>();

  for (const raw of rawList) {
    const sanitized = sanitizeWishlistItem(raw);
    if (!sanitized) continue;
    if (seen.has(sanitized.countryCode)) continue;

    seen.add(sanitized.countryCode);
    validItems.push(sanitized);
  }

  return validItems.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function isCountryInWishlist(countryCode: string): boolean {
  const normalizedCode = countryCode.trim().toUpperCase();
  return getWishlist().some((wishlistItem) => wishlistItem.countryCode.toUpperCase() === normalizedCode);
}

export function addToWishlist(item: Omit<WishlistItem, 'id' | 'createdAt'>): WishlistItem {
  const current = getWishlist();
  const existingIndex = current.findIndex((entry) => entry.countryCode === item.countryCode);

  if (existingIndex >= 0) {
    const updatedItem: WishlistItem = {
      ...current[existingIndex],
      ...item,
      id: current[existingIndex].id,
      createdAt: current[existingIndex].createdAt,
    };

    const nextItems = [updatedItem, ...current.filter((entry) => entry.countryCode !== item.countryCode)];
    setItem(WISHLIST_KEY, nextItems);
    return updatedItem;
  }

  const newItem: WishlistItem = {
    ...item,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString()
  };

  setItem(WISHLIST_KEY, [newItem, ...current]);
  return newItem;
}

export function removeFromWishlist(id: string): void {
  const current = getWishlist();
  const filtered = current.filter((wishlistItem) => wishlistItem.id !== id);
  setItem(WISHLIST_KEY, filtered);
}

export function removeFromWishlistByCountryCode(countryCode: string): void {
  const current = getWishlist();
  const filtered = current.filter(
    (wishlistItem) => wishlistItem.countryCode.toUpperCase() !== countryCode.trim().toUpperCase()
  );
  setItem(WISHLIST_KEY, filtered);
}

function sanitizeHistoryItem(item: any): HistoryItem | null {
  if (!item || typeof item !== 'object') return null;

  const countryCode = String(item.countryCode || item.code || '').trim();
  const countryName = String(item.countryName || item.name || '').trim();
  const flag = String(item.flag || item.flagUrl || 'https://flagcdn.com/w640/un.png').trim();
  const visitedAt = String(item.visitedAt || new Date().toISOString());

  if (!countryCode || !countryName) return null;

  return {
    id: String(item.id || `${countryCode}-${visitedAt}`),
    countryCode,
    countryName,
    flag,
    visitedAt,
  };
}

export function getHistory(): HistoryItem[] {
  const rawList = getItem<any>(HISTORY_KEY);
  const validItems: HistoryItem[] = [];
  const seen = new Set<string>();

  for (const raw of rawList) {
    const sanitized = sanitizeHistoryItem(raw);
    if (!sanitized) continue;
    if (seen.has(sanitized.countryCode)) continue;

    seen.add(sanitized.countryCode);
    validItems.push(sanitized);
  }

  return validItems.sort((a, b) => new Date(b.visitedAt).getTime() - new Date(a.visitedAt).getTime());
}

export function addToHistory(item: Partial<HistoryItem> & Pick<HistoryItem, 'countryCode' | 'countryName' | 'flag'> & { visitedAt?: string }): HistoryItem {
  const current = getHistory();
  const nextEntry: HistoryItem = {
    id: item.id || `${item.countryCode}-${Date.now()}`,
    countryCode: item.countryCode,
    countryName: item.countryName,
    flag: item.flag,
    visitedAt: item.visitedAt || new Date().toISOString(),
  };

  const filtered = current.filter((entry) => entry.countryCode !== item.countryCode);
  const updated = [nextEntry, ...filtered].slice(0, 30);
  setItem(HISTORY_KEY, updated);

  return nextEntry;
}
