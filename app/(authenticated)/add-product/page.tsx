"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MissingInfoModal } from "@/components/ui/missing-info-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clipboard, Search, Bell, Loader2, X, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Product = {
  id: string;
  title: string;
  image: string;
  url: string;
  price?: string;
  targetPrice?: string;
};

type Preview = {
  title: string;
  image: string;
  price?: string;
};

type ModalState = {
  title: string;
  description: string;
} | null;

const storeOptions = [
  { value: "outfitters", label: "Outfitters" },
  { value: "breakout", label: "BreakOut" },
  { value: "saya", label: "Saya" },
  { value: "sana_safinaz", label: "Sana Safinaz" },
];

async function fetchProductPreview(url: string): Promise<Preview> {
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/preview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || `Failed: ${res.status}`);
  }
  const data = await res.json();
  return data.data;
}

export default function Page() {
  const [store, setStore] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [error, setError] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [modal, setModal] = useState<ModalState>(null);
  const [targetPrice, setTargetPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleFetch = async () => {
    const trimmed = link.trim();
    if (!store || !trimmed) {
      setModal({
        title: "Missing Information",
        description:
          "Please select a store and add a product link before continuing.",
      });
      return;
    }
    setError("");
    setPreview(null);
    setLoading(true);
    try {
      const result = await fetchProductPreview(trimmed);
      setPreview(result);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not fetch product preview",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddToTracking = () => {
    if (!preview) return;
    if (!targetPrice.trim()) {
      setModal({
        title: "Missing Target Price",
        description: "Please set a target price before tracking this item.",
      });
      return;
    }
    setProducts((prev) => [
      {
        id: Date.now().toString(),
        title: preview.title,
        image: preview.image,
        url: link.trim(),
        price: preview.price,
        targetPrice: targetPrice.trim(),
      },
      ...prev,
    ]);
    setPreview(null);
    setLink("");
    setTargetPrice("");
  };

  const handleSubmitToBackend = async () => {
    if (products.length === 0) {
      setModal({
        title: "No Products",
        description: "Please add at least one product before submitting.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const baseUrl =
        typeof window !== "undefined"
          ? window.location.origin
          : "http://localhost:3000";
      const results = [];

      for (const product of products) {
        try {
          const response = await fetch(`${baseUrl}/api/watchlist`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              url: product.url,
              targetPrice: parseFloat(product.targetPrice || "0"),
            }),
          });

          if (response.ok) {
            results.push({ success: true, product });
          } else {
            const errorData = await response.json();
            results.push({ success: false, product, error: errorData.error });
          }
        } catch (error) {
          results.push({ success: false, product, error: String(error) });
        }
      }

      const allSuccess = results.every((r) => r.success);
      if (allSuccess) {
        setModal({
          title: "Success!",
          description: `${products.length} product(s) added to watchlist. Redirecting...`,
        });
        setProducts([]);
        setTimeout(() => {
          window.location.href = "/watchlist";
        }, 1500);
      } else {
        const failed = results.filter((r) => !r.success).length;
        setModal({
          title: "Partial Success",
          description: `${results.filter((r) => r.success).length} of ${products.length} products added. ${failed} failed.`,
        });
      }
    } catch (error) {
      setModal({
        title: "Error",
        description: "Failed to submit products. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {modal && (
        <MissingInfoModal
          title={modal.title}
          description={modal.description}
          onClose={() => setModal(null)}
        />
      )}
      <div className="min-h-screen bg-background px-4 pt-6 pb-24">
        <div className="max-w-sm mx-auto">
          <h1 className="font-heading text-lg text-center font-semibold mb-2">
            Add Product
          </h1>
          <p className="text-xs text-muted-foreground text-center mb-6">
            Paste a product link below to start tracking its price
            automatically.
          </p>

          <Card className="mb-4 rounded-2xl shadow-sm">
            <CardContent className="pt-5 pb-4">
              <div className="flex flex-col gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-muted-foreground">
                    Select Store
                  </label>
                  <Select
                    value={store}
                    onValueChange={(value) => {
                      setStore(value);
                      setError("");
                      setPreview(null);
                    }}
                  >
                    <SelectTrigger className="h-11 w-full rounded-lg bg-input/30 px-3 text-sm">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="w-(--radix-select-trigger-width)">
                      {storeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-muted-foreground">
                    Product Link
                  </label>
                  <div className="relative">
                    <Input
                      placeholder="https://outfitters.com.pk/products/..."
                      value={link}
                      onChange={(e) => {
                        setLink(e.target.value);
                        setError("");
                        setPreview(null);
                      }}
                      className="h-11 rounded-lg bg-input/30 px-3 pr-11 text-sm"
                    />
                    <button
                      type="button"
                      aria-label="Paste"
                      className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-md bg-muted/60"
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
                  {error && <p className="text-xs text-red-500">{error}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-muted-foreground">
                    Target Price
                  </label>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    placeholder="Enter target price (PKR)"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    className="h-11 rounded-lg bg-input/30 px-3 text-sm"
                  />
                </div>
                <Button
                  className="w-full h-10 border border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  onClick={handleFetch}
                  disabled={loading}
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

          <Card className="mb-4 rounded-2xl shadow-sm">
            <CardContent className="pt-5 pb-4">
              {preview ? (
                <div className="flex flex-col gap-3">
                  <div className="relative w-full aspect-3/4 rounded-xl overflow-hidden bg-muted">
                    <Image
                      src={preview.image}
                      alt={preview.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium leading-snug">
                      {preview.title}
                    </p>
                    {preview.price && (
                      <p className="mt-1 text-sm font-semibold text-emerald-700">
                        PKR {preview.price}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="mb-3 rounded-full bg-muted/50 p-3">
                    <ShoppingBag className="size-5 text-muted-foreground" />
                  </div>
                  <h3 className="text-sm font-medium">Product Preview</h3>
                  <p className="mt-2 text-xs text-muted-foreground text-center">
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
              disabled={!preview}
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
                        <div className="flex items-center gap-3 flex-1 min-w-0">
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
                            {p.targetPrice && (
                              <p className="text-[11px] text-muted-foreground mt-1">
                                Target: PKR {p.targetPrice}
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            setProducts((prev) =>
                              prev.filter((x) => x.id !== p.id),
                            )
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
              <Button
                className="w-full mt-4 bg-emerald-700 hover:bg-emerald-600 text-white"
                size="lg"
                onClick={handleSubmitToBackend}
                disabled={submitting}
              >
                {submitting ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Bell className="mr-2 size-4" />
                )}
                {submitting ? "Submitting..." : "Add to Watchlist"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
