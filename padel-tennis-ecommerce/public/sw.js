// Self-unregistering service worker. The site no longer ships a SW, but
// browsers that registered an older one keep requesting /sw.js on every
// navigation. This stub unregisters itself and clears any leftover caches
// so the SW lifecycle ends cleanly on each visitor's next visit.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: "window" });
      clients.forEach((client) => client.navigate(client.url));
    })()
  );
});
