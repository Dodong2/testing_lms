// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDvPtXEiqwjviBxkDP_OZWaVviN50bmTME",
  authDomain: "edulink-3a135.firebaseapp.com",
  projectId: "edulink-3a135",
  storageBucket: "edulink-3a135.firebasestorage.app",
  messagingSenderId: "961021162879",
  appId: "1:961021162879:web:3df682095f65636bf3d64a",
  measurementId: "G-SXK3CNK1WS"
};

const app = initializeApp(firebaseConfig);

export const messaging = typeof window !== "undefined" ? getMessaging(app) : null;

export const requestPermissionAndToken = async () => {
  if (!messaging) return null;
  try {
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY, // optional kung gagamit ka ng Web Push cert
    });
    return token;
  } catch (err) {
    console.error("Error getting FCM token", err);
    return null;
  }
};

export const onForegroundMessage = (callback: (payload: any) => void) => {
  if (!messaging) return;
  onMessage(messaging, callback);
};
