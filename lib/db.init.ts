import { getDb } from "@/lib/db";

/**
 * Initialize database collections and indexes
 * Run this once during application setup
 */ 
export async function initializeDatabase() {
  try {
    const db = getDb();

    console.log("🔧 Initializing database collections and indexes...");

    // Products collection
    const productsCollection = db.collection("products");
    await productsCollection.createIndex(
      { store: 1, handle: 1 },
      { unique: true },
    );
    await productsCollection.createIndex({ canonicalUrl: 1 });
    await productsCollection.createIndex({ lastCheckedAt: -1 });
    console.log("✅ Products collection initialized");

    // Price snapshots collection
    const snapshotsCollection = db.collection("price_snapshots");
    await snapshotsCollection.createIndex({ productId: 1, checkedAt: -1 });
    await snapshotsCollection.createIndex({ checkedAt: -1 });
    console.log("✅ Price snapshots collection initialized");

    // Price alerts collection
    const alertsCollection = db.collection("price_alerts");
    await alertsCollection.createIndex(
      { userId: 1, productId: 1 },
      { unique: true },
    );
    await alertsCollection.createIndex({ isActive: 1, updatedAt: -1 });
    await alertsCollection.createIndex({ userId: 1, isActive: 1 });
    console.log("✅ Price alerts collection initialized");

    // Notification queue collection
    const notificationCollection = db.collection("notification_queue");
    await notificationCollection.createIndex({ status: 1, createdAt: -1 });
    await notificationCollection.createIndex({ userId: 1, createdAt: -1 });
    console.log("✅ Notification queue collection initialized");

    // Push subscriptions collection
    const pushCollection = db.collection("push_subscriptions");
    await pushCollection.createIndex(
      { userId: 1, endpoint: 1 },
      { unique: true },
    );
    await pushCollection.createIndex({ userId: 1 });
    console.log("✅ Push subscriptions collection initialized");

    console.log("✅ Database initialization complete!");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
}
