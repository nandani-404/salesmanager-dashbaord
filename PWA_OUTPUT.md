# TruckXpress PWA - Complete Implementation Guide

---

## A) manifest.json

```json
{
  "name": "TruckXpress",
  "short_name": "TruckXpress",
  "description": "TruckXpress - Manage shipments, track trucks, and streamline freight operations efficiently.",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#0D6EFD",
  "background_color": "#ffffff",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

---

## B) sw.js (Service Worker)

```javascript
// Service Worker for TruckXpress PWA
// Cache version - increment this when you want to force cache refresh
const CACHE_VERSION = 'truckxpress-cache-v1';

// Assets to precache on service worker installation
const PRECACHE_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// ===========================
// INSTALL EVENT
// ===========================
// Triggered when the service worker is first installed
// Precaches all static assets defined above
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => {
        console.log('[SW] Precaching assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        console.log('[SW] Installation complete');
        // Force the waiting service worker to become the active service worker
        return self.skipWaiting();
      })
  );
});

// ===========================
// ACTIVATE EVENT
// ===========================
// Triggered when the service worker becomes active
// Cleans up old caches from previous versions
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete old caches that don't match current version
            if (cacheName !== CACHE_VERSION) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Activation complete');
        // Take control of all pages immediately
        return self.clients.claim();
      })
  );
});

// ===========================
// FETCH EVENT
// ===========================
// Intercepts all network requests and applies caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // ===========================
  // NAVIGATION REQUESTS (HTML pages)
  // Strategy: Network-first, fallback to offline page
  // ===========================
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone and cache the response for future use
          const responseClone = response.clone();
          caches.open(CACHE_VERSION).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Network failed, try cache first
          return caches.match(request)
            .then((cachedResponse) => {
              // If page is cached, return it; otherwise return offline page
              return cachedResponse || caches.match('/offline.html');
            });
        })
    );
    return;
  }

  // ===========================
  // API REQUESTS (fetch, XHR)
  // Strategy: Network-first, fallback to cache
  // ===========================
  if (url.pathname.startsWith('/api/') || request.headers.get('accept')?.includes('application/json')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_VERSION).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Network failed, return cached response if available
          return caches.match(request);
        })
    );
    return;
  }

  // ===========================
  // STATIC ASSETS (CSS, JS, images, fonts)
  // Strategy: Cache-first, fallback to network
  // ===========================
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached asset immediately
          return cachedResponse;
        }

        // Not in cache, fetch from network and cache on-the-fly
        return fetch(request)
          .then((response) => {
            // Only cache successful responses
            if (response.ok) {
              const responseClone = response.clone();
              caches.open(CACHE_VERSION).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return response;
          });
      })
  );
});
```

---

## C) offline.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You are offline - TruckXpress</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(135deg, #0D6EFD 0%, #0a58ca 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .container {
      background: white;
      border-radius: 16px;
      padding: 48px 32px;
      max-width: 480px;
      width: 100%;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 24px;
      background: #f8f9fa;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40px;
    }

    h1 {
      font-size: 28px;
      color: #212529;
      margin-bottom: 16px;
      font-weight: 700;
    }

    p {
      font-size: 16px;
      color: #6c757d;
      line-height: 1.6;
      margin-bottom: 32px;
    }

    .retry-btn {
      background: #0D6EFD;
      color: white;
      border: none;
      padding: 14px 32px;
      font-size: 16px;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
    }

    .retry-btn:hover {
      background: #0a58ca;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(13, 110, 253, 0.4);
    }

    .retry-btn:active {
      transform: translateY(0);
    }

    @media (max-width: 480px) {
      .container {
        padding: 32px 24px;
      }

      h1 {
        font-size: 24px;
      }

      p {
        font-size: 14px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">📡</div>
    <h1>You are offline</h1>
    <p>
      It looks like you've lost your internet connection. 
      Don't worry, TruckXpress will work again once you're back online.
    </p>
    <button class="retry-btn" onclick="retryConnection()">
      Retry Connection
    </button>
  </div>

  <script>
    function retryConnection() {
      // Reload the page to attempt reconnection
      window.location.reload();
    }

    // Optional: Auto-retry when connection is restored
    window.addEventListener('online', () => {
      console.log('Connection restored');
      window.location.reload();
    });
  </script>
</body>
</html>
```

---

## D) Service Worker Registration Code

### D1) Plain HTML

```html
<script>
  // Register service worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration.scope);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    });
  }
</script>
```

### D2) Next.js App Router - SWRegisterer.jsx

```jsx
"use client";

import { useEffect } from "react";

export function SWRegisterer() {
  useEffect(() => {
    // Check if service workers are supported
    if ("serviceWorker" in navigator) {
      // Register the service worker
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered successfully:", registration.scope);

          // Check for updates periodically
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  // New service worker is available, prompt user to refresh
                  console.log("New service worker available. Refresh to update.");
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    } else {
      console.log("Service Workers are not supported in this browser.");
    }
  }, []);

  // This component doesn't render anything
  return null;
}
```

### D3) Next.js Pages Router - _app.js snippet

```javascript
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration.scope);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
```

---

## E) Head Snippet for Manifest

### E1) Plain HTML

```html
<head>
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#0D6EFD">
</head>
```

### E2) Next.js App Router - app/layout.js

```jsx
import type { Metadata } from "next";
import { SWRegisterer } from "@/components/pwa/sw-registerer";

export const metadata: Metadata = {
  title: "TruckXpress - Sales Management Dashboard",
  description: "TruckXpress - Manage shipments, track trucks, and streamline freight operations efficiently.",
  manifest: "/manifest.json",
  themeColor: "#0D6EFD",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0D6EFD" />
      </head>
      <body>
        <SWRegisterer />
        {children}
      </body>
    </html>
  );
}
```

---

## F) README - Testing & Verification

### Testing Locally

1. **Build for production**: `npm run build && npm start` (service workers only work in production or localhost)
2. **Open DevTools**: Press F12 → Application tab
3. **Check Manifest**: Application → Manifest (verify name, icons, theme color)
4. **Check Service Worker**: Application → Service Workers (should show "activated and running")

### Verify Offline Mode

1. Open DevTools → Network tab
2. Check "Offline" checkbox
3. Refresh the page → should show `offline.html`
4. Uncheck "Offline" → click "Retry Connection" button

### Add to Home Screen (Android)

1. Open site in Chrome on Android
2. Tap menu (⋮) → "Add to Home screen"
3. Confirm installation
4. App icon appears on home screen with theme color splash screen

### Common Fixes

**Service Worker not registering?**
- Ensure you're on HTTPS or localhost
- Check browser console for errors
- Clear cache: DevTools → Application → Clear storage

**Manifest not detected?**
- Verify `/manifest.json` is accessible
- Check `<link rel="manifest">` in HTML
- Ensure icons exist at specified paths

**"Add to Home Screen" not showing?**
- Must be HTTPS (or localhost)
- User must visit site at least twice (with 5 min gap)
- Manifest must be valid with required fields
