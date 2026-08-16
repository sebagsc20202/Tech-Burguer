// sw.js - Service Worker para Tech Classic Burgers

const CACHE_NAME = 'tech-burgers-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/images/logo_tech.png',
  '/images/arm.jpg',
  '/images/pro.jpg',
  '/images/int.jpg',
  '/images/mex.jpg',
  '/images/yan.jpg',
  '/images/cla.jpg',
  '/images/icon-192.png',
  '/images/icon-512.png'
];

// Instalación: cachear recursos estáticos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activación: limpiar cachés antiguas
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Estrategia: primero caché, luego red (offline-first)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si está en caché, devolverlo
        if (response) {
          return response;
        }
        // Si no, ir a la red
        return fetch(event.request)
          .then(response => {
            // Clonar la respuesta para guardarla en caché
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseClone);
              });
            return response;
          })
          .catch(() => {
            // Si falla la red y no hay caché, mostrar página offline
            return caches.match('/offline.html');
          });
      })
  );
});