// Service Worker для оффлайн-работы PWA

const CACHE_NAME = 'planner-v1';
const OFFLINE_URL = 'offline.html';

// Файлы для кэширования при установке
const PRECACHE_FILES = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icons/icon-72.png',
  './icons/icon-96.png',
  './icons/icon-128.png',
  './icons/icon-144.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

// Установка Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Установка');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Кэширование файлов');
        return cache.addAll(PRECACHE_FILES);
      })
      .then(() => {
        console.log('Service Worker: Установка завершена');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Ошибка при установке', error);
      })
  );
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Активация');
  
  // Удаляем старые кэши
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Удаление старого кэша', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  console.log('Service Worker: Активация завершена');
  return self.clients.claim();
});

// Перехват запросов
self.addEventListener('fetch', (event) => {
  // Пропускаем не-GET запросы
  if (event.request.method !== 'GET') return;
  
  // Пропускаем запросы к API (у нас их нет, но на будущее)
  if (event.request.url.includes('/api/')) return;
  
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Возвращаем кэшированный ответ если есть
        if (cachedResponse) {
          console.log('Service Worker: Используем кэш для', event.request.url);
          return cachedResponse;
        }
        
        // Иначе делаем сетевой запрос
        return fetch(event.request)
          .then((response) => {
            // Не кэшируем ошибки
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Клонируем ответ для кэширования
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // Если сеть недоступна и это запрос HTML-страницы
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
            
            // Для других ресурсов возвращаем fallback
            return new Response('Оффлайн режим', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Фоновые уведомления (push notifications)
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push уведомление получено');
  
  if (!event.data) return;
  
  const data = event.data.json();
  const title = data.title || '🌸 Напоминание';
  const options = {
    body: data.body || 'У вас есть напоминание',
    icon: './icons/icon-192.png',
    badge: './icons/icon-72.png',
    vibrate: [200, 100, 200],
    data: data.url || './'
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Обработка кликов по уведомлениям
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Клик по уведомлению');
  
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Ищем открытое окно приложения
        for (const client of clientList) {
          if (client.url === './' && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Если окно не найдено, открываем новое
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data || './');
        }
      })
  );
});

// Сообщения от главного потока
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
