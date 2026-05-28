"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, SlidersHorizontal, TrendingDown, Heart } from "lucide-react";
import SearchSkeleton from "@/components/skeletons/search-skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/lib/products";
import { useFavorites } from "@/lib/use-favorites";

const storeOptions = ["All", "outfitters", "breakout", "saya", "sana_safinaz"];

export default function SearchPage() {
  const [activeStore, setActiveStore] = useState("All");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const baseUrl =
          typeof window !== "undefined"
            ? window.location.origin
            : "http://localhost:3000";
        const response = await fetch(`${baseUrl}/api/watchlist`, {
          cache: "no-store",
        });
        if (response.ok) {
          const data = await response.json();
          setResults(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredResults = useMemo(
    () =>
      results.filter((item) => {
        const matchesStore =
          activeStore === "All" || item.store === activeStore;

        if (!matchesStore) return false;
        if (!normalizedQuery) return true;

        const haystack = [item.title, item.brand, item.store]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return haystack.includes(normalizedQuery);
      }),
    [activeStore, normalizedQuery, results],
  );

  if (isLoading) return <SearchSkeleton />;

  return (
    <>
      <main className="flex-1 overflow-y-auto pb-20">
        <section className="px-3 pt-4">
          <div className="relative mb-4">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search for products, deals, or brands..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-11 w-full rounded-xl border border-input bg-muted/50 pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-emerald-600 focus:bg-background focus:ring-1 focus:ring-emerald-600/20"
            />
          </div>
        </section>
        <section className="px-3 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <button
              type="button"
              className="h-8 w-8 rounded-lg border bg-background text-muted-foreground flex items-center justify-center"
              aria-label="Filters"
            >
              <SlidersHorizontal size={14} />
            </button>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {storeOptions.map((label) => {
                const isActive = label === activeStore;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setActiveStore(label)}
                    className={`px-3 h-8 rounded-full text-[11px] border transition-colors shrink-0 ${
                      isActive
                        ? "bg-emerald-700 text-white border-emerald-700"
                        : "bg-muted/50 text-muted-foreground border-transparent"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground mb-3">
            Showing Products of{" "}
            <span className="text-foreground">
              "{activeStore === "All" ? "All Stores" : activeStore}"
            </span>
          </p>
        </section>

        <section className="px-3 pb-6">
          {filteredResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-10 text-center">
              <p className="text-sm font-medium">No products found</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Try another brand filter.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredResults.map((item) => {
                const favorite = isFavorite(String(item._id));
                return (
                  <Link
                    key={String(item._id)}
                    href={`/product/${String(item._id)}`}
                    className="block"
                  >
                    <Card className="rounded-xl border shadow-none hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="px-2 flex gap-3 items-center">
                        <div className="relative w-20 h-28 rounded-xl shrink-0">
                          <Image
                            src={item.image || "/placeholder.png"}
                            alt={item.title || "Product"}
                            fill
                            loading="eager"
                            className="object-contain rounded-xl scale-110 object-center"
                            sizes="80px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold leading-snug line-clamp-2">
                            {item.title}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {item.brand}
                          </p>
                          <div className="mt-2 flex items-baseline gap-2">
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
                          {item.dropPercent ? (
                            <Badge className="mt-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-0 text-[9px] px-1.5 py-0.5 gap-1 inline-flex items-center">
                              <TrendingDown size={10} /> {item.dropPercent}%
                              Price Drop
                            </Badge>
                          ) : null}
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(String(item._id));
                          }}
                          className={`h-7 w-7 rounded-full border flex items-center justify-center transition-colors ${
                            favorite
                              ? "border-red-200 bg-red-50 text-red-500"
                              : "bg-background text-muted-foreground"
                          }`}
                        >
                          <Heart
                            size={14}
                            fill={favorite ? "currentColor" : "none"}
                          />
                        </button>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
