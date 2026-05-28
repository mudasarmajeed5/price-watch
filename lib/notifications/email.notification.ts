import { ObjectId } from "mongodb";
import { INotification } from "./base.notification";
import { NotificationPayload } from "@/lib/types/notification";
import { UserRepository } from "@/lib/repositories/user.repository";
import { EmailTemplates } from "./email-templates";
import nodemailer from "nodemailer";

export class EmailNotification implements INotification {
  private transporter: nodemailer.Transporter;
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });
  }

  async send(userId: ObjectId, payload: NotificationPayload): Promise<boolean> {
    try {
      const userEmail = await this.getUserEmail(userId);

      if (!userEmail) {
        console.warn(`No email found for user ${userId}`);
        return false;
      }

      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: userEmail,
        subject: payload.title,
        html: EmailTemplates.generatePriceAlertTemplate(payload),
        text: EmailTemplates.generatePlainText(payload),
      });

      console.log(`✅ Email sent to ${userEmail} for price alert`);
      return true;
    } catch (error) {
      console.error("Email notification error:", error);
      return false;
    }
  }

  private generateHtmlTemplate(payload: NotificationPayload): string {
    return EmailTemplates.generatePriceAlertTemplate(payload);
  }

  private async getUserEmail(userId: ObjectId): Promise<string | null> {
    return await this.userRepo.getUserEmail(userId);
  }
}
