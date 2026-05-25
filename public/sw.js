// Minimal service worker — its main job is to make the site installable as a PWA.
const CACHE = 'listvoo-v1'

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

// Network-first passthrough with a cache fallback when offline.
self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful same-origin navigations/assets for offline fallback.
        if (response.ok && request.url.startsWith(self.location.origin)) {
          const copy = response.clone()
          caches.open(CACHE).then((cache) => cache.put(request, copy)).catch(() => {})
        }
        return response
      })
      .catch(() => caches.match(request))
  )
})
