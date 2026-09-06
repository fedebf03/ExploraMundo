export function renderHeader(): string {

  return `
    <a href="#/" class="header__logo">
      <img src="./logo.png" alt="Logo ExploraMundo" class="header__logo-img" width="38" height="38" />
      <span class="logo-text">Explora<span class="logo-accent">Mundo</span></span>
    </a>

    <nav class="header__nav">
      <a href="#/" class="nav-item" data-route="/">Inicio</a>
      <a href="#/busqueda" class="nav-item" data-route="/busqueda">Buscar</a>
      <a href="#/favoritos" class="nav-item" data-route="/favoritos">Favoritos</a>

      <a href="#/historial" class="nav-item" data-route="/historial">Historial</a>
      <a href="#/contacto" class="nav-item" data-route="/contacto">Contacto</a>
    </nav>

  `;
}
