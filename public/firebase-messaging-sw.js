// Import Firebase scripts
self.importScripts(
  "https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js",
  "https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js"
);

// Initialize Firebase

self.firebase.initializeApp({
  apiKey: "AIzaSyBBNDnlZZqR9Nnv9EqKCTtKWAX6U079eME",
  authDomain: "castedwebsite.firebaseapp.com",
  projectId: "castedwebsite",
  storageBucket: "castedwebsite.firebasestorage.app",
  messagingSenderId: "409699688675",
  appId: "1:409699688675:web:fc4ecb269e1d1b6dc9e5d6",
  measurementId: "G-P7LPS5CSLP"
});

const messaging = self.firebase.messaging();

// Handle background message
messaging.onBackgroundMessage((payload) => {
  console.log("Background message received:", payload);

  const { title = "Casted Update", body = "Open the app to learn more.", icon, badge, url = "/" } = payload.data || {};

  const options = {
    body,
    icon: icon || "/castedicon.png",
    badge: badge || "/castedicon.png",
    data: { url },
    tag: "casted-update", // prevents duplicate notifications
  };

  self.registration.showNotification(title, options);
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const destinationUrl = event.notification.data?.url || "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url === destinationUrl && "focus" in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(destinationUrl);
      return null;
    })
  );
});
