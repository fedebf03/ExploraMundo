import { getCountries } from '../services/api.service';
import type { Country } from '../types/country';

// función auxiliar para obtener la mejor url de la bandera con respaldo
function getFlagUrl(country: Country): string {
  if (country.flag?.url_png) return country.flag.url_png;
  if (country.flag?.url_svg) return country.flag.url_svg;
  if (country.flags?.png) return country.flags.png;

  const alpha2 = country.codes?.alpha_2;
  if (alpha2 && alpha2.length === 2) {
    return `https://flagcdn.com/w640/${alpha2.toLowerCase()}.png`;
  }

  return 'https://flagcdn.com/w640/un.png';
}

// función que renderiza una sola tarjeta de país
function renderCountryCard(country: Country): string {
  const name = country.names?.common || country.name?.common || 'País sin nombre';
  const flagUrl = getFlagUrl(country);
  const capital = country.capitals?.[0]?.name || country.capital?.[0] || 'Sin capital';
  const population = country.population ? Number(country.population).toLocaleString('es-AR') : '0';
  const code = country.codes?.alpha_3 || country.cca3 || country.codes?.alpha_2 || '';
  const region = country.region || 'Desconocida';

  return `
    <article class="card">
      <a href="#/detail/${code}" class="card__link">
        <div class="card__flag-wrapper">
          <img 
            src="${flagUrl}" 
            alt="Bandera de ${name}" 
            class="card__flag" 
            loading="lazy" 
            onerror="this.onerror=null; this.src='https://flagcdn.com/w640/un.png';"
          />
        </div>
        <div class="card__body">
          <h3 class="card__title">${name}</h3>
          <div class="card__info">
            <span><strong>Capital:</strong> ${capital}</span>
            <span><strong>Región:</strong> ${region}</span>
            <span><strong>Población:</strong> ${population} hab.</span>
          </div>
        </div>
      </a>
    </article>
  `;
}



// función principal que monta la pantalla de Inicio
export async function renderHome(container: HTMLElement) {
  // primero mostramos un mensaje de carga
  container.innerHTML = `
    <section class="view">
      <div class="hero" style="text-align: center; margin-bottom: 2rem;">
        <h1>🌍 Explorador de Países</h1>
        <p>Descubrí información detallada de países de todo el mundo.</p>
        <a href="#/search" class="btn btn-primary" style="margin-top: 1rem;">Ir al Buscador</a>
      </div>

      <h2>Países destacados</h2>
      <div id="home-countries" class="countries-grid">
        <p style="grid-column: 1 / -1; text-align: center; color: var(--text-secondary);">Cargando países desde la API...</p>
      </div>
    </section>
  `;

  const gridContainer = document.getElementById('home-countries');
  if (!gridContainer) return;

  try {
    // le pedimos los primeros 10 países a la api
    const response = await getCountries(10, 0);
    const countries = response.data?.objects || [];

    if (countries.length === 0) {
      gridContainer.innerHTML = `<p style="grid-column: 1 / -1; text-align: center;">No se encontraron países.</p>`;
      return;
    }

    // transformamos cada país en su tarjeta html
    gridContainer.innerHTML = countries.map(renderCountryCard).join('');
  } catch (error) {
    gridContainer.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; color: var(--danger-color);">
        <p>Hubo un problema al cargar los países.</p>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">${error instanceof Error ? error.message : 'Error desconocido'}</p>
      </div>
    `;
  }
}
