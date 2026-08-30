// componente reutilizable de spinner y estado de carga
export function renderLoader(message: string = 'Cargando...'): string {
  return `
    <div class="loader-container" role="status" aria-live="polite">
      <div class="spinner" aria-hidden="true"></div>
      <p class="loader-text">${message}</p>
    </div>
  `;
}

