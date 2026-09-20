/**
 * Service Worker — Control de Rondas SEG360
 * Guarda en caché los archivos propios para que la app abra sin señal.
 * ignoreSearch: true permite que cualquier QR (con cualquier id/token)
 * encuentre la misma app.html ya guardada, sin importar los parámetros.
 */
var CACHE = "control-rondas-seg360-v1";
var ARCHIVOS = ["./app.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (cache) { return cache.addAll(ARCHIVOS); }));
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  e.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(function (resp) {
      return resp || fetch(e.request);
    })
  );
});
