"use client";

import { useEffect, useState } from "react";
import { useServiceWorker } from "@/lib/use-service-worker";

export function PWAInitializer() {
  const { isSupported, subscription, subscribeToPush } = useServiceWorker();
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Handle install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setShowInstallPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  // Handle app installed
  useEffect(() => {
    const handleAppInstalled = () => {
      console.log("✅ PWA App installed successfully");
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // Auto-subscribe to push if supported and not already subscribed
  useEffect(() => {
    const autoSubscribeToPush = async () => {
      if (isSupported && !subscription) {
        try {
          const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
          if (vapidPublicKey) {
            await subscribeToPush(vapidPublicKey);
            console.log("✅ Auto-subscribed to push notifications");
          }
        } catch (error) {
          console.log(
            "Push subscription skipped (user may not have enabled it)",
          );
        }
      }
    };

    // Only auto-subscribe after a short delay to not interfere with initial load
    const timer = setTimeout(autoSubscribeToPush, 2000);
    return () => clearTimeout(timer);
  }, [isSupported, subscription, subscribeToPush]);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("✅ User accepted installation");
    } else {
      console.log("❌ User dismissed installation");
    }

    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  // This component doesn't render anything, it just initializes PWA features
  return null;
}
