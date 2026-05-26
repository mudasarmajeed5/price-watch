import { ObjectId } from "mongodb";

export interface PriceAlert {
  _id?: ObjectId;
  userId: ObjectId;
  productId: ObjectId;
  targetPrice: number;
  currency: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  lastNotifiedAt?: Date;
}

export interface PriceAlertWithProduct extends PriceAlert {
  product?: {
    title: string;
    image: string;
    latestPrice: number;
    canonicalUrl: string;
  };
}
