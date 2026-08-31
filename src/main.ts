import './styles/main.css';
import { renderHeader } from './components/header';
import { renderFooter } from './components/footer';
import { renderNavbar } from './components/navbar';
import { initRouter } from './router';

const headerEl = document.getElementById('header');
const footerEl = document.getElementById('footer');
const bottomNavEl = document.getElementById('bottom-nav');

if (headerEl) headerEl.innerHTML = renderHeader();
if (footerEl) footerEl.innerHTML = renderFooter();
if (bottomNavEl) bottomNavEl.innerHTML = renderNavbar();

const scrollTopButton = document.createElement('button');
scrollTopButton.type = 'button';
scrollTopButton.className = 'scroll-top-btn';
scrollTopButton.setAttribute('aria-label', 'Volver arriba');
scrollTopButton.textContent = '↑';

document.body.appendChild(scrollTopButton);

const toggleScrollTopButton = () => {
  if (!scrollTopButton) return;
  if (window.scrollY > 30) {
    scrollTopButton.classList.add('is-visible');
  } else {
    scrollTopButton.classList.remove('is-visible');
  }
};

window.addEventListener('scroll', toggleScrollTopButton, { passive: true });
toggleScrollTopButton();

scrollTopButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

initRouter();

