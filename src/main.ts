import './styles/main.css';
import { renderHeader } from './components/header';
import { renderFooter } from './components/footer';
import { renderNavbar } from './components/navbar';
import { initRouter } from './router';

// inicializamos los componentes modulares del layout
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
scrollTopButton.innerHTML = '↑';
document.body.appendChild(scrollTopButton);

const updateScrollTopButton = () => {
  const shouldShow = window.scrollY > 220;
  scrollTopButton.classList.toggle('is-visible', shouldShow);
};

updateScrollTopButton();
window.addEventListener('scroll', updateScrollTopButton, { passive: true });
scrollTopButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
});

initRouter();

