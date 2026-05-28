import { NotificationPayload } from "@/lib/types/notification";

export class EmailTemplates {
  static generatePriceAlertTemplate(payload: NotificationPayload): string {
    return `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #0f6b4a 0%, #0d5a3f 100%); padding: 30px 20px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 600;">🎉 Price Drop Alert!</h1>
          <p style="margin: 8px 0 0 0; font-size: 16px; opacity: 0.9;">Your product just hit your target price</p>
        </div>

        <!-- Body -->
        <div style="background-color: white; padding: 30px 20px; margin: 0;">
          <div style="padding: 20px; background-color: #f0fdf4; border-left: 4px solid #0f6b4a; border-radius: 4px; margin-bottom: 20px;">
            <p style="margin: 0; font-size: 16px; color: #1f2937; line-height: 1.6;">
              ${payload.body}
            </p>
          </div>

          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 14px;">
              <div>
                <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px; text-transform: uppercase; font-weight: 600;">Product</p>
                <p style="margin: 0; color: #1f2937; font-weight: 500;">${payload.title}</p>
              </div>
              <div>
                <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px; text-transform: uppercase; font-weight: 600;">Action Required</p>
                <p style="margin: 0; color: #1f2937; font-weight: 500;">Check availability</p>
              </div>
            </div>
          </div>

          <!-- CTA Button -->
          ${
            payload.url
              ? `
            <div style="text-align: center; margin-bottom: 30px;">
              <a href="${payload.url}" style="display: inline-block; padding: 14px 32px; background-color: #0f6b4a; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; transition: background-color 0.3s;">
                View Product Now →
              </a>
            </div>
          `
              : ""
          }

          <!-- Info Box -->
          <div style="background-color: #eff6ff; padding: 16px; border-radius: 6px; border: 1px solid #dbeafe; margin-bottom: 20px;">
            <p style="margin: 0; font-size: 13px; color: #1e40af; line-height: 1.6;">
              <strong>💡 Tip:</strong> Product prices fluctuate frequently. Check quickly to secure your item before it's out of stock or the price changes again.
            </p>
          </div>

          <div style="background-color: #fef3c7; padding: 16px; border-radius: 6px; border: 1px solid #fcd34d; margin-bottom: 20px;">
            <p style="margin: 0; font-size: 13px; color: #92400e; line-height: 1.6;">
              <strong>⏰ Limited Time:</strong> This price alert might only be valid for a short time. We recommend acting quickly.
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
          <p style="margin: 0 0 12px 0;">
            You're receiving this email because you set a price alert for this product.
          </p>
          <p style="margin: 0;">
            <a href="https://price-watch.app/profile" style="color: #0f6b4a; text-decoration: none; font-weight: 500;">Manage Alerts</a> • 
            <a href="https://price-watch.app/profile" style="color: #0f6b4a; text-decoration: none; font-weight: 500;">Preferences</a>
          </p>
          <p style="margin: 12px 0 0 0; font-size: 11px; color: #9ca3af;">
            © 2026 Price Watch. All rights reserved. | 
            <a href="https://price-watch.app" style="color: #0f6b4a; text-decoration: none;">privacy</a>
          </p>
        </div>

        <!-- Tracking pixel (optional) -->
        <img src="https://your-domain.com/api/email-tracking?id=tracking-id" width="1" height="1" style="display: none;" alt="" />
      </div>
    `;
  }

  static generateWelcomeTemplate(): string {
    return `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #0f6b4a 0%, #0d5a3f 100%); padding: 30px 20px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 600;">Welcome to Price Watch! 👋</h1>
        </div>

        <div style="background-color: white; padding: 30px 20px;">
          <p style="margin: 0 0 20px 0; font-size: 16px; color: #1f2937; line-height: 1.6;">
            Hi there! You're all set to start monitoring product prices.
          </p>

          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="margin: 0 0 12px 0; font-size: 18px; color: #0f6b4a;">Here's what you can do:</h2>
            <ul style="margin: 0; padding-left: 20px; color: #374151;">
              <li style="margin: 8px 0;">Add products to your watchlist</li>
              <li style="margin: 8px 0;">Set target prices for each product</li>
              <li style="margin: 8px 0;">Receive email and push notifications</li>
              <li style="margin: 8px 0;">Track price history and trends</li>
            </ul>
          </div>

          <p style="margin: 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
            Prices are checked automatically every 6 hours. You'll be notified immediately when a product reaches your target price.
          </p>
        </div>

        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
          <p style="margin: 0;">© 2026 Price Watch. All rights reserved.</p>
        </div>
      </div>
    `;
  }

  static generateNotificationSummaryTemplate(
    alerts: Array<{
      productTitle: string;
      currentPrice: number;
      targetPrice: number;
      currency: string;
    }>,
  ): string {
    const alertsList = alerts
      .map(
        (alert) => `
        <div style="padding: 12px; background-color: #f9fafb; border-left: 3px solid #0f6b4a; margin-bottom: 8px;">
          <p style="margin: 0 0 4px 0; font-weight: 500; color: #1f2937;">${alert.productTitle}</p>
          <p style="margin: 0; font-size: 13px; color: #6b7280;">
            ${alert.currency} ${alert.currentPrice.toLocaleString()} (Target: ${alert.currency} ${alert.targetPrice.toLocaleString()})
          </p>
        </div>
      `,
      )
      .join("");

    return `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #0f6b4a 0%, #0d5a3f 100%); padding: 30px 20px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 600;">📊 Your Price Monitoring Summary</h1>
        </div>

        <div style="background-color: white; padding: 30px 20px;">
          <h2 style="margin: 0 0 20px 0; font-size: 18px; color: #1f2937;">Alerts This Week:</h2>
          ${alertsList}
        </div>

        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
          <p style="margin: 0;">© 2026 Price Watch. All rights reserved.</p>
        </div>
      </div>
    `;
  }

  static generatePlainText(payload: NotificationPayload): string {
    return `
${payload.title}

${payload.body}

${payload.url ? `View Product: ${payload.url}` : ""}

---
Price Watch
Keep track of your favorite products!
    `.trim();
  }
}
