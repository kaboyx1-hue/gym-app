// App shell: lấy mạng trước (để luôn có bản mới), mất mạng thì dùng cache.
// Thư viện bài tập + ảnh + font (CDN): cache trước, vì không đổi.
const CACHE = 'gym-v1';
const SHELL = ['./', 'index.html', 'style.css', 'app.js', 'manifest.webmanifest', 'icon-192.png'];

self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.hostname.includes('google.com') || url.hostname.includes('googleusercontent')) return; // API + ảnh Drive: không cache
  const cdn = /jsdelivr|gstatic|googleapis/.test(url.hostname);
  e.respondWith(cdn
    ? caches.match(e.request).then(hit => hit || fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; }))
    : fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request)));
});
