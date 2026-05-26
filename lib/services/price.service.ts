import { ObjectId } from "mongodb";
import { ProductRepository } from "@/lib/repositories/product.repository";
import { PriceSnapshotRepository } from "@/lib/repositories/price-snapshot.repository";
import { StrategyFactory } from "@/lib/fetching/strategy-factory";

export class PriceService {
  private productRepo: ProductRepository;
  private snapshotRepo: PriceSnapshotRepository;

  constructor() {
    this.productRepo = new ProductRepository();
    this.snapshotRepo = new PriceSnapshotRepository();
  }

  async fetchAndUpdatePrice(
    url: string,
  ): Promise<{ productId: ObjectId; newPrice: number } | null> {
    try {
      // Fetch product data from the store
      const productData = await StrategyFactory.fetchProduct(url);

      const price = parseFloat(productData.price);

      // Upsert product in database
      const productId = await this.productRepo.upsertProduct({
        store: productData.store as any,
        handle: productData.handle,
        canonicalUrl: productData.canonicalUrl,
        title: productData.title,
        image: productData.image,
        currency: productData.currency,
        latestPrice: price,
      });

      // Record price snapshot for historical tracking
      await this.snapshotRepo.recordSnapshot(
        productId,
        price,
        productData.currency,
      );

      // Update product with latest price
      await this.productRepo.updateLatestPrice(productId, price);

      return { productId, newPrice: price };
    } catch (error) {
      console.error("Error fetching price:", error);
      throw error;
    }
  }

  async checkPriceDrops(): Promise<
    Array<{
      productId: ObjectId;
      title: string;
      oldPrice: number;
      newPrice: number;
      targetPrice: number;
    }>
  > {
    try {
      const products = await this.productRepo.getAllActiveProducts();
      const priceDrops: Array<{
        productId: ObjectId;
        title: string;
        oldPrice: number;
        newPrice: number;
        targetPrice: number;
      }> = [];

      for (const product of products) {
        try {
          const result = await StrategyFactory.fetchProduct(
            product.canonicalUrl,
          );
          const newPrice = parseFloat(result.price);

          if (newPrice !== product.latestPrice) {
            // Record the price change
            await this.snapshotRepo.recordSnapshot(
              product._id!,
              newPrice,
              product.currency,
            );

            // Update product latest price
            await this.productRepo.updateLatestPrice(product._id!, newPrice);

            priceDrops.push({
              productId: product._id!,
              title: product.title,
              oldPrice: product.latestPrice,
              newPrice: newPrice,
              targetPrice: 0, // Will be populated by the caller
            });
          }
        } catch (error) {
          console.error(
            `Error checking price for product ${product._id}:`,
            error,
          );
        }
      }

      return priceDrops;
    } catch (error) {
      console.error("Error checking prices:", error);
      throw error;
    }
  }

  async getPriceHistory(
    productId: ObjectId,
    limit: number = 30,
  ): Promise<Array<{ price: number; date: Date }>> {
    const snapshots = await this.snapshotRepo.getHistory(productId, limit);
    return snapshots.map((s) => ({
      price: s.price,
      date: s.checkedAt || new Date(),
    }));
  }
}
