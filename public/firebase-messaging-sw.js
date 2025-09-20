// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// ⚠️ Use plain object, not process.env (service worker can’t read env vars)
firebase.initializeApp({
  apiKey: "AIzaSyDvPtXEiqwjviBxkDP_OZWaVviN50bmTME",
  authDomain: "edulink-3a135.firebaseapp.com",
  projectId: "edulink-3a135",
  storageBucket: "edulink-3a135.appspot.com",
  messagingSenderId: "961021162879",
  appId: "1:961021162879:web:3df682095f65636bf3d64a",
  measurementId: "G-SXK3CNK1WS"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification?.title || "Notification";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: '/logo.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
