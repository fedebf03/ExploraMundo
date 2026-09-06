export interface ModalOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'primary' | 'danger';
}

export function openConfirmationModal(
  options: ModalOptions,
  onConfirm: () => void,
  onCancel?: () => void,
): void {
  const existing = document.querySelector('.confirmation-modal');
  if (existing) {
    existing.remove();
  }

  const modal = document.createElement('div');
  modal.className = 'confirmation-modal';

  const confirmLabel = options.confirmText || 'Confirmar';

  const cancelLabel = options.cancelText || 'Cancelar';
  const variantClass = options.variant === 'danger' ? 'is-danger' : 'is-primary';

  modal.innerHTML = `
    <div class="confirmation-modal__card">
      <h3 class="confirmation-modal__title">${options.title}</h3>
      <p class="confirmation-modal__message">${options.message}</p>
      <div class="confirmation-modal__actions">
        <button type="button" class="confirmation-modal__button" data-modal-action="cancel">${cancelLabel}</button>
        <button type="button" class="confirmation-modal__button ${variantClass}" data-modal-action="confirm">${confirmLabel}</button>
      </div>
    </div>
  `;


  const closeModal = () => {
    modal.remove();
    document.body.classList.remove('modal-open');
  };

  document.body.classList.add('modal-open');


  modal.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (target === modal) {
      closeModal();
      onCancel?.();
    }
  });

  const cancelButton = modal.querySelector('[data-modal-action="cancel"]') as HTMLButtonElement | null;
  const confirmButton = modal.querySelector('[data-modal-action="confirm"]') as HTMLButtonElement | null;

  cancelButton?.addEventListener('click', () => {
    closeModal();
    onCancel?.();
  });

  confirmButton?.addEventListener('click', () => {
    closeModal();
    onConfirm();
  });

  window.addEventListener('keydown', handleEscape, { once: true });

  function handleEscape(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeModal();
      onCancel?.();
    }
  }

  document.body.appendChild(modal);
}
