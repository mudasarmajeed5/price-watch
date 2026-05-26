# Design Patterns Implementation Plan

## Project Overview
Implement 3 design patterns in the Price Watch application:
1. **Singleton Pattern** - Database Connection Management
2. **Strategy Pattern** - Multi-Store Product Fetching
3. **Factory Pattern** - Notification Creation (Email, Push, Toast)

---

## Libraries & Dependencies

### Already Installed
- `mongodb` - Database client
- `next-auth` - Authentication (includes Nodemailer for email)
- `sonner` - Toast notifications
- `typescript` - Type safety

### New Libraries to Install
```bash
pnpm add web-push
```

**Why `web-push`?**
- Handles Web Push Protocol (RFC 8291)
- Required for sending push notifications to browsers
- Integrates with service worker subscriptions

### Optional (for production)
```bash
pnpm add dotenv-safe  # Stricter env validation
```

---

## Folder Structure

```
lib/
├── db.ts                          # (REFACTOR) Singleton Database
├── fetching/
│   ├── strategies/
│   │   ├── base.strategy.ts       # Abstract base
│   │   ├── outfitters.strategy.ts # Outfitters implementation
│   │   ├── breakout.strategy.ts   # Breakout implementation
│   │   ├── sana-safinaz.strategy.ts # Sana Safinaz implementation
│   │   └── saya.strategy.ts       # Saya implementation
│   └── strategy-factory.ts        # Strategy factory
├── notifications/
│   ├── types/
│   │   └── notification.ts        # Interfaces & types
│   ├── implementations/
│   │   ├── email.notification.ts  # Email implementation
│   │   ├── push.notification.ts   # Push implementation
│   │   └── toast.notification.ts  # Toast implementation
│   └── notification.factory.ts    # Factory pattern
├── types/
│   ├── product.ts                 # Product interface
│   ├── notification.ts            # Notification types
│   └── alert.ts                   # Price alert types
└── utils/
    └── store-validator.ts         # URL validation

app/
└── api/
    ├── products/
    │   └── preview/
    │       └── route.ts           # Uses Strategy pattern
    ├── watchlist/
    │   └── route.ts               # Uses Facade (orchestrates)
    ├── notifications/
    │   └── send/
    │       └── route.ts           # Uses Factory pattern
    └── cron/
        └── daily/
            └── route.ts           # Price checking cron
```

---

## Implementation Steps

### PHASE 1: Singleton Pattern (Database)

**File**: `lib/db.ts`

```typescript
import { MongoClient, ServerApiVersion } from "mongodb";

class DatabaseConnection {
  private static instance: MongoClient | null = null;

  private constructor() {}

  public static getInstance(): MongoClient {
    if (!DatabaseConnection.instance) {
      const uri = process.env.MONGODB_URI;
      if (!uri) {
        throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
      }

      const options = {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
      };

      DatabaseConnection.instance = new MongoClient(uri, options);
    }
    return DatabaseConnection.instance;
  }

  public static async connect(): Promise<void> {
    const client = DatabaseConnection.getInstance();
    try {
      await client.connect();
      console.log("✅ Connected to MongoDB");
    } catch (error) {
      console.error("❌ MongoDB connection failed:", error);
      throw error;
    }
  }

  public static async disconnect(): Promise<void> {
    if (DatabaseConnection.instance) {
      await DatabaseConnection.instance.close();
      DatabaseConnection.instance = null;
      console.log("✅ Disconnected from MongoDB");
    }
  }
}

// Export for use
export const client = DatabaseConnection.getInstance();
export default DatabaseConnection;
```

**Benefits**:
- ✅ Single connection instance across entire app
- ✅ Prevents connection exhaustion
- ✅ Easy to mock for testing
- ✅ Centralized connection management

---

### PHASE 2: Strategy Pattern (4 Stores - Separate Strategies)

**File 1**: `lib/fetching/strategies/base.strategy.ts`

```typescript
export interface IProductFetchStrategy {
  canHandle(url: string): boolean;
  fetch(url: string): Promise<{
    title: string;
    image: string;
    price: string;
    currency: string;
    canonicalUrl: string;
    handle: string;
    store: string;
  }>;
}

export abstract class BaseStrategy implements IProductFetchStrategy {
  protected abstract storeName: string;
  protected abstract storeDomain: string;

  canHandle(url: string): boolean {
    return url.includes(this.storeDomain);
  }

  abstract fetch(url: string): Promise<any>;

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
      throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  }

  protected getJsonUrl(url: string): string {
    const clean = url.split("?")[0].replace(/\/$/, "");
    return clean.endsWith(".json") ? clean : `${clean}.json`;
  }
}
```

