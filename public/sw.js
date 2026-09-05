// ============================================================================
// Service Worker — PWA Template
// Aplicaciones Móviles · Cátedra 2025-2026
// ============================================================================
// IMPORTANTE: No modificar la lógica de este archivo.
// Solo debés actualizar la lista RECURSOS_SHELL con tus propios archivos.
// ============================================================================

const CACHE_NAME = 'pwa-cache-v1';

// Lista de recursos estáticos de la aplicación (App Shell)
// Agregá o modificá las rutas según la estructura de tu proyecto.
const RECURSOS_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './favicon.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Evento install: se ejecuta cuando el Service Worker se instala.
// Descarga y guarda en caché todos los recursos del App Shell.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Cacheando recursos del App Shell');
      return cache.addAll(RECURSOS_SHELL);
    })
  );
  self.skipWaiting();
});

// Evento activate: se ejecuta cuando el Service Worker toma el control.
// Elimina cachés de versiones anteriores para no dejar archivos obsoletos.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => {
            console.log('[SW] Eliminando caché antigua:', key);
            return caches.delete(key);
          })
      );
    })
  );
  self.clients.claim();
});

// Evento fetch: intercepta todas las peticiones de red.
// Estrategia: Cache First con fallback a Network.
// Si el recurso está en caché, lo devuelve inmediatamente (funciona offline).
// Si no está, lo busca en la red.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((respuestaCache) => {
      // Devuelve la respuesta cacheada si existe
      if (respuestaCache) {
        return respuestaCache;
      }
      // Si no está en caché, realiza la petición a la red
      return fetch(event.request);
    })
  );
});
