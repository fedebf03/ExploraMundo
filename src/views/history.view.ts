import { getHistory } from '../services/storage.service';
import { renderEmptyState } from '../components/empty-state';
import { escapeHtml } from '../utils/sanitize';
import { DEFAULT_FLAG_FALLBACK } from '../components/country-card';

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
                <a href="#/detalle/${escapeHtml(historyEntry.countryCode)}" class="history-item__card-link">
                  <div class="history-item__top">

                    <div class="history-item__flag-wrapper">
                      <img
                        src="${escapeHtml(historyEntry.flag)}"
                        alt="Bandera de ${escapeHtml(historyEntry.countryName)}"
                        class="history-item__flag"
                        onerror="this.onerror=null; this.src='${DEFAULT_FLAG_FALLBACK}';"
                      />
                    </div>

                    <div class="history-item__meta">
                      <h3>${escapeHtml(historyEntry.countryName)}</h3>
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
    <section class="view">
      <div class="section-header">
        <h1>Historial</h1>
      </div>



      ${historyContent}
    </section>
  `;
}
