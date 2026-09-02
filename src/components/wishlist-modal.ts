export function renderWishlistFormModal(): string {
  return `
    <div class="wishlist-modal-backdrop is-hidden" id="wishlist-modal-backdrop" aria-hidden="true">
      <div class="wishlist-modal" role="dialog" aria-modal="true" aria-labelledby="wishlist-modal-title">
        <div class="wishlist-modal__header">
          <h3 id="wishlist-modal-title">Guardar en favoritos</h3>
          <button type="button" class="wishlist-modal__close" id="close-wishlist-modal" aria-label="Cerrar modal">×</button>
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
    <div class="wishlist-delete-modal is-hidden" id="wishlist-delete-modal" aria-hidden="true">
      <div class="wishlist-modal" role="dialog" aria-modal="true" aria-labelledby="wishlist-delete-title">
        <div class="wishlist-modal__header">
          <h3 id="wishlist-delete-title">Eliminar de favoritos</h3>
          <button type="button" class="wishlist-modal__close" id="close-delete-modal" aria-label="Cerrar confirmación">×</button>
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
