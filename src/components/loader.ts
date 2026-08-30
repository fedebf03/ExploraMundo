// componente reutilizable de spinner y estado de carga
export function renderLoader(message: string = 'Cargando...'): string {
  return `
    <div class="loader-container">
      <div class="spinner"></div>
      <p class="loader-text">${message}</p>
    </div>
  `;
}


