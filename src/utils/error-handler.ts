export function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === 'string' && error.trim()) {
    return error.trim();
  }

  return 'Ocurrió un error inesperado.';
}

export function renderErrorState(
  container: HTMLElement,
  options: {
    title?: string;
    message?: string;
    actionLabel?: string;
    onAction?: () => void;
  } = {}
) {
  const title = options.title || 'Hubo un problema';
  const message = options.message || 'No se pudo completar la operación.';
  const actionLabel = options.actionLabel || 'Reintentar';

  container.innerHTML = `
    <section class="view">
      <div class="wishlist-empty">
        <h1>⚠️ ${title}</h1>
        <p>${message}</p>
        ${options.onAction ? `<button type="button" class="btn btn-primary" id="error-action-btn">${actionLabel}</button>` : ''}
      </div>
    </section>
  `;

  const actionButton = document.getElementById('error-action-btn');
  if (actionButton && options.onAction) {
    actionButton.addEventListener('click', options.onAction);
  }
}
