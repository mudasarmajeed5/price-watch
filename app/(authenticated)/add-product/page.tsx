"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MissingInfoModal } from "@/components/ui/missing-info-toast";
import { Card, CardContent } from "@/components/ui/card";
import {
  Clipboard,
  Search,
  Bell,
  Loader2,
  X,
  ShoppingBag,
  ChevronDown,
} from "lucide-react";
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

type ModalState = {
  title: string;
  description: string;
} | null;

const storeOptions = ["Outfitters", "BreakOut", "Saya", "Sana Safinaz"];

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
  const [store, setStore] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [error, setError] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [modal, setModal] = useState<ModalState>(null);

  const handleFetch = async () => {
    const trimmed = link.trim();
    if (!store || !trimmed) {
      setModal({
        title: "Missing Information",
        description: "Please select a store and add a product link before continuing.",
      });
      return;
    }
    if (store !== "Outfitters") {
      setError("Only Outfitters is supported right now.");
      return;
    }
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
            Paste a product link below to start tracking its price automatically.
          </p>

          <Card className="mb-4 rounded-2xl shadow-sm">
            <CardContent className="pt-5 pb-4">
              <div className="flex flex-col gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-muted-foreground">
                    Select Store
                  </label>
                  <div className="relative">
                    <select
                      value={store}
                      onChange={(e) => {
                        setStore(e.target.value);
                        setError("");
                        setPreview(null);
                      }}
                      className="h-11 w-full appearance-none rounded-lg border border-input bg-input/30 px-3 pr-9 text-sm text-foreground"
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      {storeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-muted-foreground">
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
                      className="h-11 w-full rounded-lg border border-input bg-input/30 px-3 pr-11 text-sm"
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
            </div>
          )}
        </div>
      </div>
    </>
  );
}