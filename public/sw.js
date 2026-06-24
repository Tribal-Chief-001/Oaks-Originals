const CACHE_NAME = "oaks-originals-cache-v1";
const PRECACHE_ASSETS = [
  "/",
  "/manifest.json",
  "/pokeball.png",
  "/robots.txt"
];

// Install Event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Pre-caching offline assets");
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("[Service Worker] Clearing old cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event
self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  // Caching Strategy: Cache-First for Pokemon sprites and artwork
  if (
    requestUrl.host.includes("raw.githubusercontent.com") ||
    requestUrl.pathname.endsWith(".png") ||
    requestUrl.pathname.endsWith(".jpg") ||
    requestUrl.pathname.endsWith(".jpeg") ||
    requestUrl.pathname.endsWith(".svg")
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            // Fallback for offline if not in cache
            return new Response("", { status: 404, statusText: "Offline image not found" });
          });
        });
      })
    );
    return;
  }

  // Caching Strategy: Stale-While-Revalidate for app page assets, JS, CSS, and read-only API calls
  const isStaticAsset =
    requestUrl.pathname.startsWith("/_next/") ||
    requestUrl.pathname.includes(".js") ||
    requestUrl.pathname.includes(".css") ||
    PRECACHE_ASSETS.includes(requestUrl.pathname);

  const isReadOnlyApi =
    event.request.method === "GET" &&
    (requestUrl.pathname.startsWith("/api/pokemon") ||
     requestUrl.pathname.startsWith("/api/items") ||
     requestUrl.pathname.startsWith("/api/moves"));

  if (isStaticAsset || isReadOnlyApi) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch((err) => {
            console.warn("[Service Worker] Fetch failed, serving offline cache if available", err);
            // If the fetch fails, cachedResponse will be returned
          });
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // Default network-only strategy for mutable APIs (POST/PUT/DELETE) and auth requests
  event.respondWith(
    fetch(event.request).catch(() => {
      // Return a custom JSON or status for offline API calls
      if (event.request.headers.get("accept").includes("application/json")) {
        return new Response(JSON.stringify({ error: "Offline - Connection failure" }), {
          status: 503,
          headers: { "Content-Type": "application/json" }
        });
      }
      // If it's a page navigation request, we can fallback to cached root index "/"
      if (event.request.mode === "navigate") {
        return caches.match("/");
      }
      return new Response("Offline mode active. Connection not available.", { status: 503 });
    })
  );
});
