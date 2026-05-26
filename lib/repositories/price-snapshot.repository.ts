import { ObjectId, Filter } from "mongodb";
import { BaseRepository } from "./base.repository";
import { PriceSnapshot } from "@/lib/types/product";

export class PriceSnapshotRepository extends BaseRepository<PriceSnapshot> {
  constructor() {
    super("price_snapshots");
  }

  async recordSnapshot(
    productId: ObjectId,
    price: number,
    currency: string,
  ): Promise<ObjectId> {
    const result = await this.create({
      productId,
      price,
      currency,
      checkedAt: new Date(),
    });
    return result.insertedId;
  }

  async getHistory(
    productId: ObjectId,
    limit: number = 30,
  ): Promise<PriceSnapshot[]> {
    return await this.collection
      .find({ productId } as Filter<PriceSnapshot>)
      .sort({ checkedAt: -1 })
      .limit(limit)
      .toArray();
  }

  async getLatestSnapshot(productId: ObjectId): Promise<PriceSnapshot | null> {
    return await this.collection
      .findOne({ productId } as Filter<PriceSnapshot>)
      .sort({ checkedAt: -1 });
  }
}
