import { getWishlist, removeFromWishlist } from '../services/storage.service';
import { renderEmptyState } from '../components/empty-state';
import { openConfirmationModal } from '../components/modal';

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
  const items = getWishlist();

  const wishlistContent = items.length === 0
    ? renderEmptyState({
        title: 'Todavía no guardaste ningún destino',
        description: 'Entrá al buscador para elegir países y agregarlos a la lista.',
        actionHref: '#/busqueda',
        actionText: 'Buscar países'
      })
    : `

      <div class="wishlist-grid">
        ${items
          .map(
            (item) => `
              <article class="wishlist-item" data-id="${item.id}" data-country-code="${escapeHtml(item.countryCode)}">
                <div class="wishlist-item__top">
                  <div class="wishlist-item__flag-wrap">
                    <img src="${escapeHtml(item.flag)}" alt="Bandera de ${escapeHtml(item.countryName)}" class="wishlist-item__flag" onerror="this.src='https://flagcdn.com/w640/un.png';" />
                  </div>
                  <div class="wishlist-item__meta">
                    <h3>${escapeHtml(item.countryName)}</h3>
                  </div>
                </div>


                <div class="wishlist-item__details">
                  <span><strong>Prioridad:</strong> ${getPriorityLabel(item.priority)}</span>
                  <span><strong>Categoría:</strong> ${escapeHtml(item.category)}</span>
                </div>

                <p class="wishlist-item__note"><strong>Nota:</strong> ${item.note ? escapeHtml(item.note) : 'Sin notas'}</p>

                <button class="btn btn-secondary btn-delete wishlist-delete" type="button" data-id="${item.id}">
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
        <h1>❤️ Lista de favoritos</h1>
        <p>Países y destinos que guardaste como favoritos.</p>
      </div>

      ${wishlistContent}
    </section>
  `;


  const wishlistCards = document.querySelectorAll('.wishlist-item');
  wishlistCards.forEach((card) => {
    card.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.closest('.wishlist-delete')) return;

      const countryCode = card.getAttribute('data-country-code');
      if (countryCode) {
        window.location.hash = `#/detalle/${countryCode}`;
      }
    });
  });

  const deleteButtons = document.querySelectorAll('.wishlist-delete');
  deleteButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();

      const itemId = button.getAttribute('data-id');
      if (!itemId) return;

      const item = items.find((entry) => entry.id === itemId);
      const countryName = item?.countryName || 'este destino';

      openConfirmationModal(
        {
          title: 'Eliminar de favoritos',
          message: `¿Querés quitar ${countryName} de tus favoritos?`,
          confirmText: 'Eliminar',
          cancelText: 'Cancelar',
          variant: 'danger',
        },

        () => {
          removeFromWishlist(itemId);
          renderWishlist(container);
        }
      );
    });
  });
}
