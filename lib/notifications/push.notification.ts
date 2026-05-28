import { ObjectId } from "mongodb";
import { INotification } from "./base.notification";
import { NotificationPayload } from "@/lib/types/notification";
import webpush from "web-push";
import { PushSubscriptionRepository } from "@/lib/repositories/push-subscription.repository";

export class PushNotification implements INotification {
  private subscriptionRepo: PushSubscriptionRepository;

  constructor() {
    this.subscriptionRepo = new PushSubscriptionRepository();

    // Configure VAPID keys
    const publicKey = process.env.VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;

    if (publicKey && privateKey) {
      // Ensure the VAPID subject is a valid mailto: or https: URL
      const rawSubject = process.env.VAPID_EMAIL || "admin@price-watch.app";
      const subject =
        rawSubject.startsWith("mailto:") || rawSubject.startsWith("https:")
          ? rawSubject
          : `mailto:${rawSubject}`;

      webpush.setVapidDetails(subject, publicKey, privateKey);
    }
  }

  async send(userId: ObjectId, payload: NotificationPayload): Promise<boolean> {
    try {
      const subscriptions =
        await this.subscriptionRepo.getUserSubscriptions(userId);

      if (subscriptions.length === 0) {
        console.warn(`No push subscriptions found for user ${userId}`);
        return false;
      }

      const notificationPayload = JSON.stringify({
        title: payload.title,
        body: payload.body,
        icon: payload.icon || "/icon-192x192.png",
        badge: "/badge-72x72.png",
        tag: "price-alert",
        data: {
          url: payload.url || "/",
        },
      });

      const sendPromises = subscriptions.map((sub) =>
        this.sendToSubscription(sub, notificationPayload, userId),
      );

      const results = await Promise.allSettled(sendPromises);
      return results.some((r) => r.status === "fulfilled" && r.value);
    } catch (error) {
      console.error("Push notification error:", error);
      return false;
    }
  }

  private async sendToSubscription(
    subscription: any,
    payload: string,
    userId: ObjectId,
  ): Promise<boolean> {
    try {
      await webpush.sendNotification(
        {
          endpoint: subscription.endpoint,
          keys: subscription.keys,
        },
        payload,
      );
      return true;
    } catch (error: any) {
      // Handle 410 Gone (subscription no longer valid)
      if (error.statusCode === 410) {
        await this.subscriptionRepo.removeSubscription(
          userId,
          subscription.endpoint,
        );
      }
      console.error("Failed to send push notification:", error.message);
      return false;
    }
  }
}
