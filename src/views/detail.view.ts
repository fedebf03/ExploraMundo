import { getCountryByCode } from '../services/api.service';
import { getFlagUrl, getCountryDisplayName } from '../components/country-card';
import { renderLoader } from '../components/loader';
import { renderEmptyState } from '../components/empty-state';
import { addToHistory, addToWishlist, getWishlist, removeFromWishlist } from '../services/storage.service';
import { openConfirmationModal } from '../components/modal';
import { renderWishlistFormModal, renderDeleteConfirmationModal } from '../components/wishlist-modal';
import {
  getCountryNameFromCode,
  formatLanguageName,
  formatCurrencyName,
  formatRegionName,
  formatSubregionName,
} from '../utils/country-codes';

export async function renderCountryDetail(container: HTMLElement, countryCode: string) {
  // si la URL no incluye el codigo de pais, se muestra  un aviso
  if (!countryCode) {

    container.innerHTML = `
      <section class="view">
        ${renderEmptyState({
          title: 'País no especificado',
          description: 'No se indicó ningún código de país para consultar.',
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
    // pedimos los datos completos del pais a la API
    const country = await getCountryByCode(countryCode);
    const name = getCountryDisplayName(country);
    const officialName = country.names?.translations?.spa?.official || country.translations?.spa?.official || country.names?.official || country.name?.official || '';
    const flagUrl = getFlagUrl(country);

    // guardamos la visita en el historial local con la fecha actual
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

    // revisamos si ya lo teniamos guardado en favoritos para cambiar el color y texto del boton
    const existingWishlistItems = getWishlist().filter((item) => item.countryCode === countryCode);
    const existingCount = existingWishlistItems.length;
    const isSaved = existingCount > 0;
    const wishlistButtonText = isSaved ? 'Eliminar de favoritos' : 'Guardar en favoritos';
    const wishlistButtonClass = isSaved ? 'btn btn-danger' : 'btn btn-primary';



    // traducimos los idiomas y monedas al español usando la API de Intl
    const languages = Array.isArray(country.languages) && country.languages.length > 0
      ? country.languages.map((language: any) => formatLanguageName(language)).filter(Boolean).join(', ')
      : 'No disponible';

    const currencies = Array.isArray(country.currencies) && country.currencies.length > 0
      ? country.currencies.map((currency: any) => formatCurrencyName(currency)).filter(Boolean).join(', ')
      : 'No disponible';

    let areaStr = 'No disponible';
    if (country.area) {
      if (typeof country.area === 'object' && country.area.kilometers) {
        areaStr = `${Number(country.area.kilometers).toLocaleString('es-AR')} km²`;
      } else if (typeof country.area === 'number') {
        areaStr = `${Number(country.area).toLocaleString('es-AR')} km²`;
      }
    }

    const coastStr = country.landlocked ? 'Sin salida al mar (Mediterráneo)' : 'Con costa marítima';
    const drivingSide = country.cars?.driving_side === 'left'
      ? 'Por la izquierda (volante a la derecha)'
      : country.cars?.driving_side === 'right'
        ? 'Por la derecha'
        : 'No disponible';

    const officialSite = country.links?.official;
    const siteLink = officialSite
      ? `<a href="${officialSite}" target="_blank" rel="noopener noreferrer" style="color: var(--primary-color); text-decoration: underline; word-break: break-all;">Visitar sitio oficial ↗</a>`
      : 'No disponible';

    // armamos los links a los paises limitrofes para poder navegar entre fronteras
    const borders = Array.isArray(country.borders) && country.borders.length > 0
      ? country.borders
          .map((borderCode: string) => `<a href="#/detalle/${borderCode}" class="badge-border">${getCountryNameFromCode(borderCode)}</a>`)
          .join(' ')
      : '<span style="color: var(--text-secondary); font-size: 0.9rem;">No posee fronteras terrestres</span>';

    const isoCodeStr = country.codes?.alpha_3 || country.codes?.alpha_2 || 'Sin código asignado';


    container.innerHTML = `
      <section class="view">
        <a href="#/busqueda" class="btn btn-secondary" style="margin-bottom: 1.5rem;">← Volver al buscador</a>

        <div class="country-detail-layout">
          <div class="country-detail-sidebar">
            <div class="country-detail-flag-wrapper">
              <img src="${flagUrl}" alt="Bandera de ${name}" class="country-detail-flag" onerror="this.src='https://flagcdn.com/w640/un.png';" />
            </div>

            <button id="wishlist-toggle-button" class="${wishlistButtonClass}" type="button" style="width: 100%; margin-top: 1rem;">
              ${wishlistButtonText}
            </button>
          </div>


          <div class="country-detail-main">
            <div class="country-detail-header">
              <h1>${name}</h1>
              ${officialName && officialName !== name ? `<p class="country-detail-official">${officialName}</p>` : ''}
            </div>

            <div class="country-detail-section">
              <h3>Ficha técnica</h3>
              <ul class="country-info-list">
                <li><strong>Capital:</strong> <span>${capital}</span></li>
                <li><strong>Continente:</strong> <span>${region}${subregion ? ` (${subregion})` : ''}</span></li>
                <li><strong>Población:</strong> <span>${population} habitantes</span></li>
                <li><strong>Superficie total:</strong> <span>${areaStr}</span></li>
                <li><strong>Salida al mar:</strong> <span>${coastStr}</span></li>
                <li><strong>Sentido de circulación:</strong> <span>${drivingSide}</span></li>
                <li><strong>Idiomas oficiales:</strong> <span>${languages}</span></li>
                <li><strong>Moneda oficial:</strong> <span>${currencies}</span></li>
                <li><strong>Código ISO:</strong> <span>${isoCodeStr}</span></li>
                <li><strong>Sitio web oficial:</strong> <span>${siteLink}</span></li>
              </ul>
            </div>

            <div class="country-detail-section">
              <h3>Fronteras terrestres</h3>
              <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem;">
                ${borders}
              </div>
            </div>
          </div>
        </div>
      </section>

      ${renderWishlistFormModal()}
      ${renderDeleteConfirmationModal()}
    `;

    const formModal = document.getElementById('wishlist-modal-backdrop');
    const deleteModal = document.getElementById('wishlist-delete-modal');
    const wishlistButton = document.getElementById('wishlist-toggle-button') as HTMLButtonElement | null;
    const form = document.getElementById('wishlist-form') as HTMLFormElement | null;
    const message = document.getElementById('wishlist-form-message');
    const cancelButton = document.getElementById('cancel-wishlist-form');
    const closeModalButton = document.getElementById('close-wishlist-modal');
    const closeDeleteModalButton = document.getElementById('close-delete-modal');
    const cancelDeleteButton = document.getElementById('cancel-delete-wishlist');
    const confirmDeleteButton = document.getElementById('confirm-delete-wishlist');

    const closeFormModal = () => {
      formModal?.classList.add('is-hidden');
      formModal?.setAttribute('aria-hidden', 'true');
      form?.reset();
      if (message) {
        message.textContent = '';
        message.classList.remove('form-message--error');
        message.classList.remove('form-message--success');
      }
    };

    const openFormModal = () => {
      formModal?.classList.remove('is-hidden');
      formModal?.setAttribute('aria-hidden', 'false');
    };

    const closeDeleteModal = () => {
      deleteModal?.classList.add('is-hidden');
      deleteModal?.setAttribute('aria-hidden', 'true');
    };

    const openDeleteModal = () => {
      deleteModal?.classList.remove('is-hidden');
      deleteModal?.setAttribute('aria-hidden', 'false');
    };

    wishlistButton?.addEventListener('click', () => {
      if (isSaved) {
        openDeleteModal();
        return;
      }

      openFormModal();
    });

    cancelButton?.addEventListener('click', closeFormModal);
    closeModalButton?.addEventListener('click', closeFormModal);
    closeDeleteModalButton?.addEventListener('click', closeDeleteModal);
    cancelDeleteButton?.addEventListener('click', closeDeleteModal);

    confirmDeleteButton?.addEventListener('click', () => {
      const savedItem = existingWishlistItems[0];
      if (savedItem) {
        removeFromWishlist(savedItem.id);
      }
      closeDeleteModal();
      renderCountryDetail(container, countryCode);
    });

    form?.addEventListener('submit', (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const priority = Number(formData.get('priority')) || 0;
      const category = String(formData.get('category') || '').trim();
      const note = String(formData.get('note') || '').trim();

      if (priority <= 0 || !Number.isFinite(priority)) {
        if (message) {
          message.textContent = 'La prioridad debe ser un número mayor a cero.';
          message.classList.add('form-message--error');
        }
        return;
      }

      if (!category) {
        if (message) {
          message.textContent = 'La categoría es obligatoria.';
          message.classList.add('form-message--error');
        }
        return;
      }

      const alreadyExists = getWishlist().some((item) => item.countryCode === countryCode);

      if (alreadyExists) {
        openConfirmationModal(
          {
            title: 'País ya guardado',
            message: `Ya agregaste ${name} a tus favoritos. ¿Querés actualizar su información?`,
            confirmText: 'Actualizar',
            cancelText: 'No',
            variant: 'primary',
          },

          () => {
            addToWishlist({
              countryCode,
              countryName: name,
              flag: flagUrl,
              priority,
              category,
              note,
            });
            closeFormModal();
            renderCountryDetail(container, countryCode);
          }
        );
        return;
      }

      addToWishlist({
        countryCode,
        countryName: name,
        flag: flagUrl,
        priority,
        category,
        note,
      });

      closeFormModal();
      renderCountryDetail(container, countryCode);
    });
  } catch (error) {
    container.innerHTML = `
      <section class="view">
        ${renderEmptyState({
          title: 'No pudimos encontrar este destino',
          description: 'El país que buscás no existe o no se encuentra disponible en este momento.',
          actionHref: '#/busqueda',
          actionText: 'Volver al buscador',
        })}
      </section>
    `;
  }
}


