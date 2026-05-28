"use client";

import Link from "next/link";
import Image from "next/image";
import { TrendingDown, Minus, Trash2, Loader2 } from "lucide-react";
import WatchlistSkeleton from "@/components/skeletons/watchlist-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Product } from "@/lib/products";
import { useEffect, useState } from "react";

export default function WatchlistPage() {
  const [watchlistItems, setWatchlistItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<{
    id: string;
    title: string;
  } | null>(null);

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
        toast.success("Removed from watchlist");
      } else {
        toast.error("Failed to remove product");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Error removing product");
    } finally {
      setDeletingId(null);
      setDeleteCandidate(null);
    }
  };

  if (loading) {
    return <WatchlistSkeleton />;
  }
  return (
    <>
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="px-3 py-4">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Watchlist</h2>
          </div>
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
                  className="relative rounded-xl overflow-hidden flex flex-col h-full group shadow border p-1"
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
                        </div>
                      </div>
                    </div>
                  </Link>
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
                    <button
                      onClick={() =>
                        setDeleteCandidate({
                          id: String(item._id),
                          title: item.title || "this product",
                        })
                      }
                      disabled={deletingId === String(item._id)}
                      className="ml-auto flex h-7 w-7 items-center justify-center rounded-full bg-red-50 text-red-700 hover:bg-red-100 transition-colors disabled:opacity-50"
                      aria-label="Remove item"
                    >
                      {deletingId === String(item._id) ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Dialog
        className="bg-white rounded-lg p-6 shadow-lg"
        open={Boolean(deleteCandidate)}
        onOpenChange={(open) => {
          if (!open) setDeleteCandidate(null);
        }}
        title="Remove item from watchlist"
        description={`Are you sure you want to remove ${deleteCandidate?.title ?? "this item"} from your watchlist?`}
      >
        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
          <Button
            variant="secondary"
            onClick={() => setDeleteCandidate(null)}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteCandidate && handleDelete(deleteCandidate.id)}
            disabled={deletingId === deleteCandidate?.id}
            className="w-full sm:w-auto"
          >
            {deletingId === deleteCandidate?.id ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Remove"
            )}
          </Button>
        </div>
      </Dialog>
    </>
  );
}
