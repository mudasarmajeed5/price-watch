"use client";

import { useEffect, useState } from "react";

export function useServiceWorker() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const registerServiceWorker = async () => {
      try {
        // Check if service workers are supported
        if (!("serviceWorker" in navigator)) {
          console.log("Service Workers not supported");
          setLoading(false);
          return;
        }

        setIsSupported(true);

        // Register the service worker
        const registration = await navigator.serviceWorker.register(
          "/service-worker.js",
          {
            scope: "/",
          },
        );

        console.log("✅ Service Worker registered:", registration);

        // Get current subscription
        const currentSubscription =
          await registration.pushManager.getSubscription();
        setSubscription(currentSubscription);
      } catch (error) {
        console.error("❌ Service Worker registration failed:", error);
      } finally {
        setLoading(false);
      }
    };

    registerServiceWorker();
  }, []);

  const subscribeToPush = async (vapidPublicKey: string) => {
    try {
      if (!isSupported) {
        throw new Error("Service Workers not supported");
      }

      const registration = await navigator.serviceWorker.ready;

      // Subscribe to push notifications
      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      // Send subscription to server
      const response = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSubscription),
      });

      if (!response.ok) {
        throw new Error("Failed to save subscription to server");
      }

      setSubscription(newSubscription);
      console.log("✅ Push subscription saved:", newSubscription);
      return newSubscription;
    } catch (error) {
      console.error("❌ Failed to subscribe to push:", error);
      throw error;
    }
  };

  const unsubscribeFromPush = async () => {
    try {
      if (subscription) {
        await subscription.unsubscribe();
        setSubscription(null);
        console.log("✅ Unsubscribed from push notifications");
      }
    } catch (error) {
      console.error("❌ Failed to unsubscribe:", error);
      throw error;
    }
  };

  return {
    isSupported,
    subscription,
    loading,
    subscribeToPush,
    unsubscribeFromPush,
  };
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
