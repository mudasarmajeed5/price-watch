import Link from "next/link";
import Image from "next/image";
import { Eye, TrendingDown, Minus, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { format } from "date-fns";
import { getCollection } from "@/lib/products";

export default async function HomePage() {
  const watchlist = await getCollection();
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
          <Link
            href="/favorites"
            className="w-9 h-9 rounded-full border flex items-center justify-center bg-muted/50 hover:bg-muted transition-colors"
          >
            <Heart size={16} className="text-muted-foreground" />
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-20 w-full">
        {/* Watchlist Carousel */}
        <section className="pt-3">
          <div className="flex items-center justify-between px-3 mb-2">
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
            className="w-full pb-1"
          >
            <CarouselContent className="pl-3 pr-3">
              {watchlist.map((item) => (
                <CarouselItem
                  key={String(item._id)}
                  className="basis-[60%] pl-2"
                >
                  <Link href={`/product/${String(item._id)}`} className="block">
                    <Card className="rounded-xl border shadow-none">
                      <CardContent className="px-2 py-2">
                        <div className="relative w-full h-44 rounded-xl bg-emerald-50 overflow-hidden mb-2">
                          <Image
                            src={item.image || "/placeholder.png"}
                            alt={item.title || "Product"}
                            fill
                            loading="eager"
                            className="object-contain object-center scale-110"
                            sizes="(max-width: 768px) 75vw, 300px"
                          />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <p className="text-sm font-semibold leading-snug line-clamp-1">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {item.brand}
                          </p>
                          <div className="mt-1.5 flex items-center justify-between">
                            <p className="text-base font-bold text-emerald-700">
                              Rs. {(item.latestPrice || 0).toLocaleString()}
                            </p>
                            {item.dropAmount && item.dropAmount > 0 ? (
                              <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-0 text-[10px] px-1.5 py-0.5 gap-1">
                                <TrendingDown size={12} /> Rs.{" "}
                                {item.dropAmount.toLocaleString()}
                              </Badge>
                            ) : (
                              <Badge
                                variant="secondary"
                                className="text-[10px] px-1.5 py-0.5 gap-1 border-0"
                              >
                                Target: Rs {item.targetPrice?.toLocaleString()}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
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
            {watchlist.map((deal) => (
              <Link
                key={String(deal._id)}
                href={`/product/${String(deal._id)}`}
                className="block"
              >
                <Card className="rounded-xl border shadow-none">
                  <CardContent className="p-2.5 flex gap-3 items-stretch relative">
                    <div className="relative w-20 h-28 rounded-xl overflow-hidden bg-emerald-50/50 shrink-0">
                      <Image
                        src={deal.image || "/placeholder.png"}
                        alt={deal.title || "Product"}
                        fill
                        className="object-contain object-center scale-110"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold leading-snug line-clamp-2 mb-1">
                        {deal.title}
                      </p>
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <Badge
                          className={`text-[9px] px-1.5 py-0 border-0 ${
                            deal.store === "outfitters" ||
                            deal.store === "Outfitters"
                              ? "bg-orange-50 text-orange-700 hover:bg-orange-50"
                              : "bg-blue-50 text-blue-700 hover:bg-blue-50"
                          }`}
                        >
                          {deal.store}
                        </Badge>
                        {deal.dropAmount === 0 || !deal.dropAmount ? (
                          <Badge className="bg-slate-50 text-slate-700 hover:bg-slate-50 border-0 text-[9px] px-1.5 py-0">
                            Target: Rs {deal.targetPrice?.toLocaleString()}
                          </Badge>
                        ) : (
                          <Badge className="bg-emerald-50 text-emerald-800 hover:bg-emerald-50 border-0 text-[9px] px-1.5 py-0 gap-1">
                            ↓ Rs {deal.dropAmount?.toLocaleString()} off target!
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-bold text-emerald-700">
                          Rs. {(deal.latestPrice || 0).toLocaleString()}
                        </span>
                        {deal.originalPrice ? (
                          <span className="text-[10px] text-muted-foreground line-through">
                            Rs. {deal.originalPrice.toLocaleString()}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <span className="absolute top-3 right-3 text-[9px] text-muted-foreground">
                      {format(
                        deal.addedAt ? new Date(deal.addedAt) : new Date(),
                        "d MMM",
                      )}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
