import { ObjectId } from "mongodb";
import { ProductRepository } from "@/lib/repositories/product.repository";
import { PriceAlertRepository } from "@/lib/repositories/price-alert.repository";
import { PriceService } from "./price.service";

export class WatchlistService {
  private productRepo: ProductRepository;
  private alertRepo: PriceAlertRepository;
  private priceService: PriceService;

  constructor() {
    this.productRepo = new ProductRepository();
    this.alertRepo = new PriceAlertRepository();
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

      return { productId, alertId };
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      throw error;
    }
  }

  async getUserWatchlist(userId: ObjectId): Promise<
    Array<{
      alertId: ObjectId;
      productId: ObjectId;
      title: string;
      image: string;
      latestPrice: number;
      targetPrice: number;
      canonicalUrl: string;
      createdAt: Date | undefined;
    }>
  > {
    try {
      const alerts = await this.alertRepo.getUserAlerts(userId);

      const watchlist = await Promise.all(
        alerts.map(async (alert) => {
          const product = await this.productRepo.findById(alert.productId);
          if (!product) {
            throw new Error(`Product not found: ${alert.productId}`);
          }

          return {
            alertId: alert._id!,
            productId: alert.productId,
            title: product.title,
            image: product.image,
            latestPrice: product.latestPrice,
            targetPrice: alert.targetPrice,
            canonicalUrl: product.canonicalUrl,
            createdAt: alert.createdAt,
          };
        }),
      );

      return watchlist;
    } catch (error) {
      console.error("Error getting watchlist:", error);
      throw error;
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
      } as any);

      if (!alert) {
        throw new Error("Alert not found");
      }

      await this.alertRepo.updateOne({ _id: alert._id! } as any, {
        targetPrice: newTargetPrice,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Error updating target price:", error);
      throw error;
    }
  }

  async getProductDetails(productId: ObjectId): Promise<any> {
    return await this.productRepo.findById(productId);
  }
}
