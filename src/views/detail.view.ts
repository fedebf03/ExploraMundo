import { getCountryByCode } from '../services/api.service';
import { getFlagUrl, getCountryDisplayName } from '../components/country-card';
import { renderLoader } from '../components/loader';
import { renderEmptyState } from '../components/empty-state';
import { addToWishlist, getWishlist, addToHistory, removeFromWishlist } from '../services/storage.service';
import { openConfirmationModal } from '../components/modal';
import {
  getCountryNameFromCode,
  formatLanguageName,
  formatCurrencyName,
  formatRegionName,
  formatSubregionName
} from '../utils/country-codes';


export async function renderCountryDetail(container: HTMLElement, countryCode: string) {
  if (!countryCode) {
    container.innerHTML = `
      <section class="view">
        ${renderEmptyState({
          title: 'País no especificado',
          description: 'No se indicó ningún código de país para consultar.',
          actionHref: '#/busqueda',
          actionText: 'Volver al buscador'
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
    const wishlistButtonText = isSaved ? 'Eliminar de la lista' : 'Agregar a lista de deseos';
    const wishlistButtonClass = isSaved ? 'btn btn-danger' : 'btn btn-primary';

    // idiomas traducidos al español (ej: "Albanés", "Español, Guaraní")
    const languages = Array.isArray(country.languages) && country.languages.length > 0
      ? country.languages.map((l: any) => formatLanguageName(l)).filter(Boolean).join(', ')
      : 'No disponible';

    // monedas traducidas al español (ej: "Lek albanés", "Peso argentino ($)")
    const currencies = Array.isArray(country.currencies) && country.currencies.length > 0
      ? country.currencies.map((c: any) => formatCurrencyName(c)).filter(Boolean).join(', ')
      : 'No disponible';

    // superficie total en km2
    let areaStr = 'No disponible';
    if (country.area) {
      if (typeof country.area === 'object' && country.area.kilometers) {
        areaStr = `${Number(country.area.kilometers).toLocaleString('es-AR')} km²`;
      } else if (typeof country.area === 'number') {
        areaStr = `${Number(country.area).toLocaleString('es-AR')} km²`;
      }
    }

    // salida al mar
    const coastStr = country.landlocked ? 'Sin salida al mar (Mediterráneo)' : 'Con costa marítima';

    // sentido de circulacion
    const drivingSide = country.cars?.driving_side === 'left'
      ? 'Por la izquierda (volante a la derecha)'
      : (country.cars?.driving_side === 'right' ? 'Por la derecha' : 'No disponible');

    // enlace al sitio web oficial del gobierno
    const officialSite = country.links?.official;
    const siteLink = officialSite
      ? `<a href="${officialSite}" target="_blank" rel="noopener noreferrer" style="color: var(--primary-color); text-decoration: underline; word-break: break-all;">Visitar sitio oficial ↗</a>`
      : 'No disponible';

    // paises limitrofes con nombres en español
    const borders = Array.isArray(country.borders) && country.borders.length > 0
      ? country.borders
          .map((b: string) => `<a href="#/detalle/${b}" class="badge-border">${getCountryNameFromCode(b)}</a>`)
          .join(' ')
      : '<span style="color: var(--text-secondary); font-size: 0.9rem;">No posee fronteras terrestres</span>';

    // codigo ISO
    const isoCodeStr = country.codes?.alpha_3 || country.codes?.alpha_2 || 'Sin código asignado';

    container.innerHTML = `
      <section class="view">
        <a href="#/busqueda" class="btn btn-secondary" style="margin-bottom: 1.5rem;">← Volver al buscador</a>

        <div class="country-detail-layout">
          <!-- columna lateral con la bandera y el boton -->
          <div class="country-detail-sidebar">
            <div class="country-detail-flag-wrapper">
              <img src="${flagUrl}" alt="Bandera de ${name}" class="country-detail-flag" onerror="this.src='https://flagcdn.com/w640/un.png';" />
            </div>

            <button id="show-wishlist-form" class="${wishlistButtonClass}" type="button" style="width: 100%; margin-top: 1rem;">
              ${wishlistButtonText}
            </button>

            ${isSaved ? `<p style="text-align: center; font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">Guardado en deseos (${existingCount})</p>` : '<p style="text-align: center; font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem; opacity: 0.9;">Todavía no está en tu lista</p>'}
          </div>

          <!-- columna principal con los datos del pais -->
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

            <!-- formulario de lista de deseos (RF5) -->
            <div class="wishlist-form-card is-hidden" id="wishlist-form-wrapper">
              <h3 style="font-size: 1rem; margin-bottom: 1rem;">Agregar a lista de deseos</h3>
              
              <form id="wishlist-form" style="display: flex; flex-direction: column; gap: 1rem;" novalidate>
                <div class="form-group">
                  <label for="wishlist-priority" style="font-size: 0.85rem; font-weight: 600;">Prioridad</label>
                  <select id="wishlist-priority" class="form-select" name="priority" required>
                    <option value="1">1 - Muy baja</option>
                    <option value="2">2 - Baja</option>
                    <option value="3" selected>3 - Media</option>
                    <option value="4">4 - Alta</option>
                    <option value="5">5 - Muy alta</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="wishlist-category" style="font-size: 0.85rem; font-weight: 600;">Categoría</label>
                  <select id="wishlist-category" class="form-select" name="category" required>
                    <option value="Vacaciones">Vacaciones</option>
                    <option value="Turismo">Turismo</option>
                    <option value="Aventura">Aventura</option>
                    <option value="Cultura">Cultura</option>
                    <option value="Trabajo">Trabajo</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="wishlist-note" style="font-size: 0.85rem; font-weight: 600;">Nota (opcional)</label>
                  <textarea id="wishlist-note" class="form-textarea" name="note" maxlength="180" rows="3" placeholder="Observaciones o notas sobre este destino..."></textarea>
                </div>


                <div style="display: flex; gap: 0.75rem;">
                  <button type="submit" class="btn btn-primary">Guardar</button>
                  <button type="button" class="btn btn-secondary" id="cancel-wishlist-form">Cancelar</button>
                </div>

                <p class="form-message" id="wishlist-form-message" style="margin-top: 0.5rem; font-size: 0.85rem;"></p>
              </form>

            </div>
          </div>
        </div>
      </section>
    `;

    const formWrapper = document.getElementById('wishlist-form-wrapper');
    const showFormButton = document.getElementById('show-wishlist-form');
    const cancelButton = document.getElementById('cancel-wishlist-form');
    const form = document.getElementById('wishlist-form') as HTMLFormElement | null;
    const message = document.getElementById('wishlist-form-message');

    showFormButton?.addEventListener('click', () => {
      if (!formWrapper) return;

      if (isSaved) {
        const savedItem = existingWishlistItems[0];
        openConfirmationModal(
          {
            title: 'Eliminar de la lista',
            message: `¿Querés quitar ${name} de tus deseos?`,
            confirmText: 'Eliminar',
            cancelText: 'Cancelar',
            variant: 'danger',
          },
          () => {
            if (savedItem) {
              removeFromWishlist(savedItem.id);
            }
            renderCountryDetail(container, countryCode);
          }
        );
        return;
      }

      formWrapper.classList.remove('is-hidden');
      formWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (message) message.textContent = '';
      message?.classList.remove('form-message--error', 'form-message--success');
    });

    cancelButton?.addEventListener('click', () => {
      formWrapper?.classList.add('is-hidden');
      form?.reset();
      if (message) message.textContent = '';
      message?.classList.remove('form-message--error', 'form-message--success');
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
            message: `Ya agregaste ${name} a tu lista de deseos. ¿Querés actualizar su información?`,
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

            form.reset();
            formWrapper?.classList.add('is-hidden');
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

      form.reset();
      formWrapper?.classList.add('is-hidden');
      renderCountryDetail(container, countryCode);

      if (message) {
        message.textContent = 'Destino guardado en la lista de deseos.';
        message.classList.remove('form-message--error');
        message.classList.add('form-message--success');
      }
    });

  } catch (error) {
    container.innerHTML = `
      <section class="view">
        ${renderEmptyState({
          title: 'No pudimos encontrar este destino',
          description: 'El país que buscás no existe o no se encuentra disponible en este momento.',
          actionHref: '#/busqueda',
          actionText: 'Volver al buscador'
        })}
      </section>
    `;
  }
}


