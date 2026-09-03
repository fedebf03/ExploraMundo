import { getCountries } from '../services/api.service';
import { renderCountryCard } from '../components/country-card';
import { renderLoader } from '../components/loader';
import { renderEmptyState } from '../components/empty-state';

export async function renderHome(container: HTMLElement) {
  container.innerHTML = `
    <section class="view">
      <div class="hero">
        <h1>Explorá tu próximo destino</h1>
        <p>Encontrá información clave, cultura y datos útiles para planear tu viaje.</p>

        <a href="#/busqueda" class="btn btn-primary hero__action">Buscar destinos</a>
      </div>


      <h2>Destinos aleatorios</h2>
      <div id="home-countries" class="countries-grid">
        ${renderLoader('Cargando países...')}
      </div>

    </section>
  `;

  const gridContainer = document.getElementById('home-countries');
  if (!gridContainer) return;

  try {
    // traemos exactamente 12 paises aleatorios desde la API con un offset al azar
    const randomOffset = Math.floor(Math.random() * 235);
    const response = await getCountries(12, randomOffset);
    const countries = response.data?.objects || [];

    if (countries.length === 0) {
      gridContainer.innerHTML = renderEmptyState({
        icon: '🌍',
        title: 'No se encontraron países',
        description: 'No pudimos cargar los destinos en este momento.'
      });
      return;
    }

    gridContainer.innerHTML = countries.map(renderCountryCard).join('');

  } catch (error) {
    gridContainer.innerHTML = renderEmptyState({
      title: 'No se pudieron cargar los países',
      description: 'Probá de nuevo en unos momentos.',
      actionHref: '#/',
      actionText: 'Reintentar'
    });
  }



}

