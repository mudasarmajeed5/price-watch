import { ObjectId } from "mongodb";
import { NotificationPayload } from "@/lib/types/notification";

export interface INotification {
  send(userId: ObjectId, payload: NotificationPayload): Promise<boolean>;
}
