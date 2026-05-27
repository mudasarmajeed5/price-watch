"use client";

import { useState, useEffect } from "react";
import {
  subscribeUser,
  unsubscribeUser,
  sendNotification,
} from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null,
  );
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  async function registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      });
      const sub = await registration.pushManager.getSubscription();
      setSubscription(sub);
    } catch (error) {
      console.error("Failed to register service worker:", error);
    }
  }

  async function subscribeToPush() {
    try {
      setLoading(true);
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
        ) as BufferSource,
      });

      setSubscription(sub);
      const serializedSub = JSON.parse(JSON.stringify(sub));
      const result = await subscribeUser(serializedSub);
      setNotification(result.message || "Subscription successful!");
      setTimeout(() => setNotification(""), 3000);
    } catch (error) {
      console.error("Failed to subscribe:", error);
      setNotification("Failed to subscribe to notifications");
      setTimeout(() => setNotification(""), 3000);
    } finally {
      setLoading(false);
    }
  }

  async function unsubscribeFromPush() {
    try {
      setLoading(true);
      await subscription?.unsubscribe();
      setSubscription(null);
      const result = await unsubscribeUser();
      setNotification(result.message || "Unsubscribed successfully!");
      setTimeout(() => setNotification(""), 3000);
    } catch (error) {
      console.error("Failed to unsubscribe:", error);
      setNotification("Failed to unsubscribe");
      setTimeout(() => setNotification(""), 3000);
    } finally {
      setLoading(false);
    }
  }

  async function sendTestNotification() {
    if (!message.trim()) {
      setNotification("Please enter a message");
      setTimeout(() => setNotification(""), 3000);
      return;
    }

    try {
      setLoading(true);
      const result = await sendNotification(message);
      setNotification(result.message || "Notification sent!");
      setMessage("");
      setTimeout(() => setNotification(""), 3000);
    } catch (error) {
      console.error("Failed to send notification:", error);
      setNotification("Failed to send notification");
      setTimeout(() => setNotification(""), 3000);
    } finally {
      setLoading(false);
    }
  }

  if (!isSupported) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-800">
          Push notifications are not supported in this browser.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="mb-4 text-lg font-semibold">Push Notifications</h3>

        {notification && (
          <div className="mb-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
            {notification}
          </div>
        )}

        {subscription ? (
          <div className="space-y-3">
            <p className="text-sm text-green-700">
              ✓ You are subscribed to push notifications
            </p>

            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter notification message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={loading}
              />
              <Button
                onClick={sendTestNotification}
                disabled={loading || !message.trim()}
                variant="default"
              >
                {loading ? "Sending..." : "Send Test"}
              </Button>
            </div>

            <Button
              onClick={unsubscribeFromPush}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              {loading ? "Unsubscribing..." : "Unsubscribe"}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              You are not subscribed to push notifications. Enable them to
              receive price alerts.
            </p>
            <Button
              onClick={subscribeToPush}
              disabled={loading}
              variant="default"
              className="w-full"
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
