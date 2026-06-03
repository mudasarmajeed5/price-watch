**Overview**

- **Purpose**: Short reference describing where and how four design patterns are used in this codebase: Repository, Singleton, Strategy, and Factory.

**Repository**

- **What**: Encapsulates data access logic behind a consistent API.
- **Why used**: Centralizes MongoDB access and reduces duplicated database code across services.
- **Where implemented**: Base generic repository and concrete repositories.
  - **Base**: [lib/repositories/base.repository.ts](lib/repositories/base.repository.ts#L1-L200)
  - **Example concrete repo**: [lib/repositories/product.repository.ts](lib/repositories/product.repository.ts#L1-L200)

**Singleton (Database connection)**

- **What**: Ensures a single shared MongoDB client/connection across the app.
- **Why used**: Avoids creating multiple clients (resource-heavy) and supports HMR-safe reuse in development.
- **Where implemented**: `DatabaseConnection` singleton and exported helpers.
  - [lib/db.ts](lib/db.ts#L1-L200)

**Strategy**

- **What**: Encapsulates per-store product-fetch logic behind a common interface so different store implementations are interchangeable.
- **Why used**: Each e‑commerce site exposes product data differently; the Strategy pattern lets the app add site-specific parsing without changing callers.
- **Where implemented**:
  - Strategy interface and helpers: [lib/fetching/strategies/base.strategy.ts](lib/fetching/strategies/base.strategy.ts#L1-L200)
  - Concrete strategies: [lib/fetching/strategies/outfitters.strategy.ts](lib/fetching/strategies/outfitters.strategy.ts#L1-L200), [lib/fetching/strategies/breakout.strategy.ts](lib/fetching/strategies/breakout.strategy.ts#L1-L200), [lib/fetching/strategies/sana-safinaz.strategy.ts](lib/fetching/strategies/sana-safinaz.strategy.ts#L1-L200), [lib/fetching/strategies/saya.strategy.ts](lib/fetching/strategies/saya.strategy.ts#L1-L200)

**Factory**

- **What**: Provides a single place to obtain instances of related objects (strategies, notifications), hiding construction details.
- **Why used**: Keeps creation logic centralized and makes it easy to register or swap implementations.
- **Where implemented**:
  - Strategy factory that selects the correct `IProductFetchStrategy`: [lib/fetching/strategy-factory.ts](lib/fetching/strategy-factory.ts#L1-L200)
  - Notification factory that returns notification services: [lib/notifications/notification.factory.ts](lib/notifications/notification.factory.ts#L1-L200)

**How they work together (example flow)**

- A service like `PriceService` calls `StrategyFactory.fetchProduct(url)` to obtain product data (see `lib/services/price.service.ts`).
- `StrategyFactory` selects the appropriate `Strategy` based on the URL and calls its `fetch()` method.
- `PriceService` persists results using `ProductRepository` (which extends `BaseRepository`) and uses the singleton DB connection via `getDb()`.

**Quick file references**

- `PriceService`: [lib/services/price.service.ts](lib/services/price.service.ts#L1-L200)
- `StrategyFactory`: [lib/fetching/strategy-factory.ts](lib/fetching/strategy-factory.ts#L1-L200)
- `Database singleton`: [lib/db.ts](lib/db.ts#L1-L200)
- `Base repository`: [lib/repositories/base.repository.ts](lib/repositories/base.repository.ts#L1-L200)

If you want, I can also:

- Add inline code examples showing how to register a new strategy and test it.
- Add a short unit-test scaffold for `StrategyFactory`.
