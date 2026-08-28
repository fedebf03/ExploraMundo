import { getCountries } from '../services/api.service';
import { renderCountryCard } from '../components/country-card';

// función principal que monta la pantalla de Inicio
export async function renderHome(container: HTMLElement) {
  container.innerHTML = `
    <section class="view">
      <div class="hero" style="text-align: center; margin-bottom: 2rem;">
        <h1>🌍 Explorá tu próximo destino</h1>
        <p>Encontrá información clave, cultura y datos útiles para planear tu viaje.</p>
        <a href="#/search" class="btn btn-primary" style="margin-top: 1rem;">Buscar destinos</a>
      </div>

      <h2>Destinos aleatorios</h2>
      <div id="home-countries" class="countries-grid">
        <p style="grid-column: 1 / -1; text-align: center; color: var(--text-secondary);">Cargando países desde la API...</p>
      </div>
    </section>
  `;

  const gridContainer = document.getElementById('home-countries');
  if (!gridContainer) return;

  try {
    // traemos un lote aleatorio de la API y seleccionamos 8
    const randomOffset = Math.floor(Math.random() * 150);
    const response = await getCountries(20, randomOffset);
    const rawCountries = response.data?.objects || [];

    const countries = rawCountries.sort(() => 0.5 - Math.random()).slice(0, 8);

    if (countries.length === 0) {
      gridContainer.innerHTML = `<p style="grid-column: 1 / -1; text-align: center;">No se encontraron países.</p>`;
      return;
    }

    gridContainer.innerHTML = countries.map(renderCountryCard).join('');
  } catch (error) {
    gridContainer.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; color: var(--danger-color);">
        <p>Hubo un problema al cargar los países.</p>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">${error instanceof Error ? error.message : 'Error desconocido'}</p>
      </div>
    `;
  }
}
