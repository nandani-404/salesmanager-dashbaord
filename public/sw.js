// Service Worker for TruckXpress PWA
// Update CACHE_VERSION whenever you change assets to force refresh
const CACHE_VERSION = 'truckxpress-cache-v2';

// Assets to precache
const PRECACHE_ASSETS = [
    '/',
    '/offline.html',
    '/manifest.json',
    '/icons/icon-192.png', // Update if you rename icons
    '/icons/icon-512.png'  // Update if you rename icons
];

// ===========================
// INSTALL EVENT
// ===========================
self.addEventListener('install', (event) => {
    console.log('[SW] Installing service worker...');
    event.waitUntil(
        caches.open(CACHE_VERSION)
            .then((cache) => {
                console.log('[SW] Precaching assets');
                return cache.addAll(PRECACHE_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// ===========================
// ACTIVATE EVENT
// ===========================
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating service worker...');
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_VERSION) {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});

// ===========================
// FETCH EVENT
// ===========================
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip cross-origin requests
    if (url.origin !== location.origin) return;

    // ===========================
    // NAVIGATION REQUESTS (HTML pages)
    // Network-first, fallback to offline.html
    // ===========================
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const responseClone = response.clone();
                    caches.open(CACHE_VERSION).then((cache) => {
                        cache.put(request, responseClone);
                    });
                    return response;
                })
                .catch(() => caches.match(request).then((cached) => cached || caches.match('/offline.html')))
        );
        return;
    }

    // ===========================
    // API REQUESTS (JSON)
    // Network-first, fallback to cache
    // ===========================
    if (url.pathname.startsWith('/api/') || request.headers.get('accept')?.includes('application/json')) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    if (response.ok) {
                        const responseClone = response.clone();
                        caches.open(CACHE_VERSION).then((cache) => cache.put(request, responseClone));
                    }
                    return response;
                })
                .catch(() => caches.match(request))
        );
        return;
    }

    // ===========================
    // STATIC ASSETS (CSS, JS, images, fonts)
    // Cache-first, fallback to network
    // ===========================
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                if (cachedResponse) return cachedResponse;

                return fetch(request)
                    .then((response) => {
                        if (response.ok) {
                            const responseClone = response.clone();
                            caches.open(CACHE_VERSION).then((cache) => {
                                cache.put(request, responseClone);
                            });
                        }
                        return response;
                    })
                    .catch(() => {
                        // If image fails to load offline, return empty response
                        if (request.destination === 'image') {
                            return new Response('', { status: 404 });
                        }
                        return caches.match('/offline.html');
                    });
            })
    );
});
