import Image from "next/image";
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

const filters = ["BreakOut", "Outfitters", "Ethnic", "Batik"];

const results = [
  {
    id: 1,
    name: "Button Down Shirt",
    brand: "BreakOut",
    price: 2799,
    originalPrice: 3999,
    drop: 7,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
  },
  {
    id: 2,
    name: "Button Down Shirt",
    brand: "BreakOut",
    price: 2799,
    originalPrice: 3999,
    drop: 7,
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=500&q=80",
  },
  {
    id: 3,
    name: "Button Down Shirt",
    brand: "BreakOut",
    price: 2799,
    originalPrice: 3999,
    drop: 7,
    image:
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=500&q=80",
  },
];

export default function SearchPage() {
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
              {filters.map((label) => {
                const isActive = label === "BreakOut";
                return (
                  <button
                    key={label}
                    type="button"
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
            <span className="text-foreground">"BreakOut"</span>
          </p>
        </section>

        <section className="px-3 pb-6">
          <div className="flex flex-col gap-3">
            {results.map((item) => (
              <Card key={item.id} className="rounded-2xl border shadow-none">
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
                      <span className="text-[10px] text-muted-foreground line-through">
                        PKR {item.originalPrice.toLocaleString("en-PK")}
                      </span>
                    </div>
                    <Badge className="mt-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-0 text-[9px] px-1.5 py-0.5 gap-1 inline-flex items-center">
                      <TrendingDown size={10} /> {item.drop}% Price Drop
                    </Badge>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button
                      type="button"
                      aria-label="Add to favorites"
                      className="h-7 w-7 rounded-full border bg-background flex items-center justify-center text-muted-foreground"
                    >
                      <Heart size={14} />
                    </button>
                    <Button className="h-7 px-3 text-[10px] rounded-lg bg-emerald-700 hover:bg-emerald-800">
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
