import { ObjectId } from "mongodb";
import { auth } from "@/auth";
import { WatchlistService } from "@/lib/services/watchlist.service";
import { getDb } from "@/lib/db";

export type Product = {
  _id: string | ObjectId;
  id?: string;
  name?: string;
  title?: string;
  brand?: string;
  category?: string;
  price?: number;
  latestPrice?: number;
  targetPrice?: number;
  originalPrice?: number;
  discount?: number;
  dropAmount?: number;
  dropPercent?: number;
  store?: string;
  status?: string;
  addedAt?: string;
  createdAt?: string;
  image?: string;
  canonicalUrl?: string;
};

/**
 * Fetch product by ID from backend API
 */
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/products/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`Failed to fetch product ${id}:`, response.statusText);
      return null;
    }

    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

/**
 * Fetch user's watchlist from backend
 * Server-side: calls service directly
 * Client-side: uses API with baseUrl
 */
export const getCollection = async (_key?: string): Promise<Product[]> => {
  try {
    // Client-side: use API
    if (typeof window !== "undefined") {
      const baseUrl = window.location.origin;
      const response = await fetch(`${baseUrl}/api/watchlist`, {
        cache: "no-store",
      });
      if (!response.ok) {
        console.error("Failed to fetch watchlist:", response.statusText);
        return [];
      }
      const data = await response.json();
      return data.data || [];
    }

    // Server-side: call service directly
    const session = await auth();
    if (!session?.user?.id) return [];

    const watchlistService = new WatchlistService();
    const watchlist = await watchlistService.getUserWatchlist(
      new ObjectId(session.user.id),
    );

    return watchlist.map((item: any) => ({
      ...item,
      createdAt:
        item.createdAt instanceof Date
          ? item.createdAt.toISOString()
          : undefined,
    })) as Product[];
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    return [];
  }
};
