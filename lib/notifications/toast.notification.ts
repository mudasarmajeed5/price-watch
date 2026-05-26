import { ObjectId } from "mongodb";
import { INotification } from "./base.notification";
import { NotificationPayload } from "@/lib/types/notification";

export class ToastNotification implements INotification {
  async send(userId: ObjectId, payload: NotificationPayload): Promise<boolean> {
    // Toast notifications are only for client-side display
    // This is a placeholder for API consistency
    // Actual toast display should be done on the client using libraries like Sonner
    console.log("Toast notification:", payload);
    return true;
  }

  // Helper method for client-side components
  static async showToast(payload: NotificationPayload): Promise<void> {
    // This would be called from client components using the Sonner library
    // Example: toast.success(payload.body)
    console.log("Show toast:", payload);
  }
}
