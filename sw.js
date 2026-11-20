// MINASG GPS - guarda o "casco" do aplicativo para abrir rápido. Os dados vêm sempre do servidor.
const VERSAO = "minasg-gps-v2";
const CASCO = ["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSAO).then(c => c.addAll(CASCO)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSAO).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then(r => { const copia = r.clone(); caches.open(VERSAO).then(c => c.put("index.html", copia)); return r; })
      .catch(() => caches.match("index.html").then(r => r || caches.match("./"))));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { if (r.ok) { const copia = r.clone(); caches.open(VERSAO).then(c => c.put(req, copia)); } return r; })));
});
