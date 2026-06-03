// Singleton Database Connection Pattern
import { MongoClient, ServerApiVersion, Db } from "mongodb";

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private client: MongoClient | null = null;
  private db: Db | null = null;

  private constructor() {
    if (!process.env.MONGODB_URI) {
      throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
    }
  }
  
  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public getClient(): MongoClient {
    if (!this.client) {
      const uri = process.env.MONGODB_URI!;
      const options = {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
      };

      // Handle HMR in development
      if (process.env.NODE_ENV === "development") {
        const globalWithMongo = global as typeof globalThis & {
          _mongoClient?: MongoClient;
        };

        if (!globalWithMongo._mongoClient) {
          globalWithMongo._mongoClient = new MongoClient(uri, options);
        }
        this.client = globalWithMongo._mongoClient;
      } else {
        this.client = new MongoClient(uri, options);
      }
    }
    return this.client;
  }

  public getDb(): Db {
    if (!this.db) {
      const client = this.getClient();
      this.db = client.db("bachat");
    }
    return this.db;
  }

  public async connect(): Promise<void> {
    try {
      const client = this.getClient();
      await client.connect();
      await client.db("admin").command({ ping: 1 });
      console.log("✅ Connected to MongoDB");
    } catch (error) {
      console.error("❌ MongoDB connection failed:", error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      console.log("✅ Disconnected from MongoDB");
    }
  }
}

// Export singleton instance and client for NextAuth compatibility
const dbConnection = DatabaseConnection.getInstance();
export const client = dbConnection.getClient();
export const getDb = () => dbConnection.getDb();
export default client;
