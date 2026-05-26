"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, TrendingDown, Minus, Trash2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCollection } from "@/lib/products";
import { useEffect, useState } from "react";

export default function WatchlistPage() {
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const baseUrl = window.location.origin;
        const response = await fetch(`${baseUrl}/api/watchlist`, {
          cache: "no-store",
        });
        if (response.ok) {
          const data = await response.json();
          setWatchlistItems(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch watchlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, []);

  const handleDelete = async (productId: string) => {
    if (!window.confirm("Remove this product from your watchlist?")) return;

    setDeletingId(productId);
    try {
      const baseUrl = window.location.origin;
      const response = await fetch(`${baseUrl}/api/watchlist`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (response.ok) {
        setWatchlistItems((prev) =>
          prev.filter((item) => String(item._id) !== productId),
        );
      } else {
        alert("Failed to remove product");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error removing product");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }
  return (
    <>
      {/* Header */}
      <header className="bg-background border-b px-3 py-4 sticky top-0 z-10 flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft size={20} className="text-foreground" />
        </Link>
        <h1 className="text-lg font-semibold">Watchlist</h1>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="px-3 py-4">
          {watchlistItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-muted-foreground mb-4">
                No items in your watchlist
              </p>
              <Link href="/add-product">
                <Button className="bg-emerald-700 hover:bg-emerald-800">
                  Add Products
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {watchlistItems.map((item) => (
                <div
                  key={String(item._id)}
                  className="relative rounded-xl border overflow-hidden flex flex-col h-full group"
                >
                  <Link href={`/product/${String(item._id)}`} className="block">
                    <div className="p-1 pt-0 pb-1.5 flex-1 flex flex-col relative">
                      <div className="relative w-full h-32 rounded-t-xl bg-muted overflow-hidden mb-1">
                        <Image
                          src={item.image || "/placeholder.png"}
                          alt={item.title || "Product"}
                          fill
                          loading="eager"
                          className="object-contain object-center"
                          sizes="(max-width: 768px) 45vw, 200px"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex-1">
                          <p className="text-xs font-semibold line-clamp-2 leading-tight mb-0">
                            {item.title}
                          </p>
                          <p className="text-[10px] text-muted-foreground line-clamp-1 mb-0.5">
                            {item.brand}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-baseline gap-1">
                            <span className="text-sm font-bold text-emerald-700">
                              Rs {(item.latestPrice || 0).toLocaleString()}
                            </span>
                            {item.originalPrice ? (
                              <span className="text-[10px] text-muted-foreground line-through">
                                Rs {item.originalPrice.toLocaleString()}
                              </span>
                            ) : null}
                          </div>

                          <div className="flex items-center justify-between gap-1">
                            {item.discount && (
                              <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-0 text-[9px] px-1.5 py-0">
                                ↓ {item.discount}% Off
                              </Badge>
                            )}
                            {item.status && (
                              <Badge
                                className={`text-[9px] px-1.5 py-0 border-0 ${
                                  item.status === "in stock now"
                                    ? "bg-green-50 text-green-700 hover:bg-green-50"
                                    : "bg-red-50 text-red-700 hover:bg-red-50"
                                }`}
                              >
                                {item.status}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={() => handleDelete(String(item._id))}
                    disabled={deletingId === String(item._id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-lg p-1.5"
                  >
                    {deletingId === String(item._id) ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
