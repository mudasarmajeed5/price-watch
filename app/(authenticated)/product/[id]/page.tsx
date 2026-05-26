"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Check, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import productsData, { getProductById } from "@/lib/products";
import { useFavorites } from "@/lib/use-favorites";

const fallbackProduct = productsData.products[0];

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const productId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const product = getProductById(productId ?? "") ?? fallbackProduct;
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(product.id);

  const [isTracking, setIsTracking] = useState(true);
  const [targetPrice, setTargetPrice] = useState("");
  const [baselinePrice, setBaselinePrice] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const priceValue = product.price.toString();
    setTargetPrice(priceValue);
    setBaselinePrice(priceValue);
  }, [product.id, product.price]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const isDirty = targetPrice.trim() !== "" && targetPrice !== baselinePrice;

  const handleConfirmTarget = () => {
    if (!targetPrice.trim()) return;
    setBaselinePrice(targetPrice);
  };

  return (
    <main className="flex-1 min-h-[100svh] overflow-y-auto pb-24">
      <section className="relative">
        <div className="relative w-full aspect-[4/5] bg-muted overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
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
          onClick={() => toggleFavorite(product.id)}
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
              {product.category ?? "Product"}
            </p>
            <h1 className="text-base font-semibold leading-snug">
              {product.name}
            </h1>
          </div>
          <div className="h-5 w-5 rounded-full border border-muted-foreground/30 flex items-center justify-center">
            <span className="h-2.5 w-2.5 rounded-full bg-foreground" />
          </div>
        </div>

        <p className="mt-3 text-xl font-semibold text-emerald-700">
          PKR {product.price.toLocaleString("en-PK")}
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
                disabled={!isDirty}
                className={`shrink-0 self-end mb-0.5 transition-opacity ${
                  isDirty ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <Check size={16} />
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
