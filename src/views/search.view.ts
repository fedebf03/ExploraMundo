import { searchCountries } from '../services/api.service';
import { renderCountryCard } from '../components/country-card';
import { renderLoader } from '../components/loader';
import { renderEmptyState } from '../components/empty-state';
import type { Country } from '../types/country';

let currentResults: Country[] = [];
let currentOffset = 0;
const LIMIT = 12;
let totalCount = 0;
let isLoading = false;

async function executeSearch(isLoadMore = false) {

  const grid = document.getElementById('search-results');
  const loadMoreBtn = document.getElementById('load-more-btn');
  const count = document.getElementById('results-count');
  if (!grid || isLoading) return;

  const q = ((document.getElementById('search-input') as HTMLInputElement)?.value || '').trim();
  const region = (document.getElementById('region-select') as HTMLSelectElement)?.value || '';
  const language = (document.getElementById('language-select') as HTMLSelectElement)?.value || '';

  if (isLoadMore) {
    currentOffset += LIMIT;
    if (loadMoreBtn) loadMoreBtn.textContent = 'Cargando más...';
  } else {


    currentOffset = 0;
    currentResults = [];
    grid.innerHTML = renderLoader('Buscando países...');
    if (loadMoreBtn) loadMoreBtn.hidden = true;
    if (count) count.textContent = '';

  }


  isLoading = true;

  try {
    const res = await searchCountries({

      q,
      region,
      language,
      limit: LIMIT,
      offset: currentOffset,
    });

    const newItems = res.data?.objects || [];
    totalCount = res.data?.meta?.total ?? newItems.length;

    if (isLoadMore) {
      currentResults = [...currentResults, ...newItems];
    } else {
      currentResults = newItems;
    }




    if (currentResults.length === 0) {
      grid.innerHTML = renderEmptyState({
        icon: '🔍',
        title: 'Sin resultados',
        description: 'No se encontraron países que coincidan con los filtros seleccionados.',
      });
      if (loadMoreBtn) loadMoreBtn.hidden = true;
      if (count) count.textContent = '0 resultados';
      return;
    }

    grid.innerHTML = currentResults.map(renderCountryCard).join('');

    if (count) {
      count.textContent = `Mostrando ${currentResults.length} de ${totalCount} destinos`;
    }

    if (loadMoreBtn) {
      loadMoreBtn.textContent = 'Cargar más destinos';
      loadMoreBtn.hidden = !(currentResults.length < totalCount && newItems.length > 0);
    }
  } catch (error) {
    grid.innerHTML = renderEmptyState({
      title: 'Error al consultar la API',
      description: 'Hubo un problema de conexión al buscar los países. Verificá tu conexión o probá nuevamente.',
      actionHref: '#/busqueda',
      actionText: 'Reintentar',
    });
    if (loadMoreBtn) loadMoreBtn.hidden = true;
    if (count) count.textContent = '';
  } finally {
    isLoading = false;
  }
}

export async function renderSearch(container: HTMLElement) {
  container.innerHTML = `
    <section class="view">
      <form id="search-form" class="search-form">

        <div class="form-group">
          <label for="search-input" class="search-label">Nombre o capital</label>
          <input type="search" id="search-input" class="form-input" placeholder="Ej: Argentina, Tokio, París..." autocomplete="off" />
        </div>

        <div class="form-group">
          <label for="region-select" class="search-label">Continente</label>
          <select id="region-select" class="form-select">
            <option value="">Todos los continentes</option>
            <option value="Americas">América</option>
            <option value="Europe">Europa</option>
            <option value="Asia">Asia</option>
            <option value="Africa">África</option>
            <option value="Oceania">Oceanía</option>
          </select>
        </div>

        <div class="form-group">
          <label for="language-select" class="search-label">Idioma</label>
          <select id="language-select" class="form-select">

            <option value="">Todos los idiomas</option>
            <option value="Spanish">Español</option>
            <option value="English">Inglés</option>
            <option value="French">Francés</option>
            <option value="Portuguese">Portugués</option>
            <option value="German">Alemán</option>
            <option value="Italian">Italiano</option>
            <option value="Arabic">Árabe</option>
          </select>
        </div>

        <button type="submit" class="btn btn-primary search-submit-btn">Buscar</button>
      </form>

      <div class="search-results-info">
        <span id="results-count" class="search-results-count"></span>
      </div>

      <div id="search-results" class="countries-grid">
        ${renderLoader('Cargando países...')}
      </div>

      <div class="search-load-more-wrapper">
        <button id="load-more-btn" class="btn btn-secondary search-load-more-btn" hidden>
          Cargar más destinos
        </button>
      </div>
    </section>
  `;


  document.getElementById('search-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    executeSearch(false);
  });

  document.getElementById('load-more-btn')?.addEventListener('click', () => {
    executeSearch(true);
  });

  // carga inicial
  executeSearch(false);
}



