const CACHE_NAME = 'sahl-erp-v4';
const ASSETS_TO_CACHE = [
    './index.html',
    './manifest.json',
    './libs/tailwindcss.js',
    './libs/chart.js',
    './libs/html2pdf.bundle.min.js',
    './libs/xlsx.full.min.js',
    './libs/fontawesome/css/all.min.css',
    './libs/css/tajawal.css',
    './libs/fonts/tajawal-regular.woff2',
    './libs/fonts/tajawal-bold.woff2'
];

self.addEventListener('install', (e) => {
    self.skipWaiting();
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            if (response) {
                return response; // Return from cache
            }
            return fetch(e.request).catch((err) => {
                // Only return index.html for page navigation (not for CSS/JS)
                if (e.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
                throw err;
            });
        })
    );
});
