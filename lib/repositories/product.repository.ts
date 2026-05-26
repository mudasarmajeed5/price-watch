import { ObjectId, Filter } from "mongodb";
import { BaseRepository } from "./base.repository";
import { Product } from "@/lib/types/product";

export class ProductRepository extends BaseRepository<Product> {
  constructor() {
    super("products");
  }

  async findByHandle(store: string, handle: string): Promise<Product | null> {
    return await this.findOne({ store, handle } as Filter<Product>);
  }

  async findByUrl(canonicalUrl: string): Promise<Product | null> {
    return await this.findOne({ canonicalUrl } as Filter<Product>);
  }

  async upsertProduct(product: Omit<Product, "_id">): Promise<ObjectId> {
    const existing = await this.findByHandle(product.store, product.handle);

    if (existing) {
      const result = await this.updateOne(
        { _id: existing._id! } as Filter<Product>,
        {
          ...product,
          updatedAt: new Date(),
        },
      );
      return existing._id!;
    } else {
      const result = await this.create({
        ...product,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return result.insertedId;
    }
  }

  async getAllActiveProducts(): Promise<Product[]> {
    return await this.find({} as Filter<Product>);
  }

  async updateLatestPrice(productId: ObjectId, price: number): Promise<void> {
    await this.updateOne({ _id: productId } as Filter<Product>, {
      latestPrice: price,
      lastCheckedAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
