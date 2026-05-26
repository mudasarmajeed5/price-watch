import { ObjectId } from "mongodb";
import { INotification } from "./base.notification";
import { NotificationPayload } from "@/lib/types/notification";
import nodemailer from "nodemailer";

export class EmailNotification implements INotification {
  private transporter: nodemailer.Transporter;

  constructor() {
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
      // Note: In production, fetch the user's email from the database
      // For now, this is a placeholder that would be called with user email
      const userEmail = await this.getUserEmail(userId);

      if (!userEmail) {
        console.warn(`No email found for user ${userId}`);
        return false;
      }

      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: userEmail,
        subject: payload.title,
        html: this.generateHtmlTemplate(payload),
      });

      return true;
    } catch (error) {
      console.error("Email notification error:", error);
      return false;
    }
  }

  private generateHtmlTemplate(payload: NotificationPayload): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0;">${payload.title}</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">${payload.body}</p>
          ${
            payload.url
              ? `
            <a href="${payload.url}" style="display: inline-block; padding: 12px 24px; background-color: #0f6b4a; color: white; text-decoration: none; border-radius: 4px; margin-top: 20px;">
              View Product
            </a>
          `
              : ""
          }
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">Price Watch</p>
        </div>
      </div>
    `;
  }

  private async getUserEmail(userId: ObjectId): Promise<string | null> {
    // This would be implemented to fetch user email from database
    // For now returning null
    return null;
  }
}
