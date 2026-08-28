import { renderHome } from './views/home.view';
import { renderSearch } from './views/search.view';

// función para arrancar a escuchar los cambios de pantalla
export function initRouter() {
  // escuchamos cuando cambia el hash en la url
  window.addEventListener('hashchange', handleRouteChange);

  // ejecutamos una vez al principio para cargar la vista actual
  handleRouteChange();
}


function handleRouteChange() {
  // agarramos la ruta actual del hash (si no hay nada mandamos al inicio)
  const hash = window.location.hash || '#/';
  const app = document.getElementById('app');

  if (!app) return;

  // pintamos de activo el botón de la barra según la sección
  updateActiveNavLink(hash);

  // según la ruta cargamos la pantalla que corresponda
  switch (hash) {
    case '#/':
      renderHome(app);
      break;

    case '#/search':
      renderSearch(app);
      break;


    case '#/wishlist':
      app.innerHTML = `
        <section class="view">
          <h1>💖 Lista de Deseos</h1>
          <p>Países guardados.</p>
        </section>
      `;
      break;

    case '#/history':
      app.innerHTML = `
        <section class="view">
          <h1>🕒 Historial de Visitas</h1>
          <p>Países que estuviste observando.</p>
        </section>
      `;
      break;

    case '#/contact':
      app.innerHTML = `
        <section class="view">
          <h1>📍 Contacto</h1>
          <p>Información del lugar.</p>
        </section>
      `;
      break;

    default:
      app.innerHTML = `
        <section class="view">
          <h1>404 - Página no encontrada</h1>
          <a href="#/" class="btn btn-primary">Volver al Inicio</a>
        </section>
      `;
  }
}

// función para ponerle la clase .active al botón de la navbar que tocamos
function updateActiveNavLink(currentHash: string) {
  const navLinks = document.querySelectorAll('.nav-item');
  navLinks.forEach((link) => {
    const route = link.getAttribute('data-route');
    // comparamos si la ruta del botón coincide con el hash actual
    if (route && (currentHash === `#${route}` || (currentHash === '#/' && route === '/'))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}
