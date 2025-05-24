// FULL, COMPLETE, READY-TO-RUN CODE ONLY.
// NO SNIPPETS. NO PLACEHOLDERS. NO INCOMPLETE SECTIONS.
// CODE MUST BE ABLE TO RUN IMMEDIATELY WITHOUT MODIFICATION.

const CACHE_NAME = 'aida-cache-v1';
const urlsToCache = [
  '/',
  '/landing',
  '/login',
  '/register',
  '/profile',
  '/manifest.json',
  // Add paths to your core CSS and JS bundles if known and static
  // e.g., '/_next/static/css/...', '/_next/static/chunks/...'
  // These are usually hashed, so a more dynamic approach or workbox might be better for production.
  // For a basic PWA, caching the main routes is a start.
  '/favicon.ico', // Example, your favicon
  '/icons/icon-192x192.png', // Example icon
  '/icons/icon-512x512.png'  // Example icon
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // Add essential assets that make up the app shell
        // Be careful with caching too many dynamic Next.js assets here without a proper strategy
        return cache.addAll(urlsToCache.filter(url => !url.startsWith('/_next/static/'))); // Avoid caching dev bundles directly
      })
      .catch(err => {
        console.error('Failed to cache urls on install:', err);
      })
  );
});

self.addEventListener('fetch', (event) => {
  // We only want to cache GET requests.
  if (event.request.method !== 'GET') {
    return;
  }

  // For navigation requests, try network first, then cache (NetworkFallingToCache)
  // This ensures users get the latest HTML, but can fallback to cached version if offline
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // If successful, cache the response for future offline use
          // Check if we received a valid response
          if (response && response.status === 200 && response.type === 'basic') {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
          }
          return response;
        })
        .catch(() => {
          // If network fails, try to serve from cache
          return caches.match(event.request)
            .then((cachedResponse) => {
              return cachedResponse || caches.match('/'); // Fallback to home page or a generic offline page
            });
        })
    );
    return;
  }

  // For other requests (CSS, JS, images), use a CacheFirst strategy
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Cache hit - return response
        if (cachedResponse) {
          return cachedResponse;
        }

        // Not in cache - fetch from network, then cache it
        return fetch(event.request).then(
          (response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            return response;
          }
        );
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    })
  );
});
