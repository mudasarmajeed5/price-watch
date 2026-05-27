"use server";

import webpush from "web-push";

// Configure webpush with VAPID details
webpush.setVapidDetails(
  process.env.VAPID_EMAIL || "mailto:support@pricewatch.app",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

// Type for push subscription as expected by web-push
interface WebPushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

// Store subscriptions in memory (in production, use a database)
let subscriptions: WebPushSubscription[] = [];

export async function subscribeUser(
  subscription: WebPushSubscription,
): Promise<{ success: boolean; message?: string }> {
  try {
    // In production, store subscription in database
    // Example: await db.pushSubscriptions.create({ data: { endpoint: subscription.endpoint, ... } })

    const exists = subscriptions.some(
      (sub) => sub.endpoint === subscription.endpoint,
    );
    if (!exists) {
      subscriptions.push(subscription);
    }

    console.log("User subscribed to push notifications");
    return { success: true, message: "Subscribed to push notifications" };
  } catch (error) {
    console.error("Error subscribing user:", error);
    return {
      success: false,
      message: "Failed to subscribe to notifications",
    };
  }
}

export async function unsubscribeUser(): Promise<{
  success: boolean;
  message?: string;
}> {
  try {
    // In production, remove subscription from database
    subscriptions = [];

    console.log("User unsubscribed from push notifications");
    return { success: true, message: "Unsubscribed from push notifications" };
  } catch (error) {
    console.error("Error unsubscribing user:", error);
    return {
      success: false,
      message: "Failed to unsubscribe from notifications",
    };
  }
}

export async function sendNotification(
  message: string,
  title: string = "Price Watch Alert",
): Promise<{ success: boolean; message?: string }> {
  try {
    if (subscriptions.length === 0) {
      return {
        success: false,
        message: "No subscriptions available",
      };
    }

    const payload = JSON.stringify({
      title: title,
      body: message,
      icon: "/icon-192x192.png",
      tag: "price-alert",
      url: "/watchlist",
    });

    // Send notification to all subscriptions
    const results = await Promise.allSettled(
      subscriptions.map((subscription) =>
        webpush.sendNotification(subscription, payload),
      ),
    );

    const successful = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    console.log(
      `Notification sent: ${successful} successful, ${failed} failed`,
    );

    return {
      success: true,
      message: `Notification sent to ${successful} users`,
    };
  } catch (error) {
    console.error("Error sending notification:", error);
    return {
      success: false,
      message: "Failed to send notification",
    };
  }
}

export async function sendPriceAlert(
  productName: string,
  currentPrice: number,
  previousPrice: number,
  productId: string,
): Promise<{ success: boolean; message?: string }> {
  const priceChange = previousPrice
    ? (((currentPrice - previousPrice) / previousPrice) * 100).toFixed(2)
    : "N/A";
  const direction = currentPrice < previousPrice ? "📉" : "📈";

  const title = "Price Update: " + productName;
  const message = `Price changed to ${currentPrice} ${direction} (${priceChange}% change)`;

  return sendNotification(message, title);
}
