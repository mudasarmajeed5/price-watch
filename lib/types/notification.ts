import { ObjectId } from "mongodb";

export type NotificationChannel = "email" | "push" | "toast";
export type NotificationStatus = "pending" | "sent" | "failed";

export interface NotificationPayload {
  title: string;
  body: string;
  url?: string;
  icon?: string;
}

export interface NotificationQueue {
  _id?: ObjectId;
  userId: ObjectId;
  productId?: ObjectId;
  channel: NotificationChannel;
  payload: NotificationPayload;
  status: NotificationStatus;
  error?: string;
  createdAt?: Date;
  sentAt?: Date;
}

export interface PushSubscription {
  _id?: ObjectId;
  userId: ObjectId;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface INotificationService {
  send(
    userId: ObjectId,
    payload: NotificationPayload,
    channel: NotificationChannel,
  ): Promise<boolean>;
  logNotification(
    userId: ObjectId,
    productId: ObjectId,
    channel: NotificationChannel,
    payload: NotificationPayload,
    status: NotificationStatus,
    error?: string,
  ): Promise<void>;
}
