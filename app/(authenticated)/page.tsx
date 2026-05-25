import Link from "next/link";
import Image from "next/image";
import { Eye, Search, TrendingDown, Minus, Bell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { format } from "date-fns";

const watchlist = [
  {
    id: 1,
    name: "iPhone 15 Pro 256GB",
    brand: "Apple",
    price: 385000,
    drop: 5000,
    image:
      "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=500&q=80",
  },
  {
    id: 2,
    name: "Dell XPS 13 Plus",
    brand: "Dell",
    price: 420000,
    drop: 0,
    image:
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&q=80",
  },
  {
    id: 3,
    name: "Samsung Galaxy Tab S9",
    brand: "Samsung",
    price: 198000,
    drop: 8000,
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3bd43cb?w=500&q=80",
  },
  {
    id: 4,
    name: "Sony WH-1000XM5",
    brand: "Sony",
    price: 89000,
    drop: 0,
    image:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80",
  },
];

const recentlyAdded = [
  {
    id: 1,
    name: "Sony PlayStation 5 Disc Edition",
    store: "Daraz",
    discount: 12,
    current: 165000,
    original: 188000,
    addedAt: new Date("2026-05-24"),
    image:
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&q=80",
  },
  {
    id: 2,
    name: "AirPods Pro (2nd Gen)",
    store: "PriceOye",
    discount: 8,
    current: 62500,
    original: 68000,
    addedAt: new Date("2026-05-23"),
    image:
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&q=80",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Header */}
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
            placeholder="Search for products, deals, or brands…"
            className="h-11 w-full rounded-xl border border-input bg-muted/50 pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-emerald-600 focus:bg-background focus:ring-1 focus:ring-emerald-600/20"
          />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {/* Watchlist Carousel */}
        <section className="pt-5">
          <div className="flex items-center justify-between px-3 mb-3">
            <h2 className="text-sm font-semibold">Your Watchlist</h2>
            <Link
              href="/watchlist"
              className="text-xs text-emerald-700 font-medium"
            >
              View All
            </Link>
          </div>
          <Carousel
            opts={{ align: "start", dragFree: true }}
            className="w-full pb-2"
          >
            <CarouselContent className="pl-5 pr-5">
              {watchlist.map((item) => (
                <CarouselItem key={item.id} className="basis-[75%] pl-3">
                  <Card className="rounded-xl border shadow-none">
                    <CardContent className="p-3">
                      <div className="relative w-full h-32 rounded-xl bg-emerald-50 overflow-hidden mb-3">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 75vw, 300px"
                        />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <p className="text-sm font-semibold leading-snug line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {item.brand}
                        </p>
                        <div className="mt-1.5 flex items-center justify-between">
                          <p className="text-base font-bold text-emerald-700">
                            Rs. {item.price.toLocaleString()}
                          </p>
                          {item.drop > 0 ? (
                            <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-0 text-[10px] px-1.5 py-0.5 gap-1">
                              <TrendingDown size={12} /> Rs.{" "}
                              {item.drop.toLocaleString()}
                            </Badge>
                          ) : (
                            <Badge
                              variant="secondary"
                              className="text-[10px] px-1.5 py-0.5 gap-1 border-0"
                            >
                              <Minus size={12} /> Same
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>

        <hr className="mx-5 my-6 border-dashed" />

        {/* Biggest Price Drops */}
        <section>
          <div className="flex items-center justify-between px-3 mb-4">
            <h2 className="text-sm font-semibold">Biggest Price Drops</h2>
            <Link
              href="/view-all"
              className="text-xs text-emerald-700 font-medium"
            >
              View All
            </Link>
          </div>
          <div className="flex flex-col gap-2.5 px-3">
            {recentlyAdded.map((deal) => (
              <Card key={deal.id} className="rounded-xl border shadow-none">
                <CardContent className="p-2 py-0 flex items-center gap-3 relative">
                  <div className="relative w-16 h-16 rounded-lg bg-emerald-50/50 shrink-0 overflow-hidden">
                    <Image
                      src={deal.image}
                      alt={deal.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0 pr-8">
                    <p className="text-xs font-semibold leading-snug mb-1 line-clamp-1">
                      {deal.name}
                    </p>
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <Badge
                        className={`text-[9px] px-1.5 py-0 border-0 ${
                          deal.store === "Daraz"
                            ? "bg-orange-50 text-orange-700 hover:bg-orange-50"
                            : "bg-blue-50 text-blue-700 hover:bg-blue-50"
                        }`}
                      >
                        {deal.store}
                      </Badge>
                      <Badge className="bg-emerald-50 text-emerald-800 hover:bg-emerald-50 border-0 text-[9px] px-1.5 py-0">
                        ↓ {deal.discount}% Off
                      </Badge>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-bold text-emerald-700">
                        Rs. {deal.current.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-muted-foreground line-through">
                        Rs. {deal.original.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <span className="absolute top-3 right-3 text-[9px] text-muted-foreground">
                    {format(deal.addedAt, "d MMM")}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
