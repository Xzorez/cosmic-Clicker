const CACHE_NAME = 'cosmic-clicker-v1.0.0';
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-180.png',
  // Agregar fuentes de Google
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600;800&display=swap'
];

// Instalar Service Worker y cachear archivos
self.addEventListener('install', event => {
  console.log('🚀 Service Worker: Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Service Worker: Cacheando archivos');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('❌ Error al cachear:', error);
      })
  );
});

// Interceptar peticiones y servir desde cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si está en cache, devolverlo, si no, fetch de la red
        if (response) {
          console.log('📱 Sirviendo desde cache:', event.request.url);
          return response;
        }
        console.log('🌐 Obteniendo de red:', event.request.url);
        return fetch(event.request);
      }
    )
  );
});

// Limpiar caches viejos
self.addEventListener('activate', event => {
  console.log('🧹 Service Worker: Limpiando caches antiguos');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Manejar actualizaciones
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});