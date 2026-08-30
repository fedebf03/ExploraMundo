import { getCountryByCode } from '../services/api.service';
import { getFlagUrl } from '../components/country-card';
import { addToWishlist, getWishlist } from '../services/storage.service';
import { getCountryNameFromCode } from '../utils/country-codes';

export async function renderCountryDetail(container: HTMLElement, countryCode: string) {
  if (!countryCode) {
    container.innerHTML = `
      <section class="view">
        <h1>País no encontrado</h1>
        <a href="#/busqueda" class="btn btn-primary" style="margin-top: 1rem;">Volver al buscador</a>
      </section>
    `;
    return;
  }

  container.innerHTML = `
    <section class="view">
      <p style="text-align: center; color: var(--text-secondary); padding: 2rem;">Cargando información del país...</p>
    </section>
  `;

  try {
    const country = await getCountryByCode(countryCode);

    const name = country.names?.common || country.name?.common || 'País sin nombre';
    const officialName = country.names?.official || country.name?.official || '';
    const flagUrl = getFlagUrl(country);
    const capital = country.capitals?.[0]?.name || country.capital?.[0] || 'Sin capital';
    const region = country.region || 'Desconocida';
    const subregion = country.subregion || '';
    const population = country.population ? Number(country.population).toLocaleString('es-AR') : '0';
    const existingCount = getWishlist().filter((item) => item.countryCode === countryCode).length;

    // idiomas
    const languages = Array.isArray(country.languages)
      ? country.languages.map((l: any) => l.name || l.native_name).filter(Boolean).join(', ')
      : 'No disponible';

    // monedas
    const currencies = Array.isArray(country.currencies)
      ? country.currencies.map((c: any) => `${c.name} (${c.symbol || c.code})`).join(', ')
      : 'No disponible';

    // paises limitrofes con nombres en español
    const borders = Array.isArray(country.borders) && country.borders.length > 0
      ? country.borders
          .map((b: string) => `<a href="#/detalle/${b}" class="badge-border">${getCountryNameFromCode(b)}</a>`)
          .join(' ')
      : '<span style="color: var(--text-secondary); font-size: 0.9rem;">No posee fronteras terrestres</span>';



    container.innerHTML = `
      <section class="view">
        <a href="#/busqueda" class="btn btn-secondary" style="margin-bottom: 1.5rem;">← Volver al buscador</a>

        <div class="country-detail-layout">
          <!-- columna lateral con la bandera y el boton -->
          <div class="country-detail-sidebar">
            <div class="country-detail-flag-wrapper">
              <img src="${flagUrl}" alt="Bandera de ${name}" class="country-detail-flag" onerror="this.src='https://flagcdn.com/w640/un.png';" />
            </div>

            <button id="show-wishlist-form" class="btn btn-primary" type="button" style="width: 100%; margin-top: 1rem;">
              Agregar a lista de deseos
            </button>

            ${existingCount > 0 ? `<p style="text-align: center; font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">Guardado en deseos (${existingCount})</p>` : ''}
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
                <li><strong>Idiomas oficiales:</strong> <span>${languages}</span></li>
                <li><strong>Moneda oficial:</strong> <span>${currencies}</span></li>
                <li><strong>Código ISO:</strong> <span>${countryCode}</span></li>
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

                <p class="form-message" id="wishlist-form-message" aria-live="polite" style="margin-top: 0.5rem; font-size: 0.85rem;"></p>
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
      formWrapper?.classList.toggle('is-hidden');
    });

    cancelButton?.addEventListener('click', () => {
      formWrapper?.classList.add('is-hidden');
      form?.reset();
      if (message) message.textContent = '';
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

      if (message) {
        message.textContent = 'Destino guardado en la lista de deseos.';
        message.classList.remove('form-message--error');
        message.classList.add('form-message--success');
      }
    });

  } catch (error) {
    container.innerHTML = `
      <section class="view">
        <h1>Hubo un problema</h1>
        <p style="color: var(--danger-color); margin-top: 0.5rem;">${error instanceof Error ? error.message : 'No se pudo cargar el país.'}</p>
        <a href="#/busqueda" class="btn btn-primary" style="margin-top: 1rem;">Volver al buscador</a>
      </section>
    `;
  }
}
