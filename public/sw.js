self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('oxygen-store').then((cache) => cache.addAll([
      '/',
      '/index.html',
      '/css/style.css',
      '/js/script.js',
      '/images/logo.png'
    ]))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});