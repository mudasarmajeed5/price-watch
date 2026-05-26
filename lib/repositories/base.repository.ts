import {
  Collection,
  Db,
  Filter,
  InsertOneResult,
  UpdateResult,
  ObjectId,
} from "mongodb";
import { getDb } from "@/lib/db";

export abstract class BaseRepository<T> {
  protected collection: Collection<T>;

  constructor(collectionName: string) {
    const db: Db = getDb();
    this.collection = db.collection<T>(collectionName);
  }

  async findById(id: ObjectId): Promise<T | null> {
    return await this.collection.findOne({ _id: id } as Filter<T>);
  }

  async findOne(filter: Filter<T>): Promise<T | null> {
    return await this.collection.findOne(filter);
  }

  async find(filter: Filter<T>, limit = 0): Promise<T[]> {
    return await this.collection.find(filter).limit(limit).toArray();
  }

  async create(document: Omit<T, "_id">): Promise<InsertOneResult> {
    return await this.collection.insertOne(document as any);
  }

  async updateOne(filter: Filter<T>, update: any): Promise<UpdateResult> {
    return await this.collection.updateOne(filter, { $set: update });
  }

  async updateMany(filter: Filter<T>, update: any): Promise<UpdateResult> {
    return await this.collection.updateMany(filter, { $set: update });
  }

  async deleteOne(filter: Filter<T>): Promise<{ deletedCount: number }> {
    const result = await this.collection.deleteOne(filter);
    return { deletedCount: result.deletedCount };
  }

  async deleteMany(filter: Filter<T>): Promise<{ deletedCount: number }> {
    const result = await this.collection.deleteMany(filter);
    return { deletedCount: result.deletedCount };
  }

  async count(filter: Filter<T>): Promise<number> {
    return await this.collection.countDocuments(filter);
  }
}
