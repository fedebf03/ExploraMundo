import { getHistory } from '../services/storage.service';
import { renderEmptyState } from '../components/empty-state';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function renderHistory(container: HTMLElement) {
  const historyEntries = getHistory();

  const historyContent = historyEntries.length === 0
    ? renderEmptyState({
        title: 'Todavía no visitaste ningún destino',
        description: 'Ingresá al detalle de un país para que quede registrado en tu historial.',
        actionHref: '#/busqueda',
        actionText: 'Buscar países'
      })
    : `
      <div class="history-grid">
        ${historyEntries
          .map((historyEntry) => {
            const visitedDate = new Date(historyEntry.visitedAt).toLocaleString('es-AR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return `
              <article class="history-item" data-country-code="${escapeHtml(historyEntry.countryCode)}">
                <a href="#/detalle/${escapeHtml(historyEntry.countryCode)}" class="history-item__card-link" aria-label="Ver detalle de ${escapeHtml(historyEntry.countryName)}">
                  <div class="history-item__top">
                    <div class="history-item__flag-wrapper">
                      <img
                        src="${escapeHtml(historyEntry.flag)}"
                        alt="Bandera de ${escapeHtml(historyEntry.countryName)}"
                        class="history-item__flag"
                        onerror="this.src='https://flagcdn.com/w640/un.png';"
                      />
                    </div>

                    <div class="history-item__meta">
                      <h3>${escapeHtml(historyEntry.countryName)}</h3>
                      <span class="history-item__code">${escapeHtml(historyEntry.countryCode)}</span>
                    </div>
                  </div>

                  <p class="history-item__date">Visitado: ${visitedDate}</p>
                </a>
              </article>
            `;
          })
          .join('')}
      </div>
    `;

  container.innerHTML = `
    <style>
      .view {
        width: 100%;
      }

      .section-header {
        margin-bottom: 1rem;
      }

      .section-header h1 {
        margin: 0 0 0.35rem;
        font-size: clamp(1.8rem, 4vw, 2.6rem);
        line-height: 1.1;
      }

      .section-header p {
        margin: 0;
        color: var(--text-secondary);
        font-size: 0.95rem;
      }

      .history-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .history-item {
        background: var(--bg-surface);
        border: 1px solid var(--border-color);
        border-radius: 0;
        overflow: hidden;
      }

      .history-item__card-link {
        display: block;
        color: inherit;
        text-decoration: none;
      }

      .history-item__top {
        display: flex;
        flex-direction: column;
        gap: 0.7rem;
        padding: 1rem 1rem 0.5rem;
      }

      .history-item__flag-wrapper {
        width: 100%;
        height: 180px;
        overflow: hidden;
        border: 1px solid rgba(148, 163, 184, 0.45);
        background: linear-gradient(180deg, #0f172a 0%, #111827 100%);
      }

      .history-item__flag {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .history-item__meta {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
      }

      .history-item__meta h3 {
        margin: 0;
        font-size: 1.6rem;
      }

      .history-item__code {
        color: var(--text-secondary);
        font-size: 0.8rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .history-item__date {
        margin: 0;
        padding: 0 1rem 1rem;
        color: var(--text-secondary);
        font-size: 0.9rem;
      }

      @media (min-width: 640px) {
        .history-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (min-width: 1024px) {
        .history-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }
    </style>

    <section class="view">
      <div class="section-header" style="margin-bottom: 1.5rem;">
        <h1>🕒 Historial de visitas</h1>
        <p>Países que revisaste recientemente.</p>
      </div>

      ${historyContent}
    </section>
  `;
}
