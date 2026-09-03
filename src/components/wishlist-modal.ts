import { addToWishlist, getWishlist, removeFromWishlist } from '../services/storage.service';
import { openConfirmationModal } from './modal';

export function renderWishlistFormModal(): string {
  return `
    <div class="wishlist-modal-backdrop is-hidden" id="wishlist-modal-backdrop">
      <div class="wishlist-modal">
        <div class="wishlist-modal__header">
          <h3 id="wishlist-modal-title">Guardar en favoritos</h3>
          <button type="button" class="wishlist-modal__close" id="close-wishlist-modal">×</button>
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
              <option value="Vacaciones">Vacaciones</option>
              <option value="Turismo">Turismo</option>
              <option value="Aventura">Aventura</option>
              <option value="Cultura">Cultura</option>
              <option value="Trabajo">Trabajo</option>
            </select>
          </div>

          <div class="form-group">
            <label for="wishlist-note">Nota (opcional, máx. 60 caracteres)</label>
            <textarea id="wishlist-note" class="form-textarea" name="note" maxlength="60" rows="2" placeholder="Observaciones breves sobre este destino..."></textarea>
          </div>

          <div class="wishlist-modal__actions">
            <button type="submit" class="btn btn-primary">Guardar</button>
            <button type="button" class="btn btn-secondary" id="cancel-wishlist-form">Cancelar</button>
          </div>

          <p class="form-message" id="wishlist-form-message"></p>
        </form>
      </div>
    </div>
  `;
}

export function renderDeleteConfirmationModal(): string {
  return `
    <div class="wishlist-delete-modal is-hidden" id="wishlist-delete-modal">
      <div class="wishlist-modal">
        <div class="wishlist-modal__header">
          <h3 id="wishlist-delete-title">Eliminar de favoritos</h3>
          <button type="button" class="wishlist-modal__close" id="close-delete-modal">×</button>
        </div>


        <p class="wishlist-delete-modal__text">¿Querés quitar este destino de tus favoritos?</p>


        <div class="wishlist-modal__actions">
          <button type="button" class="btn btn-danger" id="confirm-delete-wishlist">Eliminar</button>
          <button type="button" class="btn btn-secondary" id="cancel-delete-wishlist">Cancelar</button>
        </div>
      </div>
    </div>
  `;
}

// inicializa eventos y validaciones del modal de favoritos
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
  const deleteModal = document.getElementById('wishlist-delete-modal');
  const wishlistButton = document.getElementById('wishlist-toggle-button');
  const form = document.getElementById('wishlist-form') as HTMLFormElement | null;
  const message = document.getElementById('wishlist-form-message');
  const cancelButton = document.getElementById('cancel-wishlist-form');
  const closeModalButton = document.getElementById('close-wishlist-modal');
  const closeDeleteModalButton = document.getElementById('close-delete-modal');
  const cancelDeleteButton = document.getElementById('cancel-delete-wishlist');
  const confirmDeleteButton = document.getElementById('confirm-delete-wishlist');

  const closeFormModal = () => {
    formModal?.classList.add('is-hidden');
    form?.reset();
    if (message) {
      message.textContent = '';
      message.classList.remove('form-message--error');
      message.classList.remove('form-message--success');
    }
  };

  const openFormModal = () => {
    formModal?.classList.remove('is-hidden');
  };

  const closeDeleteModal = () => {
    deleteModal?.classList.add('is-hidden');
  };

  const openDeleteModal = () => {
    deleteModal?.classList.remove('is-hidden');
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
    if (savedItemId) {
      removeFromWishlist(savedItemId);
    }
    closeDeleteModal();
    onUpdate();
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
          message: `Ya agregaste ${countryName} a tus favoritos. ¿Querés actualizar su información?`,
          confirmText: 'Actualizar',
          cancelText: 'No',
          variant: 'primary',
        },
        () => {
          addToWishlist({
            countryCode,
            countryName,
            flag: flagUrl,
            priority,
            category,
            note,
          });
          closeFormModal();
          onUpdate();
        }
      );
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

    closeFormModal();
    onUpdate();
  });
}
