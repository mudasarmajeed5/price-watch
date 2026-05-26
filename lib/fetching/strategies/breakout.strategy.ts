import { BaseStrategy, FetchedProductData } from "./base.strategy";

export class BreakoutStrategy extends BaseStrategy {
  protected storeName = "breakout";
  protected storeDomain = "breakout.com.pk";

  async fetch(url: string): Promise<FetchedProductData> {
    this.validateUrl(url);

    try {
      const data = await this.fetchShopifyJson(url);
      return this.normalize(data, url);
    } catch (error) {
      throw new Error(
        `Failed to fetch product from Breakout: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  private normalize(data: any, url: string): FetchedProductData {
    const product = data.product;
    if (!product) {
      throw new Error("Invalid Shopify response: product not found");
    }

    const firstVariant = product.variants?.[0];
    if (!firstVariant) {
      throw new Error("No variants found for product");
    }

    return {
      title: product.title || "Unknown",
      image: product.images?.[0]?.src || "",
      price: this.normalizePrice(firstVariant.price || "0"),
      currency: "PKR",
      canonicalUrl: url.split("?")[0],
      handle: product.handle,
      store: this.storeName,
    };
  }
}
