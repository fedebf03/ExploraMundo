import { renderHome } from './views/home.view';
import { renderSearch } from './views/search.view';
import { renderCountryDetail } from './views/detail.view';
import { renderWishlist } from './views/wishlist.view';
import { renderHistory } from './views/history.view';



const ROUTER_INITIALIZED_KEY = '__exploramundo_router_initialized__';

// función para arrancar a escuchar los cambios de pantalla
export function initRouter() {
  const globalWindow = window as typeof window & {
    [ROUTER_INITIALIZED_KEY]?: boolean;
  };

  if (globalWindow[ROUTER_INITIALIZED_KEY]) {
    return;
  }

  globalWindow[ROUTER_INITIALIZED_KEY] = true;

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
  switch (true) {
    case hash === '#/' || hash === '':
      renderHome(app);
      break;

    case hash === '#/busqueda' || hash === '#/search':
      renderSearch(app);
      break;

    case hash === '#/deseos' || hash === '#/wishlist':
      renderWishlist(app);
      break;

    case hash.startsWith('#/detalle/'):
      renderCountryDetail(app, hash.replace('#/detalle/', ''));
      break;

    case hash.startsWith('#/detail/'):
      renderCountryDetail(app, hash.replace('#/detail/', ''));
      break;

    case hash === '#/historial' || hash === '#/history':
      renderHistory(app);
      break;

    case hash === '#/contacto' || hash === '#/contact':
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
