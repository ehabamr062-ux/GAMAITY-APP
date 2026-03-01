self.addEventListener('install', (e) => {
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            // Delete old caches
            return Promise.all(keyList.map((key) => caches.delete(key)));
        }).then(() => {
            // Unregister self
            return self.registration.unregister();
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
    // Let everything pass so we don't block anything while dying
    e.respondWith(fetch(e.request));
});
