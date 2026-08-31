import { getWishlist, removeFromWishlist } from '../services/storage.service';
import { renderEmptyState } from '../components/empty-state';


function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getPriorityLabel(priority: number): string {
  switch (priority) {
    case 5:
      return 'Muy alta';
    case 4:
      return 'Alta';
    case 3:
      return 'Media';
    case 2:
      return 'Baja';
    case 1:
      return 'Muy baja';
    default:
      return `${priority}`;
  }
}

export function renderWishlist(container: HTMLElement) {
  const wishlistItems = getWishlist();
  const wishlistContent = wishlistItems.length === 0
    ? renderEmptyState({
        title: 'Todavía no guardaste ningún destino',
        description: 'Entrá al buscador para elegir países y agregarlos con tus notas personales.',
        actionHref: '#/busqueda',
        actionText: 'Buscar países'
      })
    : `
      <div class="wishlist-grid">
        ${wishlistItems
          .map(
            (wishlistItem) => `
              <article class="wishlist-item" data-id="${wishlistItem.id}">
                <div class="wishlist-item__top">
                  <div class="wishlist-item__flag-wrap">
                    <img src="${escapeHtml(wishlistItem.flag)}" alt="Bandera de ${escapeHtml(wishlistItem.countryName)}" class="wishlist-item__flag" onerror="this.src='https://flagcdn.com/w640/un.png';" />
                  </div>
                  <div class="wishlist-item__meta">
                    <a href="#/detalle/${escapeHtml(wishlistItem.countryCode)}" style="color: inherit; text-decoration: none;">
                      <h3 style="display: inline;">${escapeHtml(wishlistItem.countryName)}</h3>
                    </a>
                    <span class="wishlist-item__code">${escapeHtml(wishlistItem.countryCode)}</span>
                  </div>
                </div>

                <div class="wishlist-item__details">
                  <span><strong>Prioridad:</strong> ${getPriorityLabel(wishlistItem.priority)}</span>
                  <span><strong>Categoría:</strong> ${escapeHtml(wishlistItem.category)}</span>
                </div>

                ${wishlistItem.note ? `<p class="wishlist-item__note">${escapeHtml(wishlistItem.note)}</p>` : ''}

                <button class="btn btn-secondary btn-delete wishlist-delete" type="button" data-id="${wishlistItem.id}">
                  Eliminar
                </button>
              </article>
            `
          )
          .join('')}
      </div>
    `;

  container.innerHTML = `
    <section class="view">
      <div class="section-header" style="margin-bottom: 1.5rem;">
        <h1>✈️ Lista de deseos</h1>
        <p>Países y lugares que guardaste para consultar más adelante.</p>
      </div>

      ${wishlistContent}
    </section>
  `;

  const deleteButtons = document.querySelectorAll('.wishlist-delete');
  deleteButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const itemId = button.getAttribute('data-id');
      if (!itemId) return;

      removeFromWishlist(itemId);
      renderWishlist(container);
    });
  });
}
