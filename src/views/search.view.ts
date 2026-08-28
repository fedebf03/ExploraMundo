import { getCountries } from '../services/api.service';
import { renderCountryCard } from '../components/country-card';
import type { Country } from '../types/country';

let allCountries: Country[] = [];
let filteredCountries: Country[] = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 10;
let isFetchingAll = false;

// dibuja las tarjetas en pantalla según la página actual
function renderResults() {
  const grid = document.getElementById('search-results');
  const loadMoreBtn = document.getElementById('load-more-btn');
  const count = document.getElementById('results-count');
  if (!grid) return;

  if (filteredCountries.length === 0) {
    grid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: var(--text-secondary);">No se encontraron países con esos filtros.</p>`;
    if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    if (count) count.textContent = '0 resultados';
    return;
  }

  // paginamos de a 10 países según la página en la que estamos (RF3)
  const visible = filteredCountries.slice(0, currentPage * ITEMS_PER_PAGE);
  grid.innerHTML = visible.map(renderCountryCard).join('');

  if (count) {
    count.textContent = `Mostrando ${visible.length} de ${filteredCountries.length} destinos`;
  }

  if (loadMoreBtn) {
    loadMoreBtn.style.display = visible.length < filteredCountries.length ? 'inline-flex' : 'none';
  }
}

// aplica los 3 filtros (nombre, continente, idioma) y el orden
function applyFilters() {
  const q = (document.getElementById('search-input') as HTMLInputElement)?.value.trim().toLowerCase();
  const region = (document.getElementById('region-select') as HTMLSelectElement)?.value.toLowerCase();
  const lang = (document.getElementById('language-select') as HTMLSelectElement)?.value.toLowerCase();
  const sort = (document.getElementById('sort-select') as HTMLSelectElement)?.value;

  filteredCountries = allCountries.filter((c) => {
    const name = (c.names?.common || c.name?.common || '').toLowerCase();
    const capital = (c.capitals?.[0]?.name || c.capital?.[0] || '').toLowerCase();
    const cRegion = (c.region || '').toLowerCase();

    // 1. filtro por nombre o capital
    const matchText = !q || name.includes(q) || capital.includes(q);

    // 2. filtro por continente
    const matchRegion = !region || cRegion === region;

    // 3. filtro por idioma oficial
    let matchLang = true;
    if (lang) {
      if (!c.languages || !Array.isArray(c.languages)) {
        matchLang = false;
      } else {
        matchLang = c.languages.some((l: any) => {
          const lName = (l.name || '').toLowerCase();
          const lNative = (l.native_name || '').toLowerCase();
          // iso1 es el código de idioma de 2 letras (ej: "es", "en", "ar") e iso3 es el de 3 letras (ej: "spa", "eng", "ara")
          const iso1 = (l.iso639_1 || '').toLowerCase();
          const iso3 = (l.iso639_3 || l.iso639_2b || '').toLowerCase();

          // comprobamos por código ISO o por nombre para que coincida siempre
          if (lang === 'spanish') return iso1 === 'es' || iso3 === 'spa' || lName.includes('spanish') || lNative.includes('español');
          if (lang === 'english') return iso1 === 'en' || iso3 === 'eng' || lName.includes('english');
          if (lang === 'french') return iso1 === 'fr' || iso3 === 'fra' || lName.includes('french');
          if (lang === 'portuguese') return iso1 === 'pt' || iso3 === 'por' || lName.includes('portuguese');
          if (lang === 'german') return iso1 === 'de' || iso3 === 'deu' || lName.includes('german');
          if (lang === 'italian') return iso1 === 'it' || iso3 === 'ita' || lName.includes('italian');
          if (lang === 'arabic') return iso1 === 'ar' || iso3 === 'ara' || lName.includes('arabic');

          return lName.includes(lang) || iso1 === lang || iso3 === lang;
        });
      }
    }


    return matchText && matchRegion && matchLang;
  });

  // ordenamos los países según el criterio elegido
  filteredCountries.sort((a, b) => {
    const nameA = a.names?.common || a.name?.common || '';
    const nameB = b.names?.common || b.name?.common || '';
    const popA = Number(a.population || 0);
    const popB = Number(b.population || 0);

    if (sort === 'name-desc') return nameB.localeCompare(nameA);
    if (sort === 'pop-desc') return popB - popA; // mayor población real
    if (sort === 'pop-asc') return popA - popB;  // menor población real
    return nameA.localeCompare(nameB);
  });

  currentPage = 1;
  renderResults();
}

