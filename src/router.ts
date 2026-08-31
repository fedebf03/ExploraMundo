import { renderHome } from './views/home.view';
import { renderSearch } from './views/search.view';
import { renderCountryDetail } from './views/detail.view';
import { renderWishlist } from './views/wishlist.view';
import { renderHistory } from './views/history.view';
import { renderContact } from './views/contact.view';

const ROUTER_INITIALIZED_KEY = '__exploramundo_router_initialized__';

export function initRouter() {
  const globalWindow = window as typeof window & {
    [ROUTER_INITIALIZED_KEY]?: boolean;
  };

  if (globalWindow[ROUTER_INITIALIZED_KEY]) {
    return;
  }

  globalWindow[ROUTER_INITIALIZED_KEY] = true;

  window.addEventListener('hashchange', handleRouteChange);
  handleRouteChange();
}

function handleRouteChange() {
  const hash = window.location.hash || '#/';
  const app = document.getElementById('app');

  if (!app) return;

  updateActiveNavLink(hash);

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
      renderContact(app);
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

function updateActiveNavLink(currentHash: string) {
  const navLinks = document.querySelectorAll('.nav-item');
  navLinks.forEach((link) => {
    const route = link.getAttribute('data-route');
    if (route && (currentHash === `#${route}` || (currentHash === '#/' && route === '/'))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}
