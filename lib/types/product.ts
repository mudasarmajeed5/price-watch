import { ObjectId } from "mongodb";

export interface Product {
  _id?: ObjectId;
  store: "outfitters" | "breakout" | "sana_safinaz" | "saya";
  handle: string;
  canonicalUrl: string;
  title: string;
  image: string;
  currency: string;
  latestPrice: number;
  lastCheckedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PriceSnapshot {
  _id?: ObjectId;
  productId: ObjectId;
  price: number;
  currency: string;
  checkedAt?: Date;
}

export interface ProductWithPrice extends Product {
  latestPrice: number;
}
