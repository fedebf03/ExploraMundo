import type { Country } from '../types/country';

// obtiene la url de la bandera o devuelve una imagen por defecto
export function getFlagUrl(country: Country): string {
  if (country.flag?.url_png) return country.flag.url_png;
  if (country.flag?.url_svg) return country.flag.url_svg;
  if (country.flags?.png) return country.flags.png;

  const alpha2 = country.codes?.alpha_2;
  if (alpha2 && alpha2.length === 2) {
    return `https://flagcdn.com/w640/${alpha2.toLowerCase()}.png`;
  }

  return 'https://flagcdn.com/w640/un.png';
}

// genera el html de una tarjeta de país para la grilla
export function renderCountryCard(country: Country): string {
  const name = country.names?.common || country.name?.common || 'País sin nombre';
  const flagUrl = getFlagUrl(country);
  const capital = country.capitals?.[0]?.name || country.capital?.[0] || 'Sin capital';
  const population = country.population ? Number(country.population).toLocaleString('es-AR') : '0';
  const code = country.codes?.alpha_3 || country.cca3 || country.codes?.alpha_2 || '';
  const region = country.region || 'Desconocida';

  return `
    <article class="card">
      <a href="#/detalle/${code}" class="card__link">
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
