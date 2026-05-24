"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clipboard, Search, Bell, Loader2, X, ShoppingBag } from "lucide-react";
import Image from "next/image";

type Product = {
  id: string;
  title: string;
  image: string;
  url: string;
  price?: string;
};

type Preview = {
  title: string;
  image: string;
  price?: string;
};

async function fetchOutfittersProduct(url: string): Promise<Preview> {
  const clean = url.split("?")[0].replace(/\/$/, "");
  const jsonUrl = clean.endsWith(".json") ? clean : `${clean}.json`;
  const res = await fetch(jsonUrl);
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  const data = await res.json();
  const product = data.product;
  if (!product) throw new Error("Product not found");
  return {
    title: product.title,
    image: product.images?.[0]?.src ?? "",
    price: product.variants?.[0]?.price ?? "",
  };
}

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [error, setError] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFetch = async () => {
    const trimmed = link.trim();
    if (!trimmed) return;
    if (!trimmed.includes("outfitters.com.pk")) {
      setError("Only Outfitters.com.pk links are supported.");
      return;
    }
    setError("");
    setPreview(null);
    setLoading(true);
    try {
      const result = await fetchOutfittersProduct(trimmed);
      setPreview(result);
    } catch (e) {
      setError("Could not fetch product. Please check the link.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToTracking = () => {
    if (!preview) return;
    setProducts((prev) => [
      {
        id: Date.now().toString(),
        title: preview.title,
        image: preview.image,
        url: link.trim(),
        price: preview.price,
      },
      ...prev,
    ]);
    setPreview(null);
    setLink("");
  };

  return (
    <div className="min-h-screen px-6 py-8 bg-background">
      <div className="max-w-lg mx-auto">
        <h1 className="font-heading text-xl text-center font-medium mb-4">
          Add Product
        </h1>
        <p className="text-sm text-muted-foreground text-center mb-6">
          Paste an Outfitters link to track its price automatically.
        </p>

        <Card className="mb-4">
          <CardContent className="pt-5">
            <div className="flex flex-col gap-4">
              <div>
                <label className="block mb-2 text-sm text-muted-foreground">
                  Product Link
                </label>
                <div className="relative">
                  <input
                    placeholder="https://outfitters.com.pk/products/..."
                    value={link}
                    onChange={(e) => {
                      setLink(e.target.value);
                      setError("");
                      setPreview(null);
                    }}
                    className="w-full rounded-md border border-input bg-input/30 px-4 py-3 text-sm pr-12"
                  />
                  <button
                    type="button"
                    aria-label="paste"
                    className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-md p-2 bg-muted/60"
                    onClick={async () => {
                      try {
                        const text = await navigator.clipboard.readText();
                        setLink(text);
                        setError("");
                        setPreview(null);
                      } catch {}
                    }}
                  >
                    <Clipboard className="size-4" />
                  </button>
                </div>
                {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
              </div>
              <Button
                className="w-full"
                variant="outline"
                onClick={handleFetch}
                // Use mounted to avoid hydration mismatch on disabled
                disabled={!mounted || loading || !link.trim()}
              >
                {loading ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Search className="mr-2 size-4" />
                )}
                {loading ? "Fetching..." : "Fetch Details"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardContent className="pt-5">
            {preview ? (
              <div className="flex flex-col gap-3">
                <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-muted">
                  <Image
                    src={preview.image}
                    alt={preview.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium leading-snug">{preview.title}</p>
                  {preview.price && (
                    <p className="mt-1 text-sm font-semibold text-emerald-700">
                      PKR {preview.price}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="rounded-full bg-muted/50 p-4 mb-4">
                  <ShoppingBag className="size-6 text-muted-foreground" />
                </div>
                <h3 className="text-sm font-medium">Product Preview</h3>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Details will appear here once the link is processed.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="pb-6">
          <Button
            className="w-full bg-emerald-700 hover:bg-emerald-600 text-white"
            size="lg"
            disabled={!mounted || !preview}
            onClick={handleAddToTracking}
          >
            <Bell className="mr-2 size-4" /> Start Tracking
          </Button>
        </div>

        {products.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
              Tracking ({products.length})
            </h2>
            <div className="flex flex-col gap-3">
              {products.map((p) => (
                <Card key={p.id}>
                  <CardContent className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative size-16 shrink-0 rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={p.image}
                          alt={p.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-snug line-clamp-2">
                          {p.title}
                        </p>
                        {p.price && (
                          <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                            PKR {p.price}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() =>
                          setProducts((prev) => prev.filter((x) => x.id !== p.id))
                        }
                        className="shrink-0 p-1.5 rounded-md hover:bg-muted transition-colors"
                        aria-label="Remove"
                      >
                        <X className="size-4 text-muted-foreground" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}