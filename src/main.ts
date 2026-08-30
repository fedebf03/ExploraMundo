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

initRouter();

