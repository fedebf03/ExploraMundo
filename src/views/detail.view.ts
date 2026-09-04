declare const L: any;

import { getCountryByCode } from '../services/api.service';

import { getFlagUrl, getCountryDisplayName } from '../components/country-card';
import { renderLoader } from '../components/loader';
import { renderEmptyState } from '../components/empty-state';
import { addToHistory, getWishlist } from '../services/storage.service';
import {
  renderWishlistFormModal,
  initWishlistModal,
} from '../components/wishlist-modal';

import {
  getCountryNameFromCode,
  formatLanguageName,
  formatCurrencyName,
  formatRegionName,
  formatSubregionName,
} from '../utils/country-codes';

export async function renderCountryDetail(container: HTMLElement, countryCode: string) {
  if (!countryCode) {


    container.innerHTML = `
      <section class="view">
        ${renderEmptyState({
          title: 'País no encontrado',
          description: 'No pudimos encontrar el país que buscás.',
          actionHref: '#/busqueda',
          actionText: 'Volver al buscador',
        })}


      </section>
    `;
    return;
  }

  container.innerHTML = `
    <section class="view">
      ${renderLoader('Cargando datos del país...')}
    </section>
  `;

  try {
    const country = await getCountryByCode(countryCode);
    const name = getCountryDisplayName(country);
    const officialName = country.names?.translations?.spa?.official || country.translations?.spa?.official || country.names?.official || country.name?.official || '';
    const flagUrl = getFlagUrl(country);

    addToHistory({
      countryCode,

      countryName: name,
      flag: flagUrl,
      visitedAt: new Date().toISOString(),
    });

    const capital = country.capitals?.[0]?.name || country.capital?.[0] || 'Sin capital';
    const region = formatRegionName(country.region || '');
    const subregion = formatSubregionName(country.subregion || '');
    const population = country.population ? Number(country.population).toLocaleString('es-AR') : '0';

    const existingWishlistItems = getWishlist().filter((item) => item.countryCode === countryCode);
    const existingCount = existingWishlistItems.length;
    const isSaved = existingCount > 0;
    const wishlistButtonText = isSaved ? 'Eliminar de favoritos' : 'Guardar en favoritos';
    const wishlistButtonClass = isSaved ? 'btn btn-danger' : 'btn btn-primary';

    const languages = Array.isArray(country.languages) && country.languages.length > 0
      ? country.languages.map((language: any) => formatLanguageName(language)).filter(Boolean).join(', ')
      : 'No disponible';

    const currencies = Array.isArray(country.currencies) && country.currencies.length > 0
      ? country.currencies.map((currency: any) => formatCurrencyName(currency)).filter(Boolean).join(', ')
      : 'No disponible';

    let superficie = 'No disponible';
    if (country.area) {
      if (typeof country.area === 'object' && country.area.kilometers) {
        superficie = `${Number(country.area.kilometers).toLocaleString('es-AR')} km²`;
      } else if (typeof country.area === 'number') {
        superficie = `${Number(country.area).toLocaleString('es-AR')} km²`;
      }
    }

    const salidaAlMar = country.landlocked ? 'Sin salida al mar (Mediterráneo)' : 'Con costa marítima';
    const sentidoCirculacion = country.cars?.driving_side === 'left'
      ? 'Por la izquierda (volante a la derecha)'
      : country.cars?.driving_side === 'right'
        ? 'Por la derecha'
        : 'No disponible';

    const officialSite = country.links?.official;
    const enlaceSitio = officialSite
      ? `<a href="${officialSite}" target="_blank" rel="noopener noreferrer" class="country-detail-official-link">Visitar sitio oficial ↗</a>`
      : 'No disponible';

    const fronteras = Array.isArray(country.borders) && country.borders.length > 0

      ? country.borders
          .map((borderCode: string) => `<a href="#/detalle/${borderCode}" class="badge-border">${getCountryNameFromCode(borderCode)}</a>`)
          .join(' ')
      : '<span class="country-detail-no-borders">No comparte frontera con ningún país</span>';



    const codigoIso = country.codes?.alpha_3 || country.codes?.alpha_2 || 'Sin código asignado';

    const targetLat = country.coordinates?.lat ?? country.capitals?.[0]?.coordinates?.lat;
    const targetLng = country.coordinates?.lng ?? country.capitals?.[0]?.coordinates?.lng;
    const hasCoordinates = typeof targetLat === 'number' && typeof targetLng === 'number';

    container.innerHTML = `
      <section class="view">
        <a href="#/busqueda" class="btn btn-secondary country-detail-back-btn">← Volver al buscador</a>



        <div class="country-detail-layout">
          <div class="country-detail-sidebar">
            <div class="country-detail-flag-wrapper">
              <img src="${flagUrl}" alt="Bandera de ${name}" class="country-detail-flag" onerror="this.src='https://flagcdn.com/w640/un.png';" />
            </div>

            <button id="wishlist-toggle-button" class="${wishlistButtonClass} country-detail-fav-btn" type="button">
              ${wishlistButtonText}
            </button>
          </div>

          <div class="country-detail-main">
            <div class="country-detail-header">
              <h1>${name}</h1>
              ${officialName && officialName !== name ? `<p class="country-detail-official">${officialName}</p>` : ''}
            </div>

            <div class="country-detail-section">
              <h3>Información general</h3>
              <ul class="country-info-list">

                <li><strong>Capital:</strong> <span>${capital}</span></li>
                <li><strong>Continente:</strong> <span>${region}${subregion ? ` (${subregion})` : ''}</span></li>
                <li><strong>Población:</strong> <span>${population} habitantes</span></li>
                <li><strong>Superficie total:</strong> <span>${superficie}</span></li>
                <li><strong>Salida al mar:</strong> <span>${salidaAlMar}</span></li>
                <li><strong>Sentido de circulación:</strong> <span>${sentidoCirculacion}</span></li>
                <li><strong>Idiomas oficiales:</strong> <span>${languages}</span></li>
                <li><strong>Moneda oficial:</strong> <span>${currencies}</span></li>
                <li><strong>Código ISO:</strong> <span>${codigoIso}</span></li>
                <li><strong>Sitio web oficial:</strong> <span>${enlaceSitio}</span></li>
              </ul>
            </div>

            ${hasCoordinates ? `
              <div class="country-detail-section">
                <h3>Ubicación geográfica</h3>
                <div id="detail-map" class="country-detail-map"></div>
              </div>
            ` : ''}


            <div class="country-detail-section">
              <h3>Países vecinos</h3>
              <div class="country-detail-borders-list">

                ${fronteras}
              </div>
            </div>
          </div>
        </div>
      </section>






      ${renderWishlistFormModal()}
    `;

    initWishlistModal({


      countryCode,
      countryName: name,
      flagUrl,
      isSaved,
      savedItemId: existingWishlistItems[0]?.id,
      onUpdate: () => renderCountryDetail(container, countryCode),
    });

    if (hasCoordinates) {
      initDetailMap(targetLat!, targetLng!, name);
    }
  } catch {
    container.innerHTML = `
      <section class="view">
        ${renderEmptyState({
          title: 'No se pudo cargar el país',
          description: 'Probá de nuevo en unos momentos.',
          actionHref: `#/detalle/${countryCode}`,
          actionText: 'Reintentar',
        })}
      </section>
    `;

    container.querySelector('.empty-state a')?.addEventListener('click', (event) => {
      event.preventDefault();
      renderCountryDetail(container, countryCode);
    });
  }



}

// inicializa el mapa interactivo y geolocalizacion del usuario
function initDetailMap(targetLat: number, targetLng: number, countryName: string) {
  setTimeout(() => {
    const mapElement = document.getElementById('detail-map');
    if (!mapElement || typeof L === 'undefined') return;

    try {
      const destCoords: [number, number] = [targetLat, targetLng];
      const map = L.map('detail-map', { scrollWheelZoom: false }).setView(destCoords, 5);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      L.marker(destCoords, { title: countryName })
        .addTo(map)
        .bindPopup(`<b>${countryName}</b>`)
        .openPopup();

      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const userCoords: [number, number] = [pos.coords.latitude, pos.coords.longitude];

            L.circleMarker(userCoords, {
              radius: 8,
              fillColor: '#0284c7',
              color: '#ffffff',
              weight: 2,
              opacity: 1,
              fillOpacity: 0.95,
            }).addTo(map);

            L.polyline([userCoords, destCoords], {
              color: '#0284c7',
              weight: 3,
              opacity: 0.75,
              dashArray: '8, 8',
            }).addTo(map);
          },
          () => {},
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
          }
        );
      }

      setTimeout(() => {
        map.invalidateSize();
      }, 150);

    } catch (err) {
      console.error('Error al inicializar el mapa de detalle:', err);
    }
  }, 50);
}



