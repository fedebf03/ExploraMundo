import { getErrorMessage, renderErrorState } from '../utils/error-handler';

export interface WishlistItem {
  id: string;
  countryCode: string;
  countryName: string;
  flag: string;
  priority: number;
  category: string;
  note: string;
  createdAt: string;
}

const WISHLIST_KEY = 'exploramundo-wishlist';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function normalizeWishlistItem(item: Partial<WishlistItem>): WishlistItem | null {
  if (!item || typeof item !== 'object') return null;

  const countryCode = typeof item.countryCode === 'string' ? item.countryCode.trim() : '';
  const countryName = typeof item.countryName === 'string' ? item.countryName.trim() : 'País sin nombre';
  const flag = typeof item.flag === 'string' ? item.flag : '';
  const priority = Number(item.priority);
  const category = typeof item.category === 'string' ? item.category.trim() : '';
  const note = typeof item.note === 'string' ? item.note.trim() : '';

  if (!countryCode || !countryName || !flag || !Number.isFinite(priority) || priority <= 0 || !category) {
    return null;
  }

  return {
    id: typeof item.id === 'string' ? item.id : `${Date.now()}-${Math.random()}`,
    countryCode,
    countryName,
    flag,
    priority,
    category,
    note,
    createdAt: typeof item.createdAt === 'string' ? item.createdAt : new Date().toISOString(),
  };
}

export function getWishlist(): WishlistItem[] {
  try {
    const stored = localStorage.getItem(WISHLIST_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => normalizeWishlistItem(item as Partial<WishlistItem>))
      .filter((item): item is WishlistItem => item !== null);
  } catch (error) {
    console.error('Error leyendo wishlist:', getErrorMessage(error));
    return [];
  }
}

export function saveWishlist(items: WishlistItem[]) {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export function addWishlistItem(item: Omit<WishlistItem, 'id' | 'createdAt'>): WishlistItem {
  const items = getWishlist();
  const newItem: WishlistItem = {
    ...item,
    id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    createdAt: new Date().toISOString()
  };

  saveWishlist([newItem, ...items]);
  return newItem;
}

export function removeWishlistItem(itemId: string) {
  const items = getWishlist().filter((item) => item.id !== itemId);
  saveWishlist(items);
}

export function renderWishlist(container: HTMLElement) {
  try {
    const items = getWishlist();

    container.innerHTML = `
      <section class="view">
        <div class="section-header">
          <h1>💖 Lista de deseos</h1>
          <p>Guardá los destinos que te gustaría visitar y volvés cuando quieras.</p>
        </div>

        ${items.length === 0
          ? `
            <div class="wishlist-empty">
              <p>Aún no guardaste ningún destino.</p>
              <a href="#/search" class="btn btn-primary">Explorar destinos</a>
            </div>
          `
          : `
            <div class="wishlist-grid">
              ${items
                .map(
                  (item) => `
                    <article class="wishlist-item" data-id="${item.id}">
                      <div class="wishlist-item__top">
                        <div class="wishlist-item__flag-wrap">
                          <img src="${escapeHtml(item.flag)}" alt="Bandera de ${escapeHtml(item.countryName)}" class="wishlist-item__flag" />
                        </div>
                        <div class="wishlist-item__meta">
                          <h3>${escapeHtml(item.countryName)}</h3>
                          <span class="wishlist-item__code">${escapeHtml(item.countryCode)}</span>
                        </div>
                      </div>

                      <div class="wishlist-item__details">
                        <span><strong>Prioridad:</strong> ${item.priority}</span>
                        <span><strong>Categoría:</strong> ${escapeHtml(item.category)}</span>
                      </div>

                      ${item.note ? `<p class="wishlist-item__note">${escapeHtml(item.note)}</p>` : ''}

                      <button class="btn btn-secondary btn-delete wishlist-delete" type="button" data-id="${item.id}">
                        Eliminar
                      </button>
                    </article>
                  `
                )
                .join('')}
            </div>
          `}
      </section>
    `;

    const deleteButtons = document.querySelectorAll('.wishlist-delete');
    deleteButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const id = button.getAttribute('data-id');
        if (!id) return;

        try {
          removeWishlistItem(id);
          renderWishlist(container);
        } catch (error) {
          renderErrorState(container, {
            title: 'No se pudo eliminar',
            message: getErrorMessage(error),
            actionLabel: 'Reintentar',
            onAction: () => renderWishlist(container)
          });
        }
      });
    });
  } catch (error) {
    renderErrorState(container, {
      title: 'No se pudo cargar la wishlist',
      message: getErrorMessage(error),
      actionLabel: 'Recargar',
      onAction: () => renderWishlist(container)
    });
  }
}
