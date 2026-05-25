// Minimal service worker — its only job is to make the site installable as a
// PWA. It deliberately does NOT cache or serve page HTML, so it can never show
// a stale/blank page. The empty fetch handler is enough to satisfy the
// browser's installability requirement.
const CACHE_PREFIX = 'listvoo-'

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Purge any caches created by older versions of this worker so no
      // previously-cached (possibly broken) responses are ever served.
      const keys = await caches.keys()
      await Promise.all(keys.filter((k) => k.startsWith(CACHE_PREFIX)).map((k) => caches.delete(k)))
      await self.clients.claim()
    })()
  )
})

// Pass-through: let every request go straight to the network. We intentionally
// do not call event.respondWith(), so the browser handles requests normally.
self.addEventListener('fetch', () => {})
