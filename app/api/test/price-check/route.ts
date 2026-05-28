import { NextRequest, NextResponse } from "next/server";
import { PriceService } from "@/lib/services/price.service";
import { ProductRepository } from "@/lib/repositories/product.repository";
import { PriceAlertRepository } from "@/lib/repositories/price-alert.repository";

const priceService = new PriceService();
const productRepo = new ProductRepository();
const alertRepo = new PriceAlertRepository();

export async function GET(request: NextRequest) {
  try {
    // Optional: require authentication
    const authHeader = request.headers.get("authorization");
    const testSecret = process.env.CRON_SECRET;

    if (authHeader !== `Bearer ${testSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("📊 [TEST] Starting price check test...");

    // Get all products
    const products = await productRepo.getAllActiveProducts();
    console.log(`📦 [TEST] Found ${products.length} products`);

    const results = [];

    // Check each product
    for (const product of products.slice(0, 5)) {
      // Limit to first 5 for testing
      try {
        console.log(`🔍 [TEST] Checking ${product.title}...`);
        const result = await priceService.fetchAndUpdatePrice(
          product.canonicalUrl,
        );

        if (result) {
          results.push({
            productId: product._id,
            title: product.title,
            previousPrice: product.latestPrice,
            newPrice: result.newPrice,
            currency: product.currency,
            change: result.newPrice - product.latestPrice,
            percentChange:
              (
                ((result.newPrice - product.latestPrice) /
                  product.latestPrice) *
                100
              ).toFixed(2) + "%",
          });

          console.log(
            `✅ [TEST] ${product.title}: ${product.latestPrice} → ${result.newPrice}`,
          );
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error(`❌ [TEST] Failed to check ${product.title}:`, errorMsg);
        results.push({
          productId: product._id,
          title: product.title,
          error: errorMsg,
        });
      }
    }

    // Get alerts for these products
    const alerts = await alertRepo.getActiveAlerts();
    console.log(`🔔 [TEST] Found ${alerts.length} active alerts`);

    const alertSummary = alerts.slice(0, 10).map((alert) => ({
      alertId: alert._id,
      productId: alert.productId,
      targetPrice: alert.targetPrice,
      lastNotifiedAt: alert.lastNotifiedAt,
    }));

    return NextResponse.json({
      success: true,
      data: {
        timestamp: new Date(),
        productsChecked: results.length,
        results: results,
        totalAlerts: alerts.length,
        recentAlerts: alertSummary,
        message: "Price check test completed successfully",
      },
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("❌ [TEST] Price check test failed:", errorMsg);
    return NextResponse.json(
      {
        success: false,
        error: errorMsg,
        timestamp: new Date(),
      },
      { status: 500 },
    );
  }
}