**File 2**: `lib/fetching/strategies/outfitters.strategy.ts`

```typescript
import { BaseStrategy } from "./base.strategy";

export class OutfittersStrategy extends BaseStrategy {
  protected storeName = "outfitters";
  protected storeDomain = "outfitters.com.pk";

  async fetch(url: string) {
    this.validateUrl(url);

    try {
      const data = await this.fetchShopifyJson(url);
      return this.normalize(data, url);
    } catch (error) {
      throw new Error(
        `Failed to fetch product from Outfitters: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  private normalize(data: any, url: string) {
    const product = data.product;
    if (!product) {
      throw new Error("Invalid Shopify response: product not found");
    }

    return {
      title: product.title || "Unknown",
      image: product.images?.[0]?.src || "",
      price: product.variants?.[0]?.price || "0",
      currency: "PKR",
      canonicalUrl: url.split("?")[0],
      handle: product.handle,
      store: this.storeName,
    };
  }
}
```

**File 3**: `lib/fetching/strategies/breakout.strategy.ts`

```typescript
import { BaseStrategy } from "./base.strategy";

export class BreakoutStrategy extends BaseStrategy {
  protected storeName = "breakout";
  protected storeDomain = "breakout.com.pk";

  async fetch(url: string) {
    this.validateUrl(url);

    try {
      const data = await this.fetchShopifyJson(url);
      return this.normalize(data, url);
    } catch (error) {
      throw new Error(
        `Failed to fetch product from Breakout: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  private normalize(data: any, url: string) {
    const product = data.product;
    if (!product) {
      throw new Error("Invalid Shopify response: product not found");
    }

    return {
      title: product.title || "Unknown",
      image: product.images?.[0]?.src || "",
      price: product.variants?.[0]?.price || "0",
      currency: "PKR",
      canonicalUrl: url.split("?")[0],
      handle: product.handle,
      store: this.storeName,
    };
  }
}
```

**File 4**: `lib/fetching/strategies/sana-safinaz.strategy.ts`

```typescript
import { BaseStrategy } from "./base.strategy";

export class SanaSafinazStrategy extends BaseStrategy {
  protected storeName = "sana_safinaz";
  protected storeDomain = "sanasafinaz.com";

  async fetch(url: string) {
    this.validateUrl(url);

    try {
      const data = await this.fetchShopifyJson(url);
      return this.normalize(data, url);
    } catch (error) {
      throw new Error(
        `Failed to fetch product from Sana Safinaz: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  private normalize(data: any, url: string) {
    const product = data.product;
    if (!product) {
      throw new Error("Invalid Shopify response: product not found");
    }

    return {
      title: product.title || "Unknown",
      image: product.images?.[0]?.src || "",
      price: product.variants?.[0]?.price || "0",
      currency: "PKR",
      canonicalUrl: url.split("?")[0],
      handle: product.handle,
      store: this.storeName,
    };
  }
}
```

**File 5**: `lib/fetching/strategies/saya.strategy.ts`

```typescript
import { BaseStrategy } from "./base.strategy";

export class SayaStrategy extends BaseStrategy {
  protected storeName = "saya";
  protected storeDomain = "saya.pk";

  async fetch(url: string) {
    this.validateUrl(url);

    try {
      const data = await this.fetchShopifyJson(url);
      return this.normalize(data, url);
    } catch (error) {
      throw new Error(
        `Failed to fetch product from Saya: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  private normalize(data: any, url: string) {
    const product = data.product;
    if (!product) {
      throw new Error("Invalid Shopify response: product not found");
    }

    return {
      title: product.title || "Unknown",
      image: product.images?.[0]?.src || "",
      price: product.variants?.[0]?.price || "0",
      currency: "PKR",
      canonicalUrl: url.split("?")[0],
      handle: product.handle,
      store: this.storeName,
    };
  }
}
```

**File 6**: `lib/fetching/strategy-factory.ts`

```typescript
import { IProductFetchStrategy } from "./strategies/base.strategy";
import { OutfittersStrategy } from "./strategies/outfitters.strategy";
import { BreakoutStrategy } from "./strategies/breakout.strategy";
import { SanaSafinazStrategy } from "./strategies/sana-safinaz.strategy";
import { SayaStrategy } from "./strategies/saya.strategy";

export class FetchStrategyFactory {
  private static strategies: IProductFetchStrategy[] = [
    new OutfittersStrategy(),
    new BreakoutStrategy(),
    new SanaSafinazStrategy(),
    new SayaStrategy(),
  ];

  /**
   * Get the appropriate strategy based on URL
   * Extracts domain and matches with strategy
   */
  static getStrategy(url: string): IProductFetchStrategy {
    const strategy = this.strategies.find((s) => s.canHandle(url));
    
    if (!strategy) {
      const supportedStores = [
        "outfitters.com.pk",
        "breakout.com.pk",
        "sanasafinaz.com",
        "saya.pk",
      ].join(", ");
      throw new Error(
        `No strategy found for URL: ${url}\nSupported stores: ${supportedStores}`
      );
    }
    
    return strategy;
  }

  /**
   * Get store name from URL
   * Extracts domain from URL (e.g., "outfitters.com.pk" → "outfitters")
   */
  static getStoreName(url: string): string {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;

    if (domain.includes("outfitters")) return "outfitters";
    if (domain.includes("breakout")) return "breakout";
    if (domain.includes("sanasafinaz")) return "sana_safinaz";
    if (domain.includes("saya")) return "saya";

    throw new Error(`Unknown store domain: ${domain}`);
  }

  // For testing: allow strategy injection
  static registerStrategy(strategy: IProductFetchStrategy): void {
    this.strategies.unshift(strategy);
  }

  static clearStrategies(): void {
    this.strategies = [];
  }
}
```

**Benefits**:
- ✅ Each store is a separate, independent strategy
- ✅ Easy to add store-specific logic later if needed
- ✅ Factory extracts domain from URL automatically (e.g., "outfitters.com.pk" → OutfittersStrategy)
- ✅ Removes all `if (store !== "Outfitters")` checks
- ✅ Testable: can mock individual store strategies
- ✅ Follows Open/Closed Principle: open for extension, closed for modification

---

### PHASE 3: Factory Pattern (Notifications)

**File 1**: `lib/notifications/types/notification.ts`

```typescript
export interface INotification {
  send(): Promise<void>;
  getPayload(): Record<string, any>;
  getStatus(): "pending" | "sent" | "failed";
}

export interface NotificationPayload {
  userId: string;
  productId: string;
  title: string;
  body: string;
  url?: string;
  error?: string;
}

export type NotificationChannel = "email" | "push" | "toast";
```

**File 2**: `lib/notifications/implementations/email.notification.ts`

```typescript
import { INotification, NotificationPayload } from "../types/notification";

export class EmailNotification implements INotification {
  private status: "pending" | "sent" | "failed" = "pending";
  private payload: NotificationPayload;

  constructor(payload: NotificationPayload) {
    this.payload = payload;
  }

  async send(): Promise<void> {
    try {
      // Import from auth.ts nodemailer transport
      const transporter = this.getEmailTransporter();

      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: this.payload.userId, // Will be user email in real impl
        subject: `🎉 ${this.payload.title}`,
        html: `
          <h2>${this.payload.title}</h2>
          <p>${this.payload.body}</p>
          ${this.payload.url ? `<a href="${this.payload.url}">View Product</a>` : ""}
        `,
      };

      await transporter.sendMail(mailOptions);
      this.status = "sent";
      console.log(`✅ Email sent to ${this.payload.userId}`);
    } catch (error) {
      this.status = "failed";
      this.payload.error = error instanceof Error ? error.message : "Unknown error";
      console.error(`❌ Email failed: ${this.payload.error}`);
      throw error;
    }
  }

  getPayload(): Record<string, any> {
    return this.payload;
  }

  getStatus(): "pending" | "sent" | "failed" {
    return this.status;
  }

  private getEmailTransporter() {
    // Implementation: use nodemailer from auth.ts
    // For now, return mock
    return {
      sendMail: async (options: any) => {
        console.log("Sending email:", options);
      },
    };
  }
}
```

**File 3**: `lib/notifications/implementations/push.notification.ts`

```typescript
import webpush from "web-push";
import { INotification, NotificationPayload } from "../types/notification";

export class PushNotification implements INotification {
  private status: "pending" | "sent" | "failed" = "pending";
  private payload: NotificationPayload;

  constructor(payload: NotificationPayload) {
    this.payload = payload;
    this.configurePushService();
  }

  async send(): Promise<void> {
    try {
      // In real impl: fetch user's push subscriptions from DB
      // const subscriptions = await db.collection('push_subscriptions')
      //   .find({ userId: this.payload.userId }).toArray();

      // For now, mock
      const subscriptions: any[] = [];

      const promises = subscriptions.map((sub) =>
        webpush.sendNotification(sub, JSON.stringify(this.getPayload()))
      );

      await Promise.all(promises);
      this.status = "sent";
      console.log(`✅ Push notification sent to ${subscriptions.length} devices`);
    } catch (error) {
      this.status = "failed";
      this.payload.error = error instanceof Error ? error.message : "Unknown error";
      console.error(`❌ Push failed: ${this.payload.error}`);
      throw error;
    }
  }

  getPayload(): Record<string, any> {
    return {
      title: this.payload.title,
      body: this.payload.body,
      icon: "/app_logo.svg",
      badge: "/app_logo.svg",
      tag: "price-alert",
      data: {
        url: this.payload.url || "/",
        productId: this.payload.productId,
      },
    };
  }

  getStatus(): "pending" | "sent" | "failed" {
    return this.status;
  }

  private configurePushService() {
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

    if (!vapidPublicKey || !vapidPrivateKey) {
      console.warn("⚠️  VAPID keys not configured. Push notifications disabled.");
      return;
    }

    webpush.setVapidDetails(
      process.env.EMAIL_FROM || "mailto:support@bachat.app",
      vapidPublicKey,
      vapidPrivateKey
    );
  }
}
```

**File 4**: `lib/notifications/implementations/toast.notification.ts`

```typescript
import { INotification, NotificationPayload } from "../types/notification";

export class ToastNotification implements INotification {
  private status: "pending" | "sent" | "failed" = "pending";
  private payload: NotificationPayload;

  constructor(payload: NotificationPayload) {
    this.payload = payload;
  }

  async send(): Promise<void> {
    try {
      // Toast is client-side only
      // This is for server-side logging/tracking
      console.log(`🍞 Toast: ${this.payload.title} - ${this.payload.body}`);
      this.status = "sent";
    } catch (error) {
      this.status = "failed";
      this.payload.error = error instanceof Error ? error.message : "Unknown error";
      throw error;
    }
  }

  getPayload(): Record<string, any> {
    return {
      type: "success", // or "error", "warning", "info"
      title: this.payload.title,
      description: this.payload.body,
      duration: 5000,
    };
  }

  getStatus(): "pending" | "sent" | "failed" {
    return this.status;
  }
}
```

**File 5**: `lib/notifications/notification.factory.ts`

```typescript
import { INotification, NotificationChannel, NotificationPayload } from "./types/notification";
import { EmailNotification } from "./implementations/email.notification";
import { PushNotification } from "./implementations/push.notification";
import { ToastNotification } from "./implementations/toast.notification";

export class NotificationFactory {
  static create(channel: NotificationChannel, payload: NotificationPayload): INotification {
    switch (channel) {
      case "email":
        return new EmailNotification(payload);
      case "push":
        return new PushNotification(payload);
      case "toast":
        return new ToastNotification(payload);
      default:
        throw new Error(`Unknown notification channel: ${channel}`);
    }
  }

  static async sendNotification(
    channel: NotificationChannel,
    payload: NotificationPayload
  ): Promise<void> {
    const notification = this.create(channel, payload);
    await notification.send();
  }

  static createMultiple(
    channels: NotificationChannel[],
    payload: NotificationPayload
  ): INotification[] {
    return channels.map((channel) => this.create(channel, payload));
  }

  static async sendMultiple(
    channels: NotificationChannel[],
    payload: NotificationPayload
  ): Promise<void> {
    const notifications = this.createMultiple(channels, payload);
    await Promise.allSettled(notifications.map((n) => n.send()));
  }
}
```

**Benefits**:
- ✅ Single place to add new notification types
- ✅ Loose coupling between channels
- ✅ Easy to test each channel independently
- ✅ Flexible: can send to multiple channels at once

---

## Integration Points

### In `add-product/page.tsx` (Replace hardcoded fetch)

```typescript
import { FetchStrategyFactory } from "@/lib/fetching/strategy-factory";

// OLD: if (store !== "Outfitters") { ... } + hardcoded fetchOutfittersProduct()
// NEW - Factory automatically extracts store from URL:

const strategy = FetchStrategyFactory.getStrategy(url);
const preview = await strategy.fetch(url);

// Example:
// URL: "https://outfitters.com.pk/products/..." → OutfittersStrategy
// URL: "https://breakout.com.pk/products/..." → BreakoutStrategy
// URL: "https://sanasafinaz.com/products/..." → SanaSafinazStrategy
// URL: "https://saya.pk/products/..." → SayaStrategy
```

### In API routes (Use Singleton DB)

```typescript
import DatabaseConnection from "@/lib/db";

const db = DatabaseConnection.getInstance().db("price_watch");
const products = await db.collection("products").find({}).toArray();
```

### In notification flow

```typescript
import { NotificationFactory } from "@/lib/notifications/notification.factory";

// Send email notification
await NotificationFactory.sendNotification("email", {
  userId: user.id,
  productId: product.id,
  title: "Price Drop Alert",
  body: `Product is now PKR ${newPrice}`,
  url: `/product/${product.id}`,
});

// Send multiple channels
await NotificationFactory.sendMultiple(["email", "push"], payload);
```

---

## Environment Variables Required

Add to `.env.local`:

```env
# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/price_watch

# Email (Nodemailer)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@bachat.app

# Web Push
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-public-key
VAPID_PRIVATE_KEY=your-private-key

# Cron Protection
CRON_SECRET=your-secret-key
```

---

## Testing Strategy

### Unit Tests

```typescript
// test/notifications/notification.factory.test.ts
describe("NotificationFactory", () => {
  it("should create EmailNotification for email channel", () => {
    const notification = NotificationFactory.create("email", mockPayload);
    expect(notification).toBeInstanceOf(EmailNotification);
  });

  it("should create PushNotification for push channel", () => {
    const notification = NotificationFactory.create("push", mockPayload);
    expect(notification).toBeInstanceOf(PushNotification);
  });

  it("should throw for unknown channel", () => {
    expect(() =>
      NotificationFactory.create("sms" as any, mockPayload)
    ).toThrow();
  });
});
```

### Integration Tests

```typescript
// test/fetching/strategy-factory.test.ts
describe("FetchStrategyFactory", () => {
  it("should return OutfittersStrategy for Outfitters URL", () => {
    const strategy = FetchStrategyFactory.getStrategy(
      "https://outfitters.com.pk/products/..."
    );
    expect(strategy).toBeInstanceOf(OutfittersStrategy);
  });

  it("should return BreakoutStrategy for Breakout URL", () => {
    const strategy = FetchStrategyFactory.getStrategy(
      "https://www.breakout.com.pk/products/..."
    );
    expect(strategy).toBeInstanceOf(BreakoutStrategy);
  });

  it("should return SanaSafinazStrategy for Sana Safinaz URL", () => {
    const strategy = FetchStrategyFactory.getStrategy(
      "https://sanasafinaz.com/products/..."
    );
    expect(strategy).toBeInstanceOf(SanaSafinazStrategy);
  });

  it("should return SayaStrategy for Saya URL", () => {
    const strategy = FetchStrategyFactory.getStrategy(
      "https://saya.pk/products/..."
    );
    expect(strategy).toBeInstanceOf(SayaStrategy);
  });

  it("should extract store name correctly", () => {
    expect(FetchStrategyFactory.getStoreName("https://outfitters.com.pk/...")).toBe("outfitters");
    expect(FetchStrategyFactory.getStoreName("https://breakout.com.pk/...")).toBe("breakout");
    expect(FetchStrategyFactory.getStoreName("https://sanasafinaz.com/...")).toBe("sana_safinaz");
    expect(FetchStrategyFactory.getStoreName("https://saya.pk/...")).toBe("saya");
  });

  it("should throw for unsupported store", () => {
    expect(() =>
      FetchStrategyFactory.getStrategy("https://unsupported.com/product")
    ).toThrow();
  });
});
```

---

## Timeline

| Phase | Tasks | Est. Time |
|-------|-------|-----------|
| **Phase 1** | Singleton DB refactor | 1-2 hours |
| **Phase 2** | Strategy implementation | 2-3 hours |
| **Phase 3** | Notification Factory | 2-3 hours |
| **Integration** | Wire into API routes | 2-3 hours |
| **Testing** | Unit + Integration tests | 2-3 hours |
| **Total** | | ~11-14 hours |

---

## Success Criteria

- ✅ All 3 patterns implemented correctly
- ✅ `add-product` uses Strategy pattern (no hardcoded store logic)
- ✅ Notifications use Factory pattern
- ✅ Database uses Singleton pattern
- ✅ Unit tests pass for each pattern
- ✅ No breaking changes to existing functionality
- ✅ Code follows SOLID principles
