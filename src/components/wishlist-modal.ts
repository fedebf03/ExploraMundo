import { addToWishlist, getWishlist, removeFromWishlist } from '../services/storage.service';
import { openConfirmationModal } from './modal';


export function renderWishlistFormModal(): string {
  return `
    <div class="wishlist-modal-backdrop is-hidden" id="wishlist-modal-backdrop">
      <div class="wishlist-modal">
        <div id="wishlist-modal-form-view">
          <div class="wishlist-modal__header">
            <h3 id="wishlist-modal-title">Guardar en favoritos</h3>
          </div>

          <form id="wishlist-form" class="wishlist-form" novalidate>
            <div class="form-group">
              <label for="wishlist-priority">Prioridad</label>
              <select id="wishlist-priority" class="form-select" name="priority" required>
                <option value="1">1 - Muy baja</option>
                <option value="2">2 - Baja</option>
                <option value="3" selected>3 - Media</option>
                <option value="4">4 - Alta</option>
                <option value="5">5 - Muy alta</option>
              </select>
            </div>

            <div class="form-group">
              <label for="wishlist-category">Categoría</label>
              <select id="wishlist-category" class="form-select" name="category" required>
                <option value="Vacaciones" selected>Vacaciones</option>
                <option value="Turismo">Turismo</option>
                <option value="Aventura y naturaleza">Aventura y naturaleza</option>
                <option value="Playa">Playa</option>
                <option value="Cultura e historia">Cultura e historia</option>
                <option value="Gastronomía">Gastronomía</option>
                <option value="Mochilero">Mochilero</option>
                <option value="Estudio o intercambio">Estudio o intercambio</option>
                <option value="Nómada digital">Nómada digital</option>
                <option value="Trabajo">Trabajo</option>
              </select>
            </div>

            <div class="form-group">
              <label for="wishlist-note">Nota (opcional, máx. 60 caracteres)</label>
              <textarea id="wishlist-note" class="form-textarea" name="note" maxlength="60" rows="2" placeholder="Observaciones breves sobre este destino..."></textarea>
            </div>

            <div class="wishlist-modal__actions">
              <button type="button" class="btn btn-secondary" id="cancel-wishlist-form">Cancelar</button>
              <button type="submit" class="btn btn-primary">Guardar</button>
            </div>

            <p class="form-message" id="wishlist-form-message"></p>
          </form>
        </div>

        <div id="wishlist-modal-success" class="wishlist-modal__success is-hidden">
          <div class="wishlist-modal__success-icon">✓</div>
          <h3 class="wishlist-modal__success-title">Destino guardado con éxito</h3>
        </div>

        <div id="wishlist-modal-error" class="wishlist-modal__error is-hidden">
          <div class="wishlist-modal__error-icon">✕</div>
          <h3 class="wishlist-modal__error-title">No se puede guardar este destino porque ya está en favoritos</h3>
        </div>
      </div>
    </div>


  `;
}



export function initWishlistModal(options: {
  countryCode: string;
  countryName: string;
  flagUrl: string;
  isSaved: boolean;
  savedItemId?: string;
  onUpdate: () => void;
}) {
  const { countryCode, countryName, flagUrl, isSaved, savedItemId, onUpdate } = options;

  const formModal = document.getElementById('wishlist-modal-backdrop');
  const wishlistButton = document.getElementById('wishlist-toggle-button');
  const form = document.getElementById('wishlist-form') as HTMLFormElement | null;
  const message = document.getElementById('wishlist-form-message');
  const cancelButton = document.getElementById('cancel-wishlist-form');

  const formView = document.getElementById('wishlist-modal-form-view');
  const successView = document.getElementById('wishlist-modal-success');
  const errorView = document.getElementById('wishlist-modal-error');
  let redirectTimer: ReturnType<typeof setTimeout> | null = null;

  const showSuccessState = () => {
    if (formView && successView) {
      formView.classList.add('is-hidden');
      successView.classList.remove('is-hidden');
    }

    if (redirectTimer) clearTimeout(redirectTimer);
    redirectTimer = setTimeout(() => {
      closeFormModal();
      onUpdate();
    }, 1500);
  };

  const showErrorState = () => {
    if (formView && errorView) {
      formView.classList.add('is-hidden');
      errorView.classList.remove('is-hidden');
    }

    if (redirectTimer) clearTimeout(redirectTimer);
    redirectTimer = setTimeout(() => {
      closeFormModal();
      window.location.reload();
    }, 2000);
  };

  const closeFormModal = () => {
    formModal?.classList.add('is-hidden');
    document.body.classList.remove('modal-open');
    form?.reset();
    if (message) {
      message.textContent = '';
      message.classList.remove('form-message--error');
      message.classList.remove('form-message--success');
    }
    if (formView && successView && errorView) {
      formView.classList.remove('is-hidden');
      successView.classList.add('is-hidden');
      errorView.classList.add('is-hidden');
    }
    if (redirectTimer) {
      clearTimeout(redirectTimer);
      redirectTimer = null;
    }
  };

  const openFormModal = () => {
    formModal?.classList.remove('is-hidden');
    document.body.classList.add('modal-open');
    if (formView && successView && errorView) {
      formView.classList.remove('is-hidden');
      successView.classList.add('is-hidden');
      errorView.classList.add('is-hidden');
    }
    if (redirectTimer) {
      clearTimeout(redirectTimer);
      redirectTimer = null;
    }
  };


  wishlistButton?.addEventListener('click', () => {
    if (isSaved) {
      openConfirmationModal(
        {
          title: 'Eliminar de favoritos',
          message: `¿Querés quitar ${countryName} de tus favoritos?`,
          confirmText: 'Eliminar',
          cancelText: 'Cancelar',
          variant: 'danger',
        },
        () => {
          const itemToDelete = savedItemId || getWishlist().find((item) => item.countryCode === countryCode)?.id;
          if (itemToDelete) {
            removeFromWishlist(itemToDelete);
          }
          onUpdate();
        }
      );
      return;
    }
    openFormModal();
  });

  cancelButton?.addEventListener('click', closeFormModal);

  formModal?.addEventListener('click', (event) => {
    if (event.target === formModal) {
      closeFormModal();
    }
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && formModal && !formModal.classList.contains('is-hidden')) {
      closeFormModal();
    }
  });

  form?.querySelectorAll('input, select, textarea').forEach((input) => {
    input.addEventListener('input', () => {
      if (message?.classList.contains('form-message--error')) {
        message.textContent = '';
        message.classList.remove('form-message--error');
      }
    });
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

    if (note.length > 60) {
      if (message) {
        message.textContent = 'La nota no puede superar los 60 caracteres.';
        message.classList.add('form-message--error');
      }
      return;
    }

    const alreadyExists = getWishlist().some((item) => item.countryCode === countryCode);

    if (alreadyExists) {
      showErrorState();
      return;
    }


    addToWishlist({
      countryCode,
      countryName,
      flag: flagUrl,
      priority,
      category,
      note,
    });

    showSuccessState();
  });


}
