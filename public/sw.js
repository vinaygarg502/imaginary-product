// ============================================
// 🔥 VERSIONING
// ============================================
const CACHE_VERSION = "v5";

const HTML_CACHE   = `html-${CACHE_VERSION}`;
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const IMAGE_CACHE  = `images-${CACHE_VERSION}`;
const FONT_CACHE   = `fonts-${CACHE_VERSION}`;

// ============================================
// 🔥 INSTALL
// Pre-cache index.html ONLY for offline fallback
// ============================================
self.addEventListener("install", (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(HTML_CACHE).then((cache) => {
      return cache.addAll([
        "/index.html",
        "/favicon.ico"
      ]);
    })
  );
});

// ============================================
// 🔥 ACTIVATE
// Delete old caches
// ============================================
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (
            key !== HTML_CACHE &&
            key !== STATIC_CACHE &&
            key !== IMAGE_CACHE &&
            key !== FONT_CACHE
          ) {
            return caches.delete(key);
          }
        })
      )
    )
  );

  return self.clients.claim();
});

// ============================================
// 🔥 FETCH ROUTER
// ============================================
self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  // HTML
  if (request.destination === "document") {
    event.respondWith(networkFirstHTML(request));
    return;
  }

  // Images
  if (request.destination === "image") {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
    return;
  }

  // Fonts (Google fonts included)
  if (
    request.destination === "font" ||
    request.url.includes("fonts.googleapis.com") ||
    request.url.includes("fonts.gstatic.com")
  ) {
    event.respondWith(cacheFirst(request, FONT_CACHE));
    return;
  }

  // JS & CSS
  if (
    request.destination === "script" ||
    request.destination === "style"
  ) {
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
    return;
  }

  // Default → Network First
  event.respondWith(networkFirst(request, STATIC_CACHE));
});

// ============================================
// 🌐 HTML → Network First (Offline Fallback)
// ============================================
async function networkFirstHTML(request) {
  const cache = await caches.open(HTML_CACHE);

  try {
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    const cached = await cache.match("/index.html");
    return cached || new Response("Offline", { status: 503 });
  }
}

// ============================================
// 📦 Network First Strategy
// ============================================
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);

  try {
    const networkResponse = await fetch(request);

    if (
      networkResponse &&
      (networkResponse.status === 200 ||
        networkResponse.type === "opaque")
    ) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    const cached = await cache.match(request);
    return cached || new Response("Offline", { status: 503 });
  }
}

// ============================================
// 🖼 Cache First Strategy (Images, Fonts)
// ============================================
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) return cached;

  try {
    const networkResponse = await fetch(request);

    if (
      networkResponse &&
      (networkResponse.status === 200 ||
        networkResponse.type === "opaque")
    ) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    return new Response("", { status: 404 });
  }
}

// ============================================
// ⚡ Stale While Revalidate (JS/CSS)
// ============================================
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const networkFetch = fetch(request).then((response) => {
    if (
      response &&
      (response.status === 200 ||
        response.type === "opaque")
    ) {
      cache.put(request, response.clone());
    }
    return response;
  });

  return cached || networkFetch;
}