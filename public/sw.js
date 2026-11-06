// Service Worker para Monitor Climático de Destinos - IIARRD & alertatemprana.online
// Versión: monitor-clima-v5-network-first
const CACHE_NAME = 'monitor-clima-v5-network-first';

const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './android/launchericon-192x192.png',
  './android/launchericon-512x512.png',
  './icon.svg'
];

// 1. Install Event: Cache essential shell and skip waiting immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => console.warn('PWA Cache prefill error:', err));
    })
  );
});

// 2. Activate Event: Delete ALL old caches so stale versions are purged
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Purging old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event: NETWORK FIRST for everything, fallback to cache only when completely offline
self.addEventListener('fetch', (event) => {
  // Never intercept APK files or API requests
  if (event.request.url.includes('.apk') || event.request.url.includes('/api/')) {
    return;
  }

  // Navigation requests: Network first, with offline HTML fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match('./') || await caches.match('./index.html');
          return cached || new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
        })
    );
    return;
  }

  // Assets & scripts: Network first to avoid stale code lock-in
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// 4. Web Push Event: Receives background push notifications even if the web page is closed
self.addEventListener('push', (event) => {
  let data = {
    title: '🚨 Alerta Temprana — IIARRD',
    message: 'Se detectó una actualización climática o evento de alerta en tu destino monitoreado.',
    url: '/'
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (e) {
      data.message = event.data.text() || data.message;
    }
  }

  const options = {
    body: data.message,
    icon: '/android/launchericon-192x192.png',
    badge: '/android/launchericon-96x96.png',
    vibrate: [200, 100, 200, 100, 200],
    data: { url: data.url || '/' },
    tag: 'alertatemprana-push-alert',
    renotify: true
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 5. Notification Click Event: Opens or focuses the web application when tapped in notification drawer
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// 6. Periodic Background Sync (Android/Chrome): Checks alerts in background
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'check-weather-alerts') {
    event.waitUntil(
      self.registration.showNotification('Monitoreo en Segundo Plano — IIARRD', {
        body: 'El servicio de monitoreo en segundo plano continúa activo en tu dispositivo.',
        icon: '/android/launchericon-192x192.png'
      })
    );
  }
});
