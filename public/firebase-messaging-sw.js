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

  const notification = payload.notification || {};
  const data = payload.data || {};

  const options = {
    body: data.body || notification.body || "Open the app to learn more.",
    icon: data.icon || "/castedicon.png",
    badge: data.badge || "/castedicon.png",
    data: { 
      url: data.url || notification.click_action || "/" 
    },
    tag: "casted-update", // prevents duplicate notifications
  };

  self.registration.showNotification(
    data.title || notification.title || "Casted Update", 
    options
  );
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  
  // Get the URL from notification data, defaulting to root
  const urlToOpen = event.notification.data?.url || "/";
  
  // Create a full URL object to handle both relative and absolute paths
  const targetUrl = new URL(urlToOpen, self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      // Try to find an existing window with the same URL and focus it
      for (const client of clients) {
        if (client.url === targetUrl && "focus" in client) {
          return client.focus();
        }
      }
      // If no existing window or it's an external link, open a new one
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
