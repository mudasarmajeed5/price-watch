"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Check, Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Product } from "@/lib/products";
import { useFavorites } from "@/lib/use-favorites";

type ProductWithTarget = Product & { targetPrice?: number };

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const productId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const { isFavorite, toggleFavorite } = useFavorites();

  const [product, setProduct] = useState<ProductWithTarget | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTracking, setIsTracking] = useState(true);
  const [targetPrice, setTargetPrice] = useState("");
  const [baselinePrice, setBaselinePrice] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      try {
        const baseUrl =
          typeof window !== "undefined"
            ? window.location.origin
            : "http://localhost:3000";
        const response = await fetch(`${baseUrl}/api/products/${productId}`, {
          cache: "no-store",
        });
        if (response.ok) {
          const data = await response.json();
          setProduct(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    if (product?.targetPrice) {
      const priceValue = product.targetPrice.toString();
      setTargetPrice(priceValue);
      setBaselinePrice(priceValue);
    }
  }, [product?.targetPrice, product?._id]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const favorite = product ? isFavorite(String(product._id)) : false;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">Loading...</div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center py-20">
        Product not found
      </div>
    );
  }

  const isDirty = targetPrice.trim() !== "" && targetPrice !== baselinePrice;

  const handleConfirmTarget = async () => {
    if (!targetPrice.trim()) return;

    setIsSaving(true);
    try {
      const baseUrl =
        typeof window !== "undefined"
          ? window.location.origin
          : "http://localhost:3000";
      const response = await fetch(`${baseUrl}/api/watchlist`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: productId,
          targetPrice: parseFloat(targetPrice),
        }),
      });

      if (response.ok) {
        setBaselinePrice(targetPrice);
      } else {
        const error = await response.json();
        console.error("Failed to update target price:", error);
      }
    } catch (error) {
      console.error("Error updating target price:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="flex-1 min-h-svh overflow-y-auto pb-24">
      <section className="relative">
        <div className="relative w-full aspect-[4/5] bg-muted overflow-hidden">
          <Image
            src={product.image || "/placeholder.png"}
            alt={product.title || "Product"}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
        <button
          type="button"
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={favorite}
          onClick={() => toggleFavorite(String(product._id))}
          className={`absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition-colors ${
            favorite
              ? "border-red-200 bg-red-50 text-red-500"
              : "bg-background/90 text-muted-foreground"
          }`}
        >
          <Heart size={18} fill={favorite ? "currentColor" : "none"} />
        </button>
      </section>

      <section className="px-4 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] text-muted-foreground mb-1">
              {product.store ?? "Product"}
            </p>
            <h1 className="text-base font-semibold leading-snug">
              {product.title}
            </h1>
          </div>
          <div className="h-5 w-5 rounded-full border border-muted-foreground/30 flex items-center justify-center">
            <span className="h-2.5 w-2.5 rounded-full bg-foreground" />
          </div>
        </div>

        <p className="mt-3 text-xl font-semibold text-emerald-700">
          PKR {(product.latestPrice || 0).toLocaleString("en-PK")}
        </p>
      </section>

      <section className="px-4 pt-4">
        <div className="rounded-2xl border bg-background p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-muted-foreground">Tracking</p>
              <p className="text-sm font-semibold">
                {isTracking ? "Enabled" : "Paused"}
              </p>
            </div>
            <Switch checked={isTracking} onCheckedChange={setIsTracking} />
          </div>

          <div className="h-px bg-border/60" />

          <div className="flex items-end justify-between gap-3">
            <div className="flex-1">
              <p className="text-[11px] text-muted-foreground">Target price</p>
              <Input
                type="number"
                inputMode="numeric"
                min="0"
                value={targetPrice}
                onChange={(event) => setTargetPrice(event.target.value)}
                className="mt-1 h-9 rounded-lg"
              />
            </div>
            {isHydrated ? (
              <Button
                type="button"
                size="icon-sm"
                variant="outline"
                onClick={handleConfirmTarget}
                aria-label="Confirm target price"
                disabled={!isDirty || isSaving}
                className={`shrink-0 self-end mb-0.5 transition-opacity ${
                  isDirty ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                {isSaving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Check size={16} />
                )}
              </Button>
            ) : (
              <span className="size-8 shrink-0 self-end mb-0.5" />
            )}
          </div>

          <p
            className={`text-[11px] text-muted-foreground min-h-[16px] transition-opacity ${
              isTracking ? "opacity-0" : "opacity-100"
            }`}
            aria-hidden={isTracking}
          >
            Tracking is off. Turn it on to get price alerts.
          </p>
        </div>
      </section>
    </main>
  );
}
