import { getCountryByCode } from '../services/api.service';
import { getFlagUrl } from '../components/country-card';
import { addWishlistItem, getWishlist } from './wishlist.view';

export async function renderCountryDetail(container: HTMLElement, countryCode: string) {
  if (!countryCode) {
    container.innerHTML = `
      <section class="view">
        <h1>País no encontrado</h1>
        <a href="#/search" class="btn btn-primary">Volver a buscar</a>
      </section>
    `;
    return;
  }

  try {
    const country = await getCountryByCode(countryCode);
    const name = country.names?.common || country.name?.common || 'País sin nombre';
    const flagUrl = getFlagUrl(country);
    const capital = country.capitals?.[0]?.name || country.capital?.[0] || 'Sin capital';
    const region = country.region || 'Desconocida';
    const population = country.population ? Number(country.population).toLocaleString('es-AR') : '0';
    const existingCount = getWishlist().filter((item) => item.countryCode === countryCode).length;

    container.innerHTML = `
      <section class="view">
        <a href="#/search" class="btn btn-secondary" style="margin-bottom: 1rem;">← Volver</a>

        <article class="detail-card">
          <div class="detail-card__header">
            <img src="${flagUrl}" alt="Bandera de ${name}" class="detail-card__flag" />
            <div>
              <h1>${name}</h1>
              <p>${region}</p>
            </div>
          </div>

          <div class="detail-card__info">
            <span><strong>Capital:</strong> ${capital}</span>
            <span><strong>Población:</strong> ${population} hab.</span>
            <span><strong>Código:</strong> ${countryCode}</span>
          </div>

          <div class="detail-card__actions">
            <button id="show-wishlist-form" class="btn btn-primary" type="button">
              Agregar a lista de deseos
            </button>
          </div>

          <div class="wishlist-form-wrapper is-hidden" id="wishlist-form-wrapper">
            <form id="wishlist-form" class="wishlist-form" novalidate>
              <div class="form-group">
                <label for="wishlist-priority">Prioridad</label>
                <input id="wishlist-priority" class="form-input" name="priority" type="number" min="1" step="1" placeholder="Ej: 2" required />
              </div>

              <div class="form-group">
                <label for="wishlist-category">Categoría / etiqueta</label>
                <input id="wishlist-category" class="form-input" name="category" type="text" maxlength="40" placeholder="Ej: playa, cultura, gastronomía" required />
              </div>

              <div class="form-group form-group--full">
                <label for="wishlist-note">Nota personal</label>
                <textarea id="wishlist-note" class="form-textarea" name="note" maxlength="180" rows="3" placeholder="Escribí un detalle para recordar por qué te interesa."></textarea>
              </div>

              <div class="wishlist-form__actions">
                <button type="submit" class="btn btn-primary">Guardar en la lista</button>
                <button type="button" class="btn btn-secondary" id="cancel-wishlist-form">Cancelar</button>
              </div>

              <p class="form-message" id="wishlist-form-message" aria-live="polite"></p>
            </form>
          </div>

          <div class="detail-card__meta">
            <span>En tu lista: ${existingCount} ${existingCount === 1 ? 'artículo' : 'artículos'}</span>
          </div>
        </article>
      </section>
    `;

    const formWrapper = document.getElementById('wishlist-form-wrapper');
    const showFormButton = document.getElementById('show-wishlist-form');
    const cancelButton = document.getElementById('cancel-wishlist-form');
    const form = document.getElementById('wishlist-form') as HTMLFormElement | null;
    const message = document.getElementById('wishlist-form-message');

    showFormButton?.addEventListener('click', () => {
      formWrapper?.classList.remove('is-hidden');
      const priorityInput = document.getElementById('wishlist-priority') as HTMLInputElement | null;
      priorityInput?.focus();
    });

    cancelButton?.addEventListener('click', () => {
      formWrapper?.classList.add('is-hidden');
      form?.reset();
      if (message) {
        message.textContent = '';
        message.classList.remove('form-message--error', 'form-message--success');
      }
    });

    form?.addEventListener('submit', (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const priority = Number(formData.get('priority'));
      const category = String(formData.get('category') || '').trim();
      const note = String(formData.get('note') || '').trim();

      if (!Number.isFinite(priority) || priority <= 0) {
        if (message) {
          message.textContent = 'La prioridad debe ser un número mayor a cero.';
          message.classList.remove('form-message--success');
          message.classList.add('form-message--error');
        }
        return;
      }

      if (!category) {
        if (message) {
          message.textContent = 'La categoría o etiqueta es obligatoria.';
          message.classList.remove('form-message--success');
          message.classList.add('form-message--error');
        }
        return;
      }

      if (note.length > 180) {
        if (message) {
          message.textContent = 'La nota personal no puede superar los 180 caracteres.';
          message.classList.remove('form-message--success');
          message.classList.add('form-message--error');
        }
        return;
      }

      addWishlistItem({
        countryCode,
        countryName: name,
        flag: flagUrl,
        priority,
        category,
        note,
      });

      form.reset();
      formWrapper?.classList.add('is-hidden');

      const updatedCount = getWishlist().filter((item) => item.countryCode === countryCode).length;
      const meta = document.querySelector('.detail-card__meta span');
      if (meta) {
        meta.textContent = `En tu lista: ${updatedCount} ${updatedCount === 1 ? 'artículo' : 'artículos'}`;
      }

      if (message) {
        message.textContent = `¡Guardado! ${name} quedó agregado a tu lista de deseos.`;
        message.classList.remove('form-message--error');
        message.classList.add('form-message--success');
      }
    });
  } catch (error) {
    container.innerHTML = `
      <section class="view">
        <h1>Hubo un problema</h1>
        <p>${error instanceof Error ? error.message : 'No se pudo cargar el país.'}</p>
        <a href="#/search" class="btn btn-primary">Volver a buscar</a>
      </section>
    `;
  }
}
