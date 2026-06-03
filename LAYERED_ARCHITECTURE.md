# Layered Architecture in Price Watch

## Overview

Price Watch implements a classic **4-layer architecture** pattern:

```
┌─────────────────────────────────────────────────┐
│  Layer 1: Presentation Layer                    │
│  (Pages & API Routes)                           │
│  app/api/*, app/(authenticated)/*               │
└──────────────────┬──────────────────────────────┘
                   │ Calls
                   ▼
┌─────────────────────────────────────────────────┐
│  Layer 2: Business Logic Layer                  │
│  (Services)                                     │
│  lib/services/*.ts                              │
└──────────────────┬──────────────────────────────┘
                   │ Uses
                   ▼
┌─────────────────────────────────────────────────┐
│  Layer 3: Data Access Layer                     │
│  (Repositories)                                 │
│  lib/repositories/*.ts                          │
└──────────────────┬──────────────────────────────┘
                   │ Uses
                   ▼
┌─────────────────────────────────────────────────┐
│  Layer 4: Database Connection Layer             │
│  (Singleton DB Connection)                      │
│  lib/db.ts                                      │
└─────────────────────────────────────────────────┘
```

---

## Layer 1: Presentation Layer (API Routes & Pages)

**Location**: `app/` folder

**Purpose**: Entry point for HTTP requests and UI rendering. Handles:

- Request validation
- Authentication/Authorization
- Response formatting
- Error handling

### Example: Watchlist API Route

