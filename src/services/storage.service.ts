const WISHLIST_KEY = 'exploramundo_wishlist';

// modelo oficial para los destinos guardados en deseos (RF5)
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

// recupera datos asegurando que siempre devuelva un arreglo valido
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

// valida y normaliza un elemento para que nunca rompa la vista
function sanitizeWishlistItem(item: any): WishlistItem | null {
  if (!item || typeof item !== 'object') return null;

  // extraemos los campos soportando posibles versiones anteriores
  const countryCode = String(item.countryCode || item.code || '').trim();
  const countryName = String(item.countryName || item.name || '').trim();
  const flag = String(item.flag || item.flagUrl || 'https://flagcdn.com/w640/un.png').trim();
  const priority = Number(item.priority);
  const category = String(item.category || 'General').trim();
  const note = typeof item.note === 'string' ? item.note : undefined;
  const id = String(item.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const createdAt = String(item.createdAt || item.dateAdded || new Date().toISOString());

  // si no tiene codigo o nombre minimo, lo descartamos por corrupto
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

// LISTA DE DESEOS (RF5)

export function getWishlist(): WishlistItem[] {
  const rawList = getItem<any>(WISHLIST_KEY);
  const validItems: WishlistItem[] = [];

  for (const raw of rawList) {
    const sanitized = sanitizeWishlistItem(raw);
    if (sanitized) {
      validItems.push(sanitized);
    }
  }

  return validItems;
}

export function addToWishlist(item: Omit<WishlistItem, 'id' | 'createdAt'>): WishlistItem {
  const current = getWishlist();
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
  const filtered = current.filter((w) => w.id !== id);
  setItem(WISHLIST_KEY, filtered);
}
