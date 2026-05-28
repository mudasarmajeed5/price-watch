import { NextRequest, NextResponse } from "next/server";
import { PriceService } from "@/lib/services/price.service";
import { PriceAlertRepository } from "@/lib/repositories/price-alert.repository";
import { NotificationService } from "@/lib/services/notification.service";
import { ProductRepository } from "@/lib/repositories/product.repository";

const priceService = new PriceService();
const alertRepo = new PriceAlertRepository();
const notificationService = new NotificationService();
const productRepo = new ProductRepository();

interface PriceCheckResult {
  success: boolean;
  priceChanges: number;
  alerts: number;
  notificationsSent: number;
  failedNotifications: number;
  productsChecked: number;
  timestamp: Date;
  errors: string[];
}

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(
      "🔍 [CRON] Starting daily price check at",
      new Date().toISOString(),
    );

    // Return response immediately
    const responseData = {
      success: true,
      message: "Price check initiated - processing in background",
      timestamp: new Date(),
    };

    // Process notifications in background (don't await)
    (async () => {
      try {
        const products = await productRepo.getAllActiveProducts();
        console.log(`📦 [CRON] Found ${products.length} products to check`);

        const priceDrops = await priceService.checkPriceDrops();
        console.log(`📊 [CRON] Found ${priceDrops.length} price changes`);

        const alerts = await alertRepo.getActiveAlerts();
        console.log(`🔔 [CRON] Found ${alerts.length} active alerts`);

        const alertsByProduct = new Map<string, typeof alerts>();
        for (const alert of alerts) {
          const key = alert.productId.toString();
          if (!alertsByProduct.has(key)) {
            alertsByProduct.set(key, []);
          }
          alertsByProduct.get(key)!.push(alert);
        }

        for (const priceDrop of priceDrops) {
          const productKey = priceDrop.productId.toString();
          const relevantAlerts = alertsByProduct.get(productKey) || [];

          for (const alert of relevantAlerts) {
            if (priceDrop.newPrice <= alert.targetPrice) {
              const lastNotified = alert.lastNotifiedAt
                ? new Date(alert.lastNotifiedAt).getTime()
                : 0;
              const now = new Date().getTime();
              const timeSinceLastNotification = now - lastNotified;
              const notificationCooldown = 24 * 60 * 60 * 1000;

              if (
                timeSinceLastNotification < notificationCooldown &&
                alert.lastNotifiedAt
              ) {
                console.log(
                  `⏭️  [CRON] Skipping alert ${alert._id} (notified ${Math.floor(timeSinceLastNotification / (60 * 60 * 1000))}h ago)`,
                );
                continue;
              }

              try {
                console.log(
                  `📧 [CRON] Processing alert ${alert._id} - Price ${priceDrop.newPrice} <= Target ${alert.targetPrice}`,
                );

                await notificationService.notifyPriceDrop(
                  alert.userId,
                  alert.productId,
                  alert.targetPrice,
                  priceDrop.newPrice,
                  ["email", "push"],
                );

                console.log(
                  `✅ [CRON] Notification sent for product ${priceDrop.productId} to user ${alert.userId}`,
                );
              } catch (error) {
                const errorMsg =
                  error instanceof Error ? error.message : String(error);
                console.error(
                  `❌ [CRON] Failed to notify for alert ${alert._id}:`,
                  errorMsg,
                );
              }
            }
          }
        }

        console.log(
          `🎉 [CRON] Daily check completed at ${new Date().toISOString()}`,
        );
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Unknown error";
        console.error("❌ [CRON] Background job error:", errorMsg);
      }
    })();

    return NextResponse.json(responseData);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ [CRON] Request error:", errorMsg);

    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      message:
        "✅ Cron endpoint is active and ready. Send POST request to execute daily price check.",
      endpoint: "/api/cron/daily",
      method: "POST",
      authentication: "Bearer token via Authorization header",
    });
  } catch (error) {
    return NextResponse.json({ error: "Cron check failed" }, { status: 500 });
  }
}
