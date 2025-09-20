"use client";

import { useState } from "react";
import { requestPermissionAndToken } from "../../firebase";

export default function PushTest() {
  const [token, setToken] = useState<string | null>(null);

  const handleGetToken = async () => {
    const t = await requestPermissionAndToken();
    if (t) {
      console.log("✅ FCM Token:", t);
      setToken(t);
    } else {
      console.warn("❌ No token received");
    }
  };

  const handleSendNotif = async () => {
    if (!token) return;

    await fetch("/api/send-notification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        title: "Hello from EduCon 🚀",
        message: "Test push notification!",
        link: "http://localhost:3000",
      }),
    });
  };

  return (
    <div>
      <button onClick={handleGetToken}>Get Token</button>
      <button onClick={handleSendNotif} disabled={!token}>
        Send Test Notification
      </button>
    </div>
  );
}
