# Price Watch - Complete Architecture Guide

## 🎯 Project Overview

Price Watch is a Next.js application that tracks prices across multiple Shopify-based Pakistani fashion retailers. When prices drop to a user's target price, they receive notifications via email and web push.

### Supported Stores

- 🛍️ Outfitters (outfitters.com.pk)
- 🛍️ Breakout (breakout.com.pk)
- 🛍️ Sana Safinaz (sanasafinaz.com)
- 🛍️ Saya (saya.pk)

---

## 📦 Architecture Overview

### Design Patterns Implemented

#### 1. **Singleton Pattern** - Database Connection

- Location: `lib/db.ts`
- Single MongoDB connection across entire application
- Handles HMR in development mode
- Thread-safe instance creation

#### 2. **Strategy Pattern** - Product Fetching

- Location: `lib/fetching/strategies/`
- Each store has its own strategy class
- Base strategy defines interface, specific implementations for each store
- `StrategyFactory` manages strategy selection and execution
- Supports easy addition of new stores

#### 3. **Factory Pattern** - Notifications

- Location: `lib/notifications/`
- `NotificationFactory` creates appropriate notification service
- Supports multiple channels: Email, Push, Toast
- Extensible for new notification types

#### 4. **Repository Pattern** - Data Access

- Location: `lib/repositories/`
- Abstracts database operations
- Separates business logic from data persistence
- Base repository provides common CRUD operations
- Specific repositories add domain-specific queries

---

## 📊 Database Schema

### Collections

#### `products`

```json
{
  "_id": ObjectId,
  "store": "outfitters",
  "handle": "product-handle",
  "canonicalUrl": "https://outfitters.com.pk/products/...",
  "title": "Product Title",
  "image": "https://cdn.example.com/image.jpg",
  "currency": "PKR",
  "latestPrice": 5999,
  "lastCheckedAt": ISODate("2026-05-26T00:00:00Z"),
  "createdAt": ISODate("2026-05-20T10:00:00Z"),
  "updatedAt": ISODate("2026-05-26T00:00:00Z")
}
```

**Indexes:**

- Unique: `{ store, handle }`
- `{ canonicalUrl }`
- `{ lastCheckedAt: -1 }`

#### `price_alerts`

```json
{
  "_id": ObjectId,
  "userId": ObjectId,
  "productId": ObjectId,
  "targetPrice": 4500,
  "currency": "PKR",
  "isActive": true,
  "lastNotifiedAt": ISODate("2026-05-25T00:00:00Z"),
  "createdAt": ISODate("2026-05-20T10:00:00Z"),
  "updatedAt": ISODate("2026-05-26T00:00:00Z")
}
```

**Indexes:**

- Unique: `{ userId, productId }`
- `{ isActive, updatedAt: -1 }`

#### `price_snapshots`

```json
{
  "_id": ObjectId,
  "productId": ObjectId,
  "price": 5999,
  "currency": "PKR",
  "checkedAt": ISODate("2026-05-26T00:00:00Z")
}
```

**Indexes:**

- `{ productId, checkedAt: -1 }`

#### `notification_queue`

```json
{
  "_id": ObjectId,
  "userId": ObjectId,
  "productId": ObjectId,
  "channel": "email",
  "payload": {
    "title": "Price Drop Alert!",
    "body": "Product is now 4,500 PKR",
    "url": "/product/123"
  },
  "status": "sent",
  "error": null,
  "createdAt": ISODate("2026-05-26T00:00:00Z"),
  "sentAt": ISODate("2026-05-26T00:01:00Z")
}
```

**Indexes:**

- `{ status, createdAt: -1 }`
- `{ userId, createdAt: -1 }`

#### `push_subscriptions`

```json
{
  "_id": ObjectId,
  "userId": ObjectId,
  "endpoint": "https://fcm.googleapis.com/fcm/send/...",
  "keys": {
    "p256dh": "...",
    "auth": "..."
  },
  "createdAt": ISODate("2026-05-26T00:00:00Z"),
  "updatedAt": ISODate("2026-05-26T00:00:00Z")
}
```

**Indexes:**

- Unique: `{ userId, endpoint }`

---

## 🔗 API Routes

### Products

