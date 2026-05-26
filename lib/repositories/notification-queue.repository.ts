import { ObjectId, Filter } from "mongodb";
import { BaseRepository } from "./base.repository";
import {
  NotificationQueue,
  NotificationChannel,
  NotificationStatus,
} from "@/lib/types/notification";

export class NotificationQueueRepository extends BaseRepository<NotificationQueue> {
  constructor() {
    super("notification_queue");
  }

  async addToQueue(
    userId: ObjectId,
    productId: ObjectId,
    channel: NotificationChannel,
    payload: any,
  ): Promise<ObjectId> {
    const result = await this.create({
      userId,
      productId,
      channel,
      payload,
      status: "pending",
      createdAt: new Date(),
    });
    return result.insertedId;
  }

  async getPendingNotifications(): Promise<NotificationQueue[]> {
    return await this.find({ status: "pending" } as Filter<NotificationQueue>);
  }

  async markAsSent(
    notificationId: ObjectId,
    sentAt: Date = new Date(),
  ): Promise<void> {
    await this.updateOne({ _id: notificationId } as Filter<NotificationQueue>, {
      status: "sent",
      sentAt,
    });
  }

  async markAsFailed(notificationId: ObjectId, error: string): Promise<void> {
    await this.updateOne({ _id: notificationId } as Filter<NotificationQueue>, {
      status: "failed",
      error,
    });
  }

  async getUserNotifications(
    userId: ObjectId,
    limit: number = 10,
  ): Promise<NotificationQueue[]> {
    return await this.collection
      .find({ userId } as Filter<NotificationQueue>)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
  }
}
