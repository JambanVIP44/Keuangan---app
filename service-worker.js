const CACHE_NAME = 'keuangan-v1';
const URLS = ['./index.html','./manifest.json','https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2','https://cdn.jsdelivr.net/npm/chart.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(URLS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE_NAME).map(x => caches.delete(x)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('supabase.co')) return;
  e.respondWith(caches.match(e.request).then(c => c || fetch(e.request).then(r => {
    if (r.status === 200) { const cl = r.clone(); caches.open(CACHE_NAME).then(ca => ca.put(e.request, cl)); }
    return r;
  })));
});