// monta la vista de búsqueda
export async function renderSearch(container: HTMLElement) {
  container.innerHTML = `
    <section class="view">
      <div style="margin-bottom: 1.5rem;">
        <h1>🔍 Buscá tu próximo destino</h1>
      </div>


      <!-- formulario con los 3 filtros principales (RF2) -->
      <form id="search-form" class="search-form" onsubmit="event.preventDefault();">
        <div class="form-group">
          <label for="search-input" style="font-size: 0.85rem; color: var(--text-secondary); font-weight: 600;">Nombre o capital</label>
          <input type="search" id="search-input" class="form-input" placeholder="Ej: Argentina, Tokio, París..." autocomplete="off" />
        </div>

        <div class="form-group">
          <label for="region-select" style="font-size: 0.85rem; color: var(--text-secondary); font-weight: 600;">Continente</label>
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
          <label for="language-select" style="font-size: 0.85rem; color: var(--text-secondary); font-weight: 600;">Idioma oficial</label>
          <select id="language-select" class="form-select">
            <option value="">Todos los idiomas</option>
            <option value="spanish">Español</option>
            <option value="english">Inglés</option>
            <option value="french">Francés</option>
            <option value="portuguese">Portugués</option>
            <option value="german">Alemán</option>
            <option value="italian">Italiano</option>
            <option value="arabic">Árabe</option>
          </select>
        </div>

        <div class="form-group">
          <label for="sort-select" style="font-size: 0.85rem; color: var(--text-secondary); font-weight: 600;">Ordenar por</label>
          <select id="sort-select" class="form-select">
            <option value="name-asc">Nombre (A - Z)</option>
            <option value="name-desc">Nombre (Z - A)</option>
            <option value="pop-desc">Mayor población</option>
            <option value="pop-asc">Menor población</option>
          </select>
        </div>

        <button type="submit" class="btn btn-primary" style="height: 44px;">Buscar</button>
      </form>

      <div style="margin-top: 1.5rem; margin-bottom: 0.5rem;">
        <span id="results-count" style="font-size: 0.85rem; color: var(--text-secondary);"></span>
      </div>

      <!-- grilla de tarjetas de países -->
      <div id="search-results" class="countries-grid">
        <p style="grid-column: 1 / -1; text-align: center; color: var(--text-secondary);">Cargando países desde la API...</p>
      </div>

      <!-- botón para paginar más resultados de a 10 (RF3) -->
      <div style="text-align: center; margin-top: 2rem; margin-bottom: 2rem;">
        <button id="load-more-btn" class="btn btn-secondary" style="display: none; padding: 0.75rem 2rem;">
          Cargar más destinos
        </button>
      </div>
    </section>
  `;

  // escuchamos cambios en el formulario para filtrar en tiempo real
  document.getElementById('search-form')?.addEventListener('submit', applyFilters);
  document.getElementById('search-input')?.addEventListener('input', applyFilters);
  document.getElementById('region-select')?.addEventListener('change', applyFilters);
  document.getElementById('language-select')?.addEventListener('change', applyFilters);
  document.getElementById('sort-select')?.addEventListener('change', applyFilters);

  // paginar siguientes 10 países
  document.getElementById('load-more-btn')?.addEventListener('click', () => {
    currentPage++;
    renderResults();
  });

  // traemos el catálogo de países de la API si todavía no está en memoria
  if (allCountries.length === 0 && !isFetchingAll) {
    isFetchingAll = true;
    try {
      const [batch1, batch2, batch3] = await Promise.all([
        getCountries(100, 0),
        getCountries(100, 100),
        getCountries(100, 200)
      ]);

      const list1 = batch1.data?.objects || [];
      const list2 = batch2.data?.objects || [];
      const list3 = batch3.data?.objects || [];

      // guardamos la lista completa sin duplicados
      const seen = new Set<string>();
      allCountries = [...list1, ...list2, ...list3].filter((c) => {
        const code = c.codes?.alpha_3 || c.cca3 || c.names?.common;
        if (!code || seen.has(code)) return false;
        seen.add(code);
        return true;
      });

      applyFilters();
    } catch (error) {
      const grid = document.getElementById('search-results');
      if (grid) {
        grid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: var(--danger-color);">Error al conectar con la API.</p>`;
      }
    } finally {
      isFetchingAll = false;
    }
  } else {
    applyFilters();
  }
}
