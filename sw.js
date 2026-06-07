const CACHE = 'bartido-v1';
const ASSETS = [
  './web-bartidobar.html',
  './manifest.json',
  './assets/instagram/profile.jpg',
  './assets/instagram/post-1.jpg',
  './assets/instagram/post-2.jpg',
  './assets/instagram/post-3.jpg',
  './assets/instagram/post-4.jpg',
  './assets/instagram/post-5.jpg',
  './assets/instagram/post-6.jpg',
  './assets/instagram/post-7.jpg',
  './assets/instagram/post-8.jpg',
  './assets/instagram/post-9.jpg',
  './assets/instagram/post-10.jpg',
  './assets/instagram/post-11.jpg',
  './assets/instagram/post-12.jpg',
];

// Install: cache all assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

// Activate: remove old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first strategy
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (!res || res.status !== 200 || res.type === 'opaque') return res;
        const clone = res.clone();
        caches.open(CACHE).then(cache => cache.put(e.request, clone));
        return res;
      }).catch(() => caches.match('./web-bartidobar.html'));
    })
  );
});