#### `POST /api/products/preview`

Fetch product preview data from a store URL.

**Request:**

```json
{
  "url": "https://outfitters.com.pk/products/mens-shirt"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "title": "Men's Shirt",
    "image": "https://...",
    "price": "3999",
    "currency": "PKR",
    "canonicalUrl": "https://outfitters.com.pk/products/mens-shirt",
    "handle": "mens-shirt",
    "store": "outfitters"
  }
}
```

#### `GET /api/products/[id]`

Get product details by ID.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "65abc123...",
    "title": "Men's Shirt",
    "image": "https://...",
    "latestPrice": 3999,
    "currency": "PKR",
    "canonicalUrl": "https://outfitters.com.pk/products/mens-shirt"
  }
}
```

### Watchlist

#### `POST /api/watchlist`

Add a product to user's watchlist.

**Request:**

```json
{
  "url": "https://outfitters.com.pk/products/mens-shirt",
  "targetPrice": 3000
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "productId": "65abc123...",
    "alertId": "65def456..."
  }
}
```

#### `GET /api/watchlist`

Get user's watchlist.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "alertId": "65def456...",
      "productId": "65abc123...",
      "title": "Men's Shirt",
      "image": "https://...",
      "latestPrice": 3999,
      "targetPrice": 3000,
      "canonicalUrl": "https://...",
      "createdAt": "2026-05-20T10:00:00Z"
    }
  ]
}
```

#### `DELETE /api/watchlist`

Remove product from watchlist.

**Request:**

```json
{
  "productId": "65abc123..."
}
```

### Push Notifications

#### `POST /api/push/subscribe`

Subscribe to push notifications.

**Request:**

```json
{
  "endpoint": "https://fcm.googleapis.com/fcm/send/...",
  "keys": {
    "p256dh": "...",
    "auth": "..."
  }
}
```

### Cron Jobs

#### `POST /api/cron/daily`

Daily price checking and notification trigger.

**Headers:**

```
Authorization: Bearer YOUR_CRON_SECRET
```

**Response:**

```json
{
  "success": true,
  "data": {
    "priceChanges": 5,
    "alerts": 10,
    "notificationsSent": 3,
    "timestamp": "2026-05-26T00:00:00Z"
  }
}
```

---

## 🛠️ Services

### PriceService

Handles product price fetching and updates.

```typescript
const priceService = new PriceService();

// Fetch price and update database
await priceService.fetchAndUpdatePrice(url);

// Check all products for price changes
const changes = await priceService.checkPriceDrops();

// Get price history
const history = await priceService.getPriceHistory(productId);
```

### NotificationService

Manages notification delivery across channels.

```typescript
const notificationService = new NotificationService();

// Send price drop notification
await notificationService.notifyPriceDrop(
  userId,
  productId,
  targetPrice,
  currentPrice,
  ["email", "push"],
);

// Process pending notifications
await notificationService.processPendingNotifications();
```

### WatchlistService

Manages user watchlists.

```typescript
const watchlistService = new WatchlistService();

// Add to watchlist
const result = await watchlistService.addToWatchlist(userId, url, targetPrice);

// Get user's watchlist
const items = await watchlistService.getUserWatchlist(userId);

// Remove from watchlist
await watchlistService.removeFromWatchlist(userId, productId);
```

---

## 🏗️ Repositories

All repositories extend `BaseRepository<T>` and provide:

- `findById(id)` - Find by ID
- `findOne(filter)` - Find single document
- `find(filter, limit)` - Find multiple documents
- `create(document)` - Insert document
- `updateOne(filter, update)` - Update single document
- `updateMany(filter, update)` - Update multiple documents
- `deleteOne(filter)` - Delete single document
- `deleteMany(filter)` - Delete multiple documents
- `count(filter)` - Count documents

### Specific Repositories

- **ProductRepository** - Product CRUD + custom queries
- **PriceAlertRepository** - Alert CRUD + user queries
- **PriceSnapshotRepository** - Historical price data
- **NotificationQueueRepository** - Notification logging
- **PushSubscriptionRepository** - Push subscription management

---

## 🔐 Environment Variables

