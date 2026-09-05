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

const scrollTopBtn = document.createElement('button');
scrollTopBtn.className = 'scroll-top-btn';
scrollTopBtn.textContent = '↑';
scrollTopBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('is-visible', window.scrollY > 30);
});


import { initPWA } from './pwa-init';

initRouter();
initPWA();

