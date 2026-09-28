// Service Worker self-cleanup and unregister
// This purges any obsolete cached assets and prevents blank screen issues in iframe environments.

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(cacheNames.map((name) => caches.delete(name)));
      })
      .then(() => self.registration.unregister())
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', () => {
  // Pass all network requests directly to the network without interception
  return;
});
