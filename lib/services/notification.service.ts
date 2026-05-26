import { ObjectId } from "mongodb";
import { NotificationFactory } from "@/lib/notifications/notification.factory";
import { NotificationQueueRepository } from "@/lib/repositories/notification-queue.repository";
import { PriceAlertRepository } from "@/lib/repositories/price-alert.repository";
import { ProductRepository } from "@/lib/repositories/product.repository";
import {
  NotificationChannel,
  NotificationPayload,
} from "@/lib/types/notification";

export class NotificationService {
  private queueRepo: NotificationQueueRepository;
  private alertRepo: PriceAlertRepository;
  private productRepo: ProductRepository;

  constructor() {
    this.queueRepo = new NotificationQueueRepository();
    this.alertRepo = new PriceAlertRepository();
    this.productRepo = new ProductRepository();
  }

  async notifyPriceDrop(
    userId: ObjectId,
    productId: ObjectId,
    targetPrice: number,
    currentPrice: number,
    channels: NotificationChannel[] = ["email", "push"],
  ): Promise<void> {
    try {
      const product = await this.productRepo.findById(productId);
      if (!product) {
        throw new Error(`Product not found: ${productId}`);
      }

      const priceDiff = product.latestPrice - currentPrice;
      const payload: NotificationPayload = {
        title: "Price Drop Alert! 🎉",
        body: `${product.title} has dropped to ${product.currency} ${currentPrice.toLocaleString()}. Your target was ${product.currency} ${targetPrice.toLocaleString()}.`,
        url: `/product/${productId}`,
        icon: product.image,
      };

      // Send notifications through configured channels
      for (const channel of channels) {
        try {
          const notificationService =
            NotificationFactory.getNotificationService(channel);
          const sent = await notificationService.send(userId, payload);

          // Log notification in queue
          await this.queueRepo.addToQueue(userId, productId, channel, payload);

          if (sent) {
            console.log(`✅ ${channel} notification sent to user ${userId}`);
          }
        } catch (error) {
          console.error(`Error sending ${channel} notification:`, error);
        }
      }

      // Mark alert as notified
      const alert = await this.alertRepo.findOne({
        userId,
        productId,
      } as any);
      if (alert && alert._id) {
        await this.alertRepo.markNotified(alert._id);
      }
    } catch (error) {
      console.error("Error notifying price drop:", error);
      throw error;
    }
  }

  async processPendingNotifications(): Promise<void> {
    try {
      const pending = await this.queueRepo.getPendingNotifications();

      for (const notification of pending) {
        try {
          const service = NotificationFactory.getNotificationService(
            notification.channel,
          );
          const sent = await service.send(
            notification.userId,
            notification.payload,
          );

          if (sent) {
            await this.queueRepo.markAsSent(notification._id!);
          } else {
            await this.queueRepo.markAsFailed(
              notification._id!,
              "Notification service returned false",
            );
          }
        } catch (error) {
          await this.queueRepo.markAsFailed(
            notification._id!,
            error instanceof Error ? error.message : "Unknown error",
          );
        }
      }
    } catch (error) {
      console.error("Error processing pending notifications:", error);
    }
  }

  async getNotificationHistory(
    userId: ObjectId,
    limit: number = 10,
  ): Promise<any[]> {
    return await this.queueRepo.getUserNotifications(userId, limit);
  }
}
