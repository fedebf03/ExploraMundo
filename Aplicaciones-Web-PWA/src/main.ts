// src/main.ts
import './styles/main.css';

const app = document.getElementById('app');
const themeToggle = document.getElementById('theme-toggle');

// Renderizado provisional de prueba para verificar layout y estilos
if (app) {
  app.innerHTML = `
    <section style="margin-top: 1.5rem; text-align: center;">
      <h1 style="margin-bottom: 0.5rem;">🌍 Explorador de Países</h1>
      <p style="margin-bottom: 1.5rem;">Prueba de Layout Mobile-First y App Shell.</p>
      
      <div style="display: flex; gap: 0.5rem; justify-content: center; margin-bottom: 1.5rem;">
        <button class="btn btn-primary">Botón Primario</button>
        <button class="btn btn-secondary">Botón Secundario</button>
      </div>

      <!-- Grilla responsive de prueba -->
      <div class="countries-grid">
        <article class="card">
          <div class="card__flag-wrapper">
            <img src="https://flagcdn.com/w640/ar.png" alt="Bandera de Argentina" class="card__flag" loading="lazy" />
          </div>
          <div class="card__body">
            <h3 class="card__title">Argentina</h3>
            <div class="card__info">
              <span><strong>Capital:</strong> Buenos Aires</span>
              <span><strong>Región:</strong> Americas</span>
              <span><strong>Población:</strong> 45.808.747</span>
            </div>
          </div>
        </article>

        <article class="card">
          <div class="card__flag-wrapper">
            <img src="https://flagcdn.com/w640/jp.png" alt="Bandera de Japón" class="card__flag" loading="lazy" />
          </div>
          <div class="card__body">
            <h3 class="card__title">Japón</h3>
            <div class="card__info">
              <span><strong>Capital:</strong> Tokio</span>
              <span><strong>Región:</strong> Asia</span>
              <span><strong>Población:</strong> 125.800.000</span>
            </div>
          </div>
        </article>
      </div>
    </section>
  `;
}

// Controlador de Tema (Dark / Light)
themeToggle?.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  
  const icon = themeToggle.querySelector('.theme-icon');
  if (icon) {
    icon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
  }
});