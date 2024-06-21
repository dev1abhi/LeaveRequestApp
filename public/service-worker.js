// Listen for the install event, which is fired when the service worker is first installed
self.addEventListener('install', (event) => {
    console.log('Service Worker installed');
    // Perform any initial setup or caching here
  });
  
  // Listen for the activate event, which is fired when the service worker becomes active
  self.addEventListener('activate', (event) => {
    console.log('Service Worker activated');
    // Perform any cleanup or updating of caches here
  });
  

self.addEventListener('push', event => {
    const data = event.data.json();
    self.registration.showNotification(data.title, {
      body: data.message,
      icon: '../assets/icon.png',
    });
  });
  
  self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
      clients.openWindow('http://localhost:3000/admin-dashboard')
    );
  });
  