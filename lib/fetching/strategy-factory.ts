import {
  IProductFetchStrategy,
  FetchedProductData,
} from "./strategies/base.strategy";
import { OutfittersStrategy } from "./strategies/outfitters.strategy";
import { BreakoutStrategy } from "./strategies/breakout.strategy";
import { SanaSafinazStrategy } from "./strategies/sana-safinaz.strategy";
import { SayaStrategy } from "./strategies/saya.strategy";

export class StrategyFactory {
  private static strategies: IProductFetchStrategy[] = [
    new OutfittersStrategy(),
    new BreakoutStrategy(),
    new SanaSafinazStrategy(),
    new SayaStrategy(),
  ];

  static getStrategy(url: string): IProductFetchStrategy {
    const strategy = this.strategies.find((s) => s.canHandle(url));

    if (!strategy) {
      throw new Error(
        `No strategy found for URL: ${url}. Supported stores: Outfitters, Breakout, Sana Safinaz, Saya`,
      );
    }

    return strategy;
  }

  static async fetchProduct(url: string): Promise<FetchedProductData> {
    const strategy = this.getStrategy(url);
    return await strategy.fetch(url);
  }

  static registerStrategy(strategy: IProductFetchStrategy): void {
    this.strategies.push(strategy);
  }
}
