import { ObjectId, Filter } from "mongodb";
import { BaseRepository } from "./base.repository";
import { PushSubscription } from "@/lib/types/notification";

export class PushSubscriptionRepository extends BaseRepository<PushSubscription> {
  constructor() {
    super("push_subscriptions");
  }

  async saveSubscription(
    userId: ObjectId,
    subscription: any,
  ): Promise<ObjectId> {
    const existing = await this.findOne({
      userId,
      endpoint: subscription.endpoint,
    } as Filter<PushSubscription>);

    if (existing) {
      await this.updateOne({ _id: existing._id! } as Filter<PushSubscription>, {
        keys: subscription.keys,
        updatedAt: new Date(),
      });
      return existing._id!;
    }

    const result = await this.create({
      userId,
      endpoint: subscription.endpoint,
      keys: subscription.keys,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return result.insertedId;
  }

  async getUserSubscriptions(userId: ObjectId): Promise<PushSubscription[]> {
    return await this.find({ userId } as Filter<PushSubscription>);
  }

  async removeSubscription(userId: ObjectId, endpoint: string): Promise<void> {
    await this.deleteOne({
      userId,
      endpoint,
    } as Filter<PushSubscription>);
  }

  async getAllSubscriptions(): Promise<PushSubscription[]> {
    return await this.find({} as Filter<PushSubscription>);
  }
}
