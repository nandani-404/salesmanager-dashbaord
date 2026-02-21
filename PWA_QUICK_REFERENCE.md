# TruckXpress PWA - Quick Reference Guide

---

## 1) offline.html

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
      window.location.reload();
    }

    window.addEventListener('online', () => {
      console.log('Connection restored');
      window.location.reload();
    });
  </script>
</body>
</html>
```

---

## 2) Service Worker Registration Code

### 2a) Plain HTML Script Tag

```html
<script>
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

### 2b) Next.js App Router - SWRegisterer.jsx

```jsx
"use client";

import { useEffect } from "react";

export function SWRegisterer() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration.scope);

          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  console.log("New service worker available. Refresh to update.");
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

  return null;
}
```

### 2c) Next.js Pages Router - _app.js Snippet

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

## 3) Head Snippet for Manifest

### 3a) Plain HTML

```html
<head>
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#0D6EFD">
</head>
```

### 3b) Next.js App Router - app/layout.js

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

## 4) Testing Checklist

### Step 1: Build for Production
```bash
npm run build
npm start
```
*Service workers only work in production mode or on localhost*

### Step 2: Check Manifest in Chrome DevTools
1. Open Chrome DevTools (F12)
2. Go to **Application** tab
3. Click **Manifest** in left sidebar
4. Verify:
   - Name: "TruckXpress"
   - Theme color: #0D6EFD
   - Icons: 192x192 and 512x512 visible

### Step 3: Check Service Worker Registration
1. In DevTools **Application** tab
2. Click **Service Workers** in left sidebar
3. Verify:
   - Status shows "activated and running"
   - Source shows `/sw.js`
   - No errors in console

### Step 4: Trigger Add to Home Screen (Mobile)
**Android:**
1. Open site in Chrome on Android device
2. Tap menu (⋮) → "Add to Home screen"
3. Confirm installation
4. App icon appears on home screen

**Desktop (Chrome):**
1. Look for install icon in address bar (⊕ or computer icon)
2. Click to install
3. App opens in standalone window

**Requirements:**
- Must be HTTPS (or localhost)
- User must visit site at least twice with 5-minute gap
- Manifest must be valid

### Step 5: Offline Test
1. Open DevTools → **Network** tab
2. Check **Offline** checkbox
3. Refresh the page
4. Should display `offline.html` with "You are offline" message
5. Click "Retry Connection" button
6. Uncheck **Offline** → page should reload successfully

### Step 6: Lighthouse PWA Audit (Optional)
1. Open DevTools → **Lighthouse** tab
2. Select **Progressive Web App** category
3. Click **Generate report**
4. Check for:
   - ✅ Installable
   - ✅ PWA optimized
   - ✅ Works offline
   - Score should be 90+ for production-ready PWA

### Common Issues & Fixes

**Service Worker not registering?**
- Ensure HTTPS or localhost
- Check browser console for errors
- Clear cache: DevTools → Application → Clear storage

**Manifest not detected?**
- Verify `/manifest.json` is accessible
- Check `<link rel="manifest">` in HTML
- Ensure icons exist at `/icons/icon-192.png` and `/icons/icon-512.png`

**Add to Home Screen not showing?**
- Must be HTTPS
- Visit site twice with 5-minute gap
- Check manifest is valid (no errors in DevTools)
- Ensure all required manifest fields are present
