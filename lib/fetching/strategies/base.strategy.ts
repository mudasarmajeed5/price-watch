export interface FetchedProductData {
  title: string;
  image: string;
  price: string;
  currency: string;
  canonicalUrl: string;
  handle: string;
  store: string;
}

export interface IProductFetchStrategy {
  canHandle(url: string): boolean;
  fetch(url: string): Promise<FetchedProductData>;
}

export abstract class BaseStrategy implements IProductFetchStrategy {
  protected abstract storeName: string;
  protected abstract storeDomain: string;

  canHandle(url: string): boolean {
    return url.includes(this.storeDomain);
  }

  abstract fetch(url: string): Promise<FetchedProductData>;

  protected extractHandle(url: string): string {
    const clean = url.split("?")[0].replace(/\/$/, "");
    const parts = clean.split("/");
    return parts[parts.length - 1];
  }

  protected validateUrl(url: string): void {
    try {
      new URL(url);
    } catch {
      throw new Error(`Invalid URL: ${url}`);
    }
  }

  protected async fetchShopifyJson(url: string): Promise<any> {
    const jsonUrl = this.getJsonUrl(url);
    const res = await fetch(jsonUrl);
    if (!res.ok) {
      throw new Error(
        `Failed to fetch ${jsonUrl}: ${res.status} ${res.statusText}`,
      );
    }
    return await res.json();
  }

  protected getJsonUrl(url: string): string {
    const clean = url.split("?")[0].replace(/\/$/, "");
    return clean.endsWith(".json") ? clean : `${clean}.json`;
  }

  protected normalizePrice(price: string | number): string {
    if (typeof price === "number") {
      return price.toString();
    }
    return price.replace(/[^\d.]/g, "");
  }
}
