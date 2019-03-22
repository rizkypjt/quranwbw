const PRECACHE = 'precache-v1.2';
const RUNTIME = 'runtime';

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
  
  /* index page */
  'index.html', './',
  
  /* stylesheets */
  './assets/css/bootstrap.css', './assets/css/bootstrap.min.css', './assets/css/bottom-nav.css', './assets/css/dark.css', './assets/css/index.css', './assets/css/new.css', './assets/css/normal-mode.css', './assets/css/style.css', 

  /* javascripts */
  './assets/js/audio.js', './assets/js/bootstrap.min.js', './assets/js/jquery.min.js', './assets/js/scripts.js', 

  /* fonts */
  './assets/fonts/Cabin-Bold.eot', './assets/fonts/Cabin-Bold.ttf', './assets/fonts/Cabin-Bold.woff', './assets/fonts/Cabin-Bold.woff2', './assets/fonts/IndoPak.woff', './assets/fonts/IndoPak.woff2', './assets/fonts/Uthmani.woff', './assets/fonts/Uthmani.woff2', 

  /* images */
  './assets/images/b-b.png', './assets/images/b-w.png', './assets/images/chevron-gold.svg', './assets/images/chevron-white.svg', './assets/images/favicon.ico', './assets/images/icons-192.png', './assets/images/icons-512.png'

];

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
  const currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener('fetch', event => {
  // Skip cross-origin requests, like those for Google Analytics.
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return caches.open(RUNTIME).then(cache => {
          return fetch(event.request).then(response => {
            // Put a copy of the response in the runtime cache.
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          });
        });
      })
    );
  }
});