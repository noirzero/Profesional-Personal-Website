const CACHE_NAME = 'site-cache-v1'
const OFFLINE_URL = '/offline.html'

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME)
      // Cache offline page and icons (not manifest — it's served by CDN)
      await cache.addAll([OFFLINE_URL, '/', '/icons/icon-192.svg', '/icons/icon-512.svg'])
    })()
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // cleanup old caches
    const keys = await caches.keys()
    await Promise.all(keys.map(k => { if (k !== CACHE_NAME) return caches.delete(k) }))
    self.clients.claim()
  })())
})

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const networkResponse = await fetch(event.request)
        return networkResponse
      } catch (err) {
        const cache = await caches.open(CACHE_NAME)
        const cached = await cache.match(OFFLINE_URL)
        return cached || new Response('Offline', { status: 503, statusText: 'Offline' })
      }
    })())
  }
})