**File**: [app/api/watchlist/route.ts](app/api/watchlist/route.ts#L1-L50)

```typescript
// Layer 1 receives request
export async function POST(request: NextRequest) {
  // Validate user is authenticated
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Extract request payload
  const { url, targetPrice } = await request.json();

  // Get user ID
  const userId = await getUserIdFromEmail(session.user.email);

  // Delegate to Layer 2 (Service)
  const result = await watchlistService.addToWatchlist(
    userId,
    url,
    parseFloat(targetPrice),
  );

  // Format and return response
  return NextResponse.json({
    success: true,
    data: result,
  });
}
```

**Key characteristics**:

- ✅ Thin — only handles HTTP concerns
- ✅ Calls service layer for business logic
- ✅ Does not directly access database

---

## Layer 2: Business Logic Layer (Services)

**Location**: `lib/services/` folder

**Purpose**: Orchestrates business operations across multiple repositories. Contains:

- Complex business rules
- Multi-step workflows
- Data validation and transformation
- Cross-entity coordination

### Example: WatchlistService

**File**: [lib/services/watchlist.service.ts](lib/services/watchlist.service.ts#L1-L40)

```typescript
export class WatchlistService {
  // Layer 2 composes multiple repositories
  private productRepo: ProductRepository;
  private alertRepo: PriceAlertRepository;
  private queueRepo: NotificationQueueRepository;
  private priceService: PriceService;

  constructor() {
    // Instantiate all dependencies
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
    // Step 1: Fetch and save product (using PriceService & ProductRepository)
    const priceResult = await this.priceService.fetchAndUpdatePrice(url);
    const { productId } = priceResult;

    // Step 2: Create price alert (using AlertRepository)
    const alertId = await this.alertRepo.createAlert({
      userId,
      productId,
      targetPrice,
      currency: "PKR",
      isActive: true,
    });

    // Step 3: If price already below target, queue notifications
    const product = await this.productRepo.findById(productId);
    if (product && priceResult.newPrice <= targetPrice) {
      const payload: NotificationPayload = {
        title: "Price Drop Alert! 🎉",
        body: `${product.title} is now PKR ${priceResult.newPrice}...`,
        url: `/product/${productId}`,
        icon: product.image,
      };

      // Queue both email and push notifications (using QueueRepository)
      await Promise.all([
        this.queueRepo.addToQueue(userId, productId, "email", payload),
        this.queueRepo.addToQueue(userId, productId, "push", payload),
      ]);
    }

    return { productId, alertId };
  }

  async getUserWatchlist(userId: ObjectId): Promise<WatchlistItem[]> {
    // Multi-step query: fetch alerts, then join with product details
    const alerts = await this.alertRepo.getUserAlerts(userId);

    const watchlistPromises = alerts.map(async (alert) => {
      const product = await this.productRepo.findById(alert.productId);

      // Transform and enrich data
      const dropAmount = Math.max(0, alert.targetPrice - product.latestPrice);
      const dropPercent =
        alert.targetPrice > 0
          ? Math.round((dropAmount / alert.targetPrice) * 100)
          : 0;

      return {
        ...product,
        alertId: alert._id,
        targetPrice: alert.targetPrice,
        dropAmount,
        dropPercent,
      };
    });

    return await Promise.all(watchlistPromises);
  }
}
```

**Key characteristics**:

- ✅ Orchestrates repositories and other services
- ✅ Implements multi-step workflows
- ✅ Transforms and validates data
- ✅ Never directly queries database (uses repositories)

### Other Services

- **PriceService** [lib/services/price.service.ts](lib/services/price.service.ts#L1-L50): Fetches prices, records history, detects price drops
- **NotificationService** [lib/services/notification.service.ts](lib/services/notification.service.ts#L1-L50): Sends notifications via email/push/toast

---

## Layer 3: Data Access Layer (Repositories)

**Location**: `lib/repositories/` folder

**Purpose**: Encapsulates all database access logic. Each repository:

- Handles CRUD operations for one entity
- Provides domain-specific query methods
- Converts between database documents and domain objects
- Inherits common operations from `BaseRepository<T>`

### Example: ProductRepository

**File**: [lib/repositories/product.repository.ts](lib/repositories/product.repository.ts#L1-L50)

```typescript
export class ProductRepository extends BaseRepository<Product> {
  constructor() {
    // Specify which MongoDB collection this repository manages
    super("products");
  }

  // Basic CRUD inherited from BaseRepository
  // - findById(id)
  // - findOne(filter)
  // - find(filter)
  // - create(document)
  // - updateOne(filter, update)
  // - deleteOne(filter)

  // Domain-specific query methods
  async findByHandle(store: string, handle: string): Promise<Product | null> {
    return await this.findOne({ store, handle } as Filter<Product>);
  }

  async findByUrl(canonicalUrl: string): Promise<Product | null> {
    return await this.findOne({ canonicalUrl } as Filter<Product>);
  }

  // Upsert pattern: update if exists, create if not
  async upsertProduct(product: Omit<Product, "_id">): Promise<ObjectId> {
    const existing = await this.findByHandle(product.store, product.handle);

    if (existing) {
      // Update existing
      await this.updateOne({ _id: existing._id! } as Filter<Product>, {
        ...product,
        updatedAt: new Date(),
      });
      return existing._id!;
    } else {
      // Create new
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
```

### BaseRepository (Generic)

**File**: [lib/repositories/base.repository.ts](lib/repositories/base.repository.ts#L1-L60)

```typescript
export abstract class BaseRepository<T extends Document> {
  protected collection: Collection<T>;

  constructor(collectionName: string) {
    // Get singleton DB connection (Layer 4)
    const db: Db = getDb();
    // Get MongoDB collection reference
    this.collection = db.collection<T>(collectionName);
  }

  // Generic CRUD operations available to all repositories
  async findById(id: ObjectId): Promise<T | null> {
    return await this.collection.findOne({ _id: id } as Filter<T>);
  }

  async findOne(filter: Filter<T>): Promise<T | null> {
    return await this.collection.findOne(filter);
  }

  async find(filter: Filter<T>, limit = 0): Promise<T[]> {
    return await this.collection.find(filter).limit(limit).toArray();
  }

  async create(document: Omit<T, "_id">): Promise<InsertOneResult<T>> {
    return await this.collection.insertOne(document as any);
  }

  async updateOne(filter: Filter<T>, update: any): Promise<UpdateResult<T>> {
    return await this.collection.updateOne(filter, { $set: update });
  }

  async deleteOne(filter: Filter<T>): Promise<{ deletedCount: number }> {
    const result = await this.collection.deleteOne(filter);
    return { deletedCount: result.deletedCount };
  }
}
```

### Available Repositories

- **ProductRepository** — Product documents
- **PriceAlertRepository** — User price alerts
- **PriceSnapshotRepository** — Historical price data
- **NotificationQueueRepository** — Pending notifications
- **UserRepository** — User accounts
- **PushSubscriptionRepository** — Device subscriptions

**Key characteristics**:

- ✅ Single responsibility: one entity type per repository
- ✅ Inherits common CRUD from `BaseRepository<T>`
- ✅ Adds domain-specific queries (e.g., `upsertProduct`, `findByHandle`)
- ✅ All database logic isolated here
- ✅ Cannot be called from Presentation Layer (only from Services)

---

## Layer 4: Database Connection Layer

**Location**: `lib/db.ts`

**Purpose**: Provides singleton MongoDB connection shared across the entire app.

**File**: [lib/db.ts](lib/db.ts#L1-L100)

```typescript
// Singleton Database Connection Pattern
class DatabaseConnection {
  private static instance: DatabaseConnection;
  private client: MongoClient | null = null;
  private db: Db | null = null;

  private constructor() {
    // Private constructor prevents direct instantiation
  }

  // Ensures only one instance exists
  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public getClient(): MongoClient {
    if (!this.client) {
      // Create client only once
      this.client = new MongoClient(process.env.MONGODB_URI!, options);
    }
    return this.client;
  }

  public getDb(): Db {
    if (!this.db) {
      // Get database from client
      this.db = this.getClient().db("bachat");
    }
    return this.db;
  }
}

// Exported singleton
const dbConnection = DatabaseConnection.getInstance();
export const client = dbConnection.getClient();
export const getDb = () => dbConnection.getDb();
```

**Key characteristics**:

- ✅ Singleton ensures only one MongoDB connection
- ✅ Lazy initialization (connects on first use)
- ✅ HMR-safe in development (reuses client in memory)
- ✅ Called only by repositories

---

## Data Flow Example: Add to Watchlist

Here's how data flows through all 4 layers:

### 1️⃣ Presentation Layer (API Route)

```
POST /api/watchlist
├─ Validate authentication (NextAuth)
├─ Extract { url, targetPrice } from request
└─ Call → Layer 2
```

### 2️⃣ Business Logic Layer (WatchlistService)

```
addToWatchlist(userId, url, targetPrice)
├─ Call PriceService.fetchAndUpdatePrice(url)
│  └─ Uses StrategyFactory to select store parser
│  └─ Call → Layer 3
├─ Call ProductRepository.upsertProduct()
│  └─ Call → Layer 3
├─ Call PriceAlertRepository.createAlert()
│  └─ Call → Layer 3
├─ If price ≤ targetPrice, Queue notifications
│  └─ Call NotificationQueueRepository.addToQueue()
│  └─ Call → Layer 3
└─ Return { productId, alertId } → Layer 1
```

### 3️⃣ Data Access Layer (Repositories)

```
ProductRepository.upsertProduct(product)
├─ Query MongoDB: findByHandle(store, handle)
├─ If exists: updateOne() else: create()
├─ Get singleton connection → Layer 4
└─ Return insertedId to Layer 2
```

### 4️⃣ Database Connection Layer

```
getDb()
├─ Get singleton DatabaseConnection instance
├─ Return MongoDB Db reference
└─ Repositories use this to access collections
```

### Return trip (Response)

```
Layer 3 → Layer 2: { productId, alertId }
Layer 2 → Layer 1: { productId, alertId }
Layer 1 → Client: { success: true, data: { productId, alertId } }
```

---

## Benefits of Layered Architecture

| Benefit                    | How Price Watch Uses It                                                  |
| -------------------------- | ------------------------------------------------------------------------ |
| **Separation of Concerns** | Each layer has single responsibility (HTTP, business logic, data access) |
| **Testability**            | Services can be tested with mock repositories; repositories with mock DB |
| **Reusability**            | Services can be reused by multiple API routes or cron jobs               |
| **Maintainability**        | Changes to database schema only affect repository layer                  |
| **Scalability**            | Easy to add new features without touching existing layers                |
| **Dependency Injection**   | Services compose repositories; repositories get DB connection            |

---

## When NOT to Use Direct DB Calls

❌ **DON'T do this** (Anti-pattern):

```typescript
// API route calling MongoDB directly (BAD!)
export async function GET(request: NextRequest) {
  const db = getDb();
  const products = await db.collection("products").find({}).toArray();
  return NextResponse.json(products);
}
```

✅ **DO this instead**:

```typescript
// API route using service layer (GOOD!)
export async function GET(request: NextRequest) {
  const productRepo = new ProductRepository();
  const products = await productRepo.find({});
  return NextResponse.json(products);
}
```

---

## Summary

Price Watch's layered architecture:

1. **Presentation Layer** — HTTP request/response handling
2. **Business Logic Layer** — Orchestrates workflows and coordinates repositories
3. **Data Access Layer** — Encapsulates MongoDB operations
4. **Database Connection Layer** — Provides singleton connection

This structure keeps the codebase organized, testable, and maintainable as it grows.
