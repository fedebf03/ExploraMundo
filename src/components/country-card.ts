import type { Country } from '../types/country';
import { formatRegionName } from '../utils/country-codes';

export const DEFAULT_FLAG_FALLBACK = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NDAgNDgwIj48cmVjdCB3aWR0aD0iNjQwIiBoZWlnaHQ9IjQ4MCIgZmlsbD0iIzAyODRjNyIvPjxjaXJjbGUgY3g9IjMyMCIgY3k9IjI0MCIgcj0iMTEwIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMTIiLz48ZWxsaXBzZSBjeD0iMzIwIiBjeT0iMjQwIiByeD0iNTUiIHJ5PSIxMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIxMCIvPjxsaW5lIHgxPSIyMTAiIHkxPSIyNDAiIHgyPSI0MzAiIHkyPSIyNDAiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIxMCIvPjxsaW5lIHgxPSIyMzUiIHkxPSIxODUiIHgyPSI0MDUiIHkyPSIxODUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSI4Ii8+PGxpbmUgeDE9IjIzNSIgeTE9IjI5NSIgeDI9IjQwNSIgeTI9IjI5NSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjgiLz48L3N2Zz4=';

export function getFlagUrl(country: Country): string {
  if (country.flag?.url_png) return country.flag.url_png;
  if (country.flag?.url_svg) return country.flag.url_svg;
  if (country.flags?.png) return country.flags.png;

  const alpha2 = country.codes?.alpha_2;
  if (alpha2 && alpha2.length === 2) {
    return `https://flagcdn.com/w640/${alpha2.toLowerCase()}.png`;
  }

  return DEFAULT_FLAG_FALLBACK;
}

export function getCountryDisplayName(country: Country): string {
  return (
    country.names?.translations?.spa?.common ||
    country.translations?.spa?.common ||
    country.names?.common ||
    country.name?.common ||
    'País sin nombre'
  );
}

export function renderCountryCard(country: Country): string {

  const name = getCountryDisplayName(country);
  const flagUrl = getFlagUrl(country);
  const capital = country.capitals?.[0]?.name || country.capital?.[0] || 'Sin capital';
  const population = country.population ? Number(country.population).toLocaleString('es-AR') : '0';
  const code = country.codes?.alpha_3 || country.cca3 || country.codes?.alpha_2 || country.names?.common || country.name?.common || '';
  const region = formatRegionName(country.region || '');

  return `
    <article class="card">
      <a href="#/detalle/${encodeURIComponent(code)}" class="card__link">

        <div class="card__flag-wrapper">
          <img 
            src="${flagUrl}" 
            alt="Bandera de ${name}" 
            class="card__flag" 
            loading="lazy" 
            onerror="this.onerror=null; this.src='${DEFAULT_FLAG_FALLBACK}';"
          />
        </div>
        <div class="card__body">
          <h3 class="card__title">${name}</h3>
          <div class="card__info">
            <span><strong>Capital:</strong> ${capital}</span>
            <span><strong>Continente:</strong> ${region}</span>
            <span><strong>Población:</strong> ${population} hab.</span>
          </div>
        </div>
      </a>
    </article>
  `;
}

