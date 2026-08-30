import { getWishlist, removeFromWishlist } from '../services/storage.service';

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

  container.innerHTML = `
    <section class="view">
      <div class="section-header" style="margin-bottom: 1.5rem;">
        <h1>✈️ Lista de deseos</h1>
        <p>Destinos guardados para planificar futuros viajes.</p>
      </div>

      ${items.length === 0
        ? `
          <div class="wishlist-empty">
            <p>No tenés destinos guardados en tu lista.</p>
            <a href="#/busqueda" class="btn btn-primary" style="margin-top: 1rem;">Explorar destinos</a>
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
                        <img src="${escapeHtml(item.flag)}" alt="Bandera de ${escapeHtml(item.countryName)}" class="wishlist-item__flag" onerror="this.src='https://flagcdn.com/w640/un.png';" />
                      </div>
                      <div class="wishlist-item__meta">
                        <a href="#/detalle/${escapeHtml(item.countryCode)}" style="color: inherit; text-decoration: none;">
                          <h3 style="display: inline;">${escapeHtml(item.countryName)}</h3>
                        </a>
                        <span class="wishlist-item__code">${escapeHtml(item.countryCode)}</span>
                      </div>
                    </div>

                    <div class="wishlist-item__details">
                      <span><strong>Prioridad:</strong> ${getPriorityLabel(item.priority)}</span>
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

      removeFromWishlist(id);
      renderWishlist(container);
    });
  });
}
