"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  Search,
  SlidersHorizontal,
  TrendingDown,
  Heart,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import productsData from "@/lib/products";
import { useFavorites } from "@/lib/use-favorites";

const storeOptions = ["All", "Outfitters", "BreakOut", "Saya", "Sana Safinaz"];

const results = productsData.products;

export default function SearchPage() {
  const [activeStore, setActiveStore] = useState("All");
  const [query, setQuery] = useState("");
  const { isFavorite, toggleFavorite } = useFavorites();

  const normalizedQuery = query.trim().toLowerCase();

  const filteredResults = useMemo(
    () =>
      results.filter((item) => {
        const matchesStore =
          activeStore === "All" || item.category === activeStore;

        if (!matchesStore) return false;
        if (!normalizedQuery) return true;

        const haystack = [item.name, item.brand, item.category]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return haystack.includes(normalizedQuery);
      }),
    [activeStore, normalizedQuery],
  );

  return (
    <>
      <header className="bg-background border-b px-3 pt-4 pb-3 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center rounded bg-emerald-50">
              <Image
                src="/app_logo.svg"
                alt="Bachat"
                width={20}
                height={20}
                className="h-5 w-5"
                priority
              />
            </div>
            <span className="text-lg font-semibold">Bachat</span>
          </div>
          <button className="w-9 h-9 rounded-full border flex items-center justify-center bg-muted/50">
            <Bell size={16} className="text-muted-foreground" />
          </button>
        </div>
        <div className="relative">
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
      </header>

      <main className="flex-1 overflow-y-auto pb-20">
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
                const favorite = isFavorite(item.id);
                return (
                  <Card
                    key={item.id}
                    className="rounded-2xl border shadow-none"
                  >
                    <CardContent className="p-2.5 flex gap-3 items-stretch">
                      <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-muted shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold leading-snug line-clamp-2">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {item.brand}
                        </p>
                        <div className="mt-2 flex items-baseline gap-2">
                          <span className="text-sm font-bold text-emerald-700">
                            PKR {item.price.toLocaleString("en-PK")}
                          </span>
                          {item.originalPrice ? (
                            <span className="text-[10px] text-muted-foreground line-through">
                              PKR {item.originalPrice.toLocaleString("en-PK")}
                            </span>
                          ) : null}
                        </div>
                        {item.dropPercent ? (
                          <Badge className="mt-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-0 text-[9px] px-1.5 py-0.5 gap-1 inline-flex items-center">
                            <TrendingDown size={10} /> {item.dropPercent}% Price
                            Drop
                          </Badge>
                        ) : null}
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <button
                          type="button"
                          aria-label={
                            favorite
                              ? "Remove from favorites"
                              : "Add to favorites"
                          }
                          aria-pressed={favorite}
                          onClick={() => toggleFavorite(item.id)}
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
                        <Button
                          asChild
                          className="h-7 px-3 text-[10px] rounded-lg bg-emerald-700 hover:bg-emerald-800"
                        >
                          <Link href={`/product/${item.id}`}>View</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
