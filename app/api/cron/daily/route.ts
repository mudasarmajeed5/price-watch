import { NextRequest, NextResponse } from "next/server";
import { PriceService } from "@/lib/services/price.service";
import { PriceAlertRepository } from "@/lib/repositories/price-alert.repository";
import { NotificationService } from "@/lib/services/notification.service";

const priceService = new PriceService();
const alertRepo = new PriceAlertRepository();
const notificationService = new NotificationService();

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("🔍 Starting daily price check...");

    // Check all prices
    const priceDrops = await priceService.checkPriceDrops();
    console.log(`📊 Found ${priceDrops.length} price changes`);

    // Get all active alerts
    const alerts = await alertRepo.getActiveAlerts();
    console.log(`🔔 Found ${alerts.length} active alerts`);

    let notificationsCount = 0;

    // For each alert, check if price dropped to or below target
    for (const alert of alerts) {
      const priceDrop = priceDrops.find((p) =>
        p.productId.equals(alert.productId),
      );

      if (priceDrop && priceDrop.newPrice <= alert.targetPrice) {
        // Check if we recently notified (avoid duplicate notifications)
        if (
          alert.lastNotifiedAt &&
          new Date().getTime() - alert.lastNotifiedAt.getTime() <
            24 * 60 * 60 * 1000
        ) {
          console.log(
            `⏭️  Skipping notification for alert ${alert._id} (already notified recently)`,
          );
          continue;
        }

        try {
          await notificationService.notifyPriceDrop(
            alert.userId,
            alert.productId,
            alert.targetPrice,
            priceDrop.newPrice,
            ["email", "push"],
          );
          notificationsCount++;
          console.log(
            `✅ Sent notification for product ${alert.productId} to user ${alert.userId}`,
          );
        } catch (error) {
          console.error(`Error notifying for alert ${alert._id}:`, error);
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        priceChanges: priceDrops.length,
        alerts: alerts.length,
        notificationsSent: notificationsCount,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Cron job failed",
      },
      { status: 500 },
    );
  }
}

// Support GET for testing
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      message: "Cron endpoint is working. Send POST request to execute.",
    });
  } catch (error) {
    return NextResponse.json({ error: "Cron check failed" }, { status: 500 });
  }
}
