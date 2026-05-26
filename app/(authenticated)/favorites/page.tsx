"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useFavorites } from "@/lib/use-favorites";
import { Product } from "@/lib/products";
import { useEffect, useState } from "react";

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (favorites.length === 0) {
        setProducts([]);
        return;
      }

      setIsLoading(true);
      try {
        // Fetch all watchlist items and filter to only those that are favorites
        const baseUrl =
          typeof window !== "undefined"
            ? window.location.origin
            : "http://localhost:3000";
        const response = await fetch(`${baseUrl}/api/watchlist`, {
          cache: "no-store",
        });
        if (response.ok) {
          const data = await response.json();
          const watchlistItems = data.data || [];
          const favoriteProducts = watchlistItems.filter((item: any) =>
            favorites.includes(String(item.productId || item._id)),
          );
          setProducts(favoriteProducts);
        }
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [favorites]);

  return (
    <>
      <header className="bg-background border-b px-3 py-4 sticky top-0 z-10 flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft size={20} className="text-foreground" />
        </Link>
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold">Your Favorites</h1>
          <span className="text-[11px] text-muted-foreground">
            {products.length} product{products.length !== 1 ? "s" : ""} saved
          </span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-20">
        <section className="px-3 py-4">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Heart
                size={48}
                className="text-muted-foreground mb-4 opacity-30"
              />
              <p className="text-muted-foreground text-sm">
                No favorites yet. Start adding products to your favorites!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {products.map((item) => (
                <Link
                  key={String(item._id)}
                  href={`/product/${String(item._id)}`}
                  className="block"
                >
                  <Card className="rounded-2xl border shadow-none bg-background">
                    <CardContent className="p-2 py-2 flex items-center gap-3 relative">
                      <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-muted shrink-0">
                        <Image
                          src={item.image || "/placeholder.png"}
                          alt={item.title || "Product"}
                          fill
                          loading="eager"
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1 min-w-0 pr-16">
                        <p className="text-xs font-semibold leading-snug line-clamp-1">
                          {item.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground mb-1">
                          {item.brand}
                        </p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-bold text-emerald-700">
                            PKR{" "}
                            {(item.latestPrice || 0).toLocaleString("en-PK")}
                          </span>
                          {item.originalPrice ? (
                            <span className="text-[10px] text-muted-foreground line-through">
                              PKR {item.originalPrice.toLocaleString("en-PK")}
                            </span>
                          ) : null}
                        </div>
                      </div>
                      {item.discount ? (
                        <Badge className="absolute right-3 top-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-0 text-[9px] px-2 py-0.5">
                          {item.discount}% Off
                        </Badge>
                      ) : null}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
