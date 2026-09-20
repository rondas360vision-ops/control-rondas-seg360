/**
 * Service Worker — Control de Rondas SEG360
 * Guarda en caché los archivos propios para que la app abra sin señal.
 * ignoreSearch: true permite que cualquier QR (con cualquier id/token)
 * encuentre la misma app.html ya guardada, sin importar los parámetros.
 */
// Súbale el número de versión cada vez que cambie app.html (o cualquier
// archivo cacheado) — eso es lo único que hace que los celulares ya
// instalados detecten la actualización y descarten la copia vieja.
var CACHE = "control-rondas-seg360-v2";
var ARCHIVOS = ["./app.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (cache) { return cache.addAll(ARCHIVOS); }));
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      // Borra cualquier caché de una versión anterior, para no dejar copias viejas dando vueltas
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(function (resp) {
      return resp || fetch(e.request);
    })
  );
});
