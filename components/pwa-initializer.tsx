"use client";

import { useEffect } from "react";

export function PWAInitializer() {
  useEffect(() => {
    // Register service worker on app load
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js", {
            scope: "/",
            updateViaCache: "none",
          })
          .then((registration) => {
            console.log("Service Worker registered:", registration);

            // Check for updates
            registration.addEventListener("updatefound", () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener("statechange", () => {
                  if (
                    newWorker.state === "installed" &&
                    navigator.serviceWorker.controller
                  ) {
                    // New service worker is ready, you can notify the user
                    console.log("New Service Worker version available");
                  }
                });
              }
            });
          })
          .catch((error) => {
            console.error("Service Worker registration failed:", error);
          });
      });
    }

    // Request notification permission if not already granted
    if ("Notification" in window && Notification.permission === "default") {
      // Don't request automatically, let user choose
      console.log("Notification permission available for user to enable");
    }
  }, []);

  return null;
}
