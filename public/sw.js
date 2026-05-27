// Service Worker for Price Watch PWA

// Install event
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
  self.skipWaiting();
});

// Activate event
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");
  event.waitUntil(clients.claim());
});

// Handle push notifications
self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || "/icon-192x192.png",
      badge: "/icon-192x192.png",
      vibrate: [100, 50, 100],
      tag: data.tag || "default",
      requireInteraction: false,
      data: {
        dateOfArrival: Date.now(),
        url: data.url || "/",
      },
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

// Handle notification clicks
self.addEventListener("notificationclick", function (event) {
  console.log("Notification clicked");
  event.notification.close();

  const urlToOpen = event.notification.data?.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      // Check if the app is already open in a window
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }
      // If not open, open a new window
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    }),
  );
});

// Handle notification close
self.addEventListener("notificationclose", function (event) {
  console.log("Notification closed");
});

// Background sync for price alerts
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-price-alerts") {
    event.waitUntil(
      fetch("/api/price-alerts")
        .then((response) => {
          console.log("Price alerts synced:", response);
        })
        .catch((error) => {
          console.error("Error syncing price alerts:", error);
        }),
    );
  }
});
