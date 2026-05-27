"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if device is iOS
    const userAgent = navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream);

    // Check if app is already installed
    setIsStandalone(
      window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true,
    );

    // Handle beforeinstallprompt event for Android and other browsers
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        console.log("App installed successfully");
        setShowPrompt(false);
      } else {
        console.log("User dismissed install prompt");
      }
    } catch (error) {
      console.error("Error during installation:", error);
    } finally {
      setDeferredPrompt(null);
    }
  };

  // Don't show if already installed
  if (isStandalone) {
    return null;
  }

  // Show install prompt for Android/Chrome
  if (showPrompt && deferredPrompt) {
    return (
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-blue-900">Install App</h3>
            <p className="text-sm text-blue-800">
              Install Price Watch on your device for quick access and offline
              support.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleInstallClick}
              variant="default"
              className="flex-1"
            >
              Install
            </Button>
            <Button
              onClick={() => setShowPrompt(false)}
              variant="outline"
              className="flex-1"
            >
              Not Now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show iOS install instructions
  if (isIOS) {
    return (
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="space-y-2 text-sm text-blue-900">
          <h3 className="font-semibold">Install App</h3>
          <p>
            To install this app on your iOS device, tap the share button{" "}
            <span role="img" aria-label="share icon" className="inline-block">
              {" "}
              ⎋{" "}
            </span>
            and then "Add to Home Screen"{" "}
            <span role="img" aria-label="plus icon" className="inline-block">
              {" "}
              ➕{" "}
            </span>
          </p>
        </div>
      </div>
    );
  }

  return null;
}
