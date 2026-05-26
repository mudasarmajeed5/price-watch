import { EmailNotification } from "./email.notification";
import { PushNotification } from "./push.notification";
import { ToastNotification } from "./toast.notification";
import { INotification } from "./base.notification";
import { NotificationChannel } from "@/lib/types/notification";

export class NotificationFactory {
  private static emailNotification: EmailNotification;
  private static pushNotification: PushNotification;
  private static toastNotification: ToastNotification;

  static {
    this.emailNotification = new EmailNotification();
    this.pushNotification = new PushNotification();
    this.toastNotification = new ToastNotification();
  }

  static getNotificationService(channel: NotificationChannel): INotification {
    switch (channel) {
      case "email":
        return this.emailNotification;
      case "push":
        return this.pushNotification;
      case "toast":
        return this.toastNotification;
      default:
        throw new Error(`Unknown notification channel: ${channel}`);
    }
  }
}
