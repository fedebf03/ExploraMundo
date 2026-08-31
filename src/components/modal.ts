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
    <style>
      .confirmation-modal {
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(2, 6, 23, 0.7);
        z-index: 200;
        padding: 1rem;
      }

      .confirmation-modal__card {
        width: min(100%, 360px);
        background: #0f172a;
        border: 1px solid rgba(148, 163, 184, 0.35);
        box-shadow: 0 20px 50px rgba(15, 23, 42, 0.5);
        padding: 1.25rem;
      }

      .confirmation-modal__title {
        margin: 0 0 0.75rem;
        font-size: 1.3rem;
        color: #f8fafc;
      }

      .confirmation-modal__message {
        margin: 0 0 1rem;
        color: #cbd5e1;
        line-height: 1.5;
      }

      .confirmation-modal__actions {
        display: flex;
        gap: 0.75rem;
        justify-content: flex-end;
      }

      .confirmation-modal__button {
        min-height: 44px;
        border: 1px solid rgba(148, 163, 184, 0.5);
        background: #1e293b;
        color: #f8fafc;
        padding: 0.65rem 1rem;
        font-weight: 700;
        cursor: pointer;
      }

      .confirmation-modal__button.is-danger {
        background: #b91c1c;
        border-color: rgba(248, 113, 113, 0.8);
      }

      .confirmation-modal__button.is-primary {
        background: #0ea5e9;
        border-color: rgba(125, 211, 252, 0.8);
      }
    </style>

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
    document.body.style.overflow = '';
  };

  document.body.style.overflow = 'hidden';

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
