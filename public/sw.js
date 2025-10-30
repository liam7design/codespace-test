const CACHE = "notes-cache-v1";
const OFFLINE_URL = "/";

self.addEventListener("install", (evt) => {
  evt.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll([OFFLINE_URL]))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (evt) => {
  evt.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (evt) => {
  if (evt.request.method !== "GET") return;
  evt.respondWith(
    fetch(evt.request).catch(() =>
      caches.match(evt.request).then((r) => r || caches.match(OFFLINE_URL))
    )
  );
});