// ============================================================
// PWA INIT — Aplicaciones Móviles · Cátedra 2025-2026
// ============================================================
// Este archivo registra el Service Worker y gestiona el
// ciclo de vida de la PWA. NO es necesario modificarlo.
// ============================================================

export function initPWA(): void {
  // Registrar el Service Worker si el navegador lo soporta
  if ('serviceWorker' in navigator) {
    const register = () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => {
          console.log('[PWA] Service Worker registrado correctamente.');
          console.log('[PWA] Scope:', registration.scope);

          // Verificar si hay una actualización disponible
          registration.addEventListener('updatefound', () => {
            const nuevoSW = registration.installing;
            if (nuevoSW) {
              nuevoSW.addEventListener('statechange', () => {
                if (nuevoSW.state === 'installed' &&
                    navigator.serviceWorker.controller) {
                  console.log('[PWA] Nueva versión disponible. Recargá la página para actualizarla.');
                }
              });
            }
          });
        })
        .catch(error => {
          console.error('[PWA] Error al registrar el Service Worker:', error);
        });
    };

    if (document.readyState === 'complete') {
      register();
    } else {
      window.addEventListener('load', register);
    }
  } else {
    console.warn('[PWA] Este navegador no soporta Service Workers. La app funcionará como web app convencional.');
  }

  // Capturar el evento de instalación para uso futuro
  window.addEventListener('beforeinstallprompt', (event: Event) => {
    event.preventDefault();
    (window as unknown as { _pwaInstallPrompt: Event })._pwaInstallPrompt = event;
    console.log('[PWA] La aplicación puede ser instalada.');
  });

  window.addEventListener('appinstalled', () => {
    console.log('[PWA] ¡Aplicación instalada correctamente!');
    (window as unknown as { _pwaInstallPrompt: Event | null })._pwaInstallPrompt = null;
  });
}
