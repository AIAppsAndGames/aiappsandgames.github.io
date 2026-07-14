const CACHE_NAME = 'ai-apps-games-cache-v14';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './apps.html',
  './about.html',
  './contact.html',
  './support.html',
  './privacy.html',
  './terms.html',
  './data-safety.html',
  './404.html',
  './manifest.json',
  './assets/css/styles.css',
  './assets/js/main.js'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching offline assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event (Network-first for HTML, Stale-While-Revalidate for static assets)
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Handle local files only
  if (requestUrl.origin === self.location.origin) {
    if (event.request.mode === 'navigate') {
      // Network-first policy for HTML navigation
      event.respondWith(
        fetch(event.request)
          .then((response) => {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
            return response;
          })
          .catch(() => caches.match(event.request))
      );
      return;
    }

    // Stale-while-revalidate for non-navigation assets
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        }).catch(() => {
          // Silent catch for offline fetch failures
        });
        return cachedResponse || fetchPromise;
      })
    );
  }
});