```env
# Database
MONGODB_URI=mongodb+srv://...

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...

# Email
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=...
EMAIL_SERVER_PASSWORD=...
EMAIL_FROM=noreply@price-watch.app

# Web Push
VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
VAPID_EMAIL=admin@price-watch.app

# Cron
CRON_SECRET=...

# OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

---

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Generate VAPID Keys (for web push)

```bash
npx web-push generate-vapid-keys
```

### 3. Configure Environment

```bash
cp .env.example .env.local
# Edit .env.local with your values
```

### 4. Initialize Database

```bash
node -e "import('./lib/db.init.ts').then(m => m.initializeDatabase())"
```

### 5. Setup Cron Job

Use a service like Vercel Cron, AWS EventBridge, or external CRON service to call:

```
POST https://your-domain.com/api/cron/daily
Authorization: Bearer YOUR_CRON_SECRET
```

Daily at a specific time.

---

## 📋 File Structure

```
lib/
├── db.ts                          # Singleton database connection
├── db.init.ts                     # Database initialization
├── use-service-worker.ts          # Service Worker hook
├── repositories/
│   ├── base.repository.ts         # Base CRUD operations
│   ├── product.repository.ts      # Product-specific queries
│   ├── price-alert.repository.ts  # Alert management
│   ├── price-snapshot.repository.ts # Historical data
│   ├── notification-queue.repository.ts # Notification logging
│   └── push-subscription.repository.ts # Push subscriptions
├── services/
│   ├── price.service.ts           # Price checking logic
│   ├── notification.service.ts    # Notification delivery
│   └── watchlist.service.ts       # Watchlist management
├── fetching/
│   └── strategies/
│       ├── base.strategy.ts       # Strategy interface
│       ├── outfitters.strategy.ts # Outfitters implementation
│       ├── breakout.strategy.ts   # Breakout implementation
│       ├── sana-safinaz.strategy.ts # Sana Safinaz implementation
│       ├── saya.strategy.ts       # Saya implementation
│       └── strategy-factory.ts    # Strategy management
├── notifications/
│   ├── base.notification.ts       # Notification interface
│   ├── email.notification.ts      # Email implementation
│   ├── push.notification.ts       # Push implementation
│   ├── toast.notification.ts      # Toast implementation
│   └── notification.factory.ts    # Notification management
└── types/
    ├── product.ts                 # Product types
    ├── alert.ts                   # Alert types
    └── notification.ts            # Notification types

app/api/
├── products/
│   ├── preview/route.ts           # Product preview endpoint
│   └── [id]/route.ts              # Product detail endpoint
├── watchlist/route.ts             # Watchlist management
├── push/subscribe/route.ts        # Push subscription
└── cron/daily/route.ts            # Daily cron job

public/
└── service-worker.js              # PWA service worker
```

---

## 🧪 Testing

### Test Product Fetching

```bash
curl -X POST http://localhost:3000/api/products/preview \
  -H "Content-Type: application/json" \
  -d '{"url":"https://outfitters.com.pk/products/f1931-106"}'
```

### Test Cron Job

```bash
curl -X POST http://localhost:3000/api/cron/daily \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

---

## 🎯 Next Steps

1. **User Integration**: Update API routes to get user ID from NextAuth session
2. **Email Templates**: Create HTML email templates for different notification types
3. **Frontend Components**: Build UI components for watchlist management
4. **Admin Dashboard**: Create dashboard for monitoring prices and notifications
5. **Analytics**: Track price trends and user behavior
6. **Performance Optimization**: Add caching, pagination, rate limiting

---

## 🐛 Troubleshooting

### Service Worker Registration Fails

- Check `public/service-worker.js` permissions
- Ensure HTTPS in production
- Clear browser cache

### Push Notifications Not Working

- Verify VAPID keys are correct
- Check push subscription in database
- Ensure service worker is registered

### Price Fetching Fails

- Check URL is valid for supported stores
- Verify internet connectivity
- Check if store changed HTML structure

### Database Connection Issues

- Verify MONGODB_URI is correct
- Check MongoDB IP whitelist
- Ensure network connectivity

---

## 📚 References

- [Web Push Protocol (RFC 8291)](https://datatracker.ietf.org/doc/html/rfc8291)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Service Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

---

## 📝 License

MIT License
