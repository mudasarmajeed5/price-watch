import { ObjectId } from "mongodb";
import { ProductRepository } from "@/lib/repositories/product.repository";
import { PriceAlertRepository } from "@/lib/repositories/price-alert.repository";
import { NotificationQueueRepository } from "@/lib/repositories/notification-queue.repository";
import { PriceService } from "./price.service";
import { NotificationPayload } from "@/lib/types/notification";

export class WatchlistService {
  private productRepo: ProductRepository;
  private alertRepo: PriceAlertRepository;
  private queueRepo: NotificationQueueRepository;
  private priceService: PriceService;

  constructor() {
    this.productRepo = new ProductRepository();
    this.alertRepo = new PriceAlertRepository();
    this.queueRepo = new NotificationQueueRepository();
    this.priceService = new PriceService();
  }

  async addToWatchlist(
    userId: ObjectId,
    url: string,
    targetPrice: number,
  ): Promise<{ productId: ObjectId; alertId: ObjectId }> {
    try {
      // Fetch and save product
      const priceResult = await this.priceService.fetchAndUpdatePrice(url);
      if (!priceResult) {
        throw new Error("Failed to fetch product price");
      }

      const { productId } = priceResult;

      // Create price alert
      const alertId = await this.alertRepo.createAlert({
        userId,
        productId,
        targetPrice,
        currency: "PKR",
        isActive: true,
      });

      const product = await this.productRepo.findById(productId);
      if (product && priceResult.newPrice <= targetPrice) {
        const payload: NotificationPayload = {
          title: "Price Drop Alert! 🎉",
          body: `${product.title} is now PKR ${priceResult.newPrice.toLocaleString()}. Your target was PKR ${targetPrice.toLocaleString()}.`,
          url: `/product/${productId}`,
          icon: product.image,
        };

        await Promise.all([
          this.queueRepo.addToQueue(userId, productId, "email", payload),
          this.queueRepo.addToQueue(userId, productId, "push", payload),
        ]);
      }

      return { productId, alertId };
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      throw error;
    }
  }

  async getUserWatchlist(userId: ObjectId): Promise<
    Array<{
      _id: ObjectId;
      alertId: ObjectId;
      productId: ObjectId;
      title: string;
      image: string;
      latestPrice: number;
      targetPrice: number;
      canonicalUrl: string;
      store: string;
      brand?: string;
      discount?: number;
      dropAmount?: number;
      dropPercent?: number;
      createdAt: Date | undefined;
    }>
  > {
    try {
      const alerts = await this.alertRepo.getUserAlerts(userId);

      const watchlistPromises = alerts.map(async (alert) => {
        const product = await this.productRepo.findById(alert.productId);
        if (!product) {
          console.warn(`Product not found for alert ${alert._id}, skipping...`);
          return null;
        }

        // Calculate discount/drop amount from target price
        // If latestPrice is below targetPrice, show how much it dropped
        const dropAmount = Math.max(0, alert.targetPrice - product.latestPrice);
        const dropPercent =
          alert.targetPrice > 0
            ? Math.round((dropAmount / alert.targetPrice) * 100)
            : 0;

        return {
          _id: alert.productId,
          alertId: alert._id!,
          productId: alert.productId,
          title: product.title,
          image: product.image,
          latestPrice: product.latestPrice,
          targetPrice: alert.targetPrice,
          canonicalUrl: product.canonicalUrl,
          store: product.store,
          brand: (product as any).brand,
          discount: dropPercent > 0 ? dropPercent : undefined,
          dropAmount: dropAmount > 0 ? dropAmount : undefined,
          dropPercent: dropPercent > 0 ? dropPercent : undefined,
          createdAt: alert.createdAt,
        };
      });

      const results = await Promise.all(watchlistPromises);
      const watchlist = results.filter((item) => item !== null);

      return watchlist;
    } catch (error) {
      console.error("Error getting watchlist:", error);
      return [];
    }
  }

  async removeFromWatchlist(
    userId: ObjectId,
    productId: ObjectId,
  ): Promise<void> {
    try {
      await this.alertRepo.deleteAlert(userId, productId);
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      throw error;
    }
  }

  async updateTargetPrice(
    userId: ObjectId,
    productId: ObjectId,
    newTargetPrice: number,
  ): Promise<void> {
    try {
      const alert = await this.alertRepo.findOne({
        userId,
        productId,
        isActive: true,
      } as any);

      if (!alert) {
        console.warn(
          `Alert not found for userId: ${userId}, productId: ${productId}`,
        );
        throw new Error("Alert not found");
      }

      const result = await this.alertRepo.updateOne(
        { _id: alert._id! } as any,
        {
          targetPrice: newTargetPrice,
          updatedAt: new Date(),
        },
      );

      console.log(
        `Updated target price for alert ${alert._id}: ${newTargetPrice}, matched: ${result.matchedCount}, modified: ${result.modifiedCount}`,
      );
    } catch (error) {
      console.error("Error updating target price:", error);
      throw error;
    }
  }

  async getProductDetails(productId: ObjectId): Promise<any> {
    return await this.productRepo.findById(productId);
  }
}
