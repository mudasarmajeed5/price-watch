import { ObjectId, Filter } from "mongodb";
import { BaseRepository } from "./base.repository";
import { PriceAlert, PriceAlertWithProduct } from "@/lib/types/alert";

export class PriceAlertRepository extends BaseRepository<PriceAlert> {
  constructor() {
    super("price_alerts");
  }

  async createAlert(alert: Omit<PriceAlert, "_id">): Promise<ObjectId> {
    const existing = await this.findOne({
      userId: alert.userId,
      productId: alert.productId,
    } as Filter<PriceAlert>);

    if (existing) {
      // Update existing alert
      await this.updateOne(
        {
          userId: alert.userId,
          productId: alert.productId,
        } as Filter<PriceAlert>,
        {
          ...alert,
          updatedAt: new Date(),
        },
      );
      return existing._id!;
    }

    // Create new alert
    const result = await this.create({
      ...alert,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return result.insertedId;
  }

  async getActiveAlerts(): Promise<PriceAlert[]> {
    return await this.find({ isActive: true } as Filter<PriceAlert>);
  }

  async getUserAlerts(userId: ObjectId): Promise<PriceAlert[]> {
    return await this.find({ userId, isActive: true } as Filter<PriceAlert>);
  }

  async getAlertsByProduct(productId: ObjectId): Promise<PriceAlert[]> {
    return await this.find({
      productId,
      isActive: true,
    } as Filter<PriceAlert>);
  }

  async markNotified(alertId: ObjectId): Promise<void> {
    await this.updateOne({ _id: alertId } as Filter<PriceAlert>, {
      lastNotifiedAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async deactivateAlert(alertId: ObjectId): Promise<void> {
    await this.updateOne({ _id: alertId } as Filter<PriceAlert>, {
      isActive: false,
      updatedAt: new Date(),
    });
  }

  async deleteAlert(userId: ObjectId, productId: ObjectId): Promise<void> {
    await this.deleteOne({
      userId,
      productId,
    } as Filter<PriceAlert>);
  }
}
