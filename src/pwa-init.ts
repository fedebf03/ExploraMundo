// ============================================================================
// Registro del Service Worker — PWA Template
// Aplicaciones Móviles · Cátedra 2025-2026
// ============================================================================
// Este script registra automáticamente el Service Worker si el navegador
// lo soporta. No es necesario modificar este archivo.
// ============================================================================

export function initPWA(): void {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('./sw.js')
        .then((registro) => {
          console.log('[PWA] Service Worker registrado con éxito:', registro.scope);
        })
        .catch((error) => {
          console.error('[PWA] Error al registrar el Service Worker:', error);
        });
    });
  }
}
