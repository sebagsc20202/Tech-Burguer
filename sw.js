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

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
