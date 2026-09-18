const CACHE_NAME = 'ai-assistant-v3';

self.addEventListener('install', function(e) {
    self.skipWaiting();
});

self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then(function(keys) {
            return Promise.all(keys.filter(function(k) { return k !== CACHE_NAME; }).map(function(k) { return caches.delete(k); }));
        })
    );
});

self.addEventListener('fetch', function(e) {
    e.respondWith(
        fetch(e.request).then(function(res) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then(function(c) { c.put(e.request, copy); });
            return res;
        }).catch(function() {
            return caches.match(e.request);
        })
    );
});
