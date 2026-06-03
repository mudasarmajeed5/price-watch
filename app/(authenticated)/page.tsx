import Link from "next/link";
import Image from "next/image";
import { TrendingDown, Heart } from "lucide-react";

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

  const hasItems = watchlist.length > 0;
  const biggestDrops = [...watchlist]
    .map((item) => ({
      ...item,
      computedDrop: (item.targetPrice ?? 0) - (item.latestPrice ?? 0),
    }))
    .filter((item) => (item.computedDrop ?? 0) > 0)
    .sort((a, b) => (b.computedDrop ?? 0) - (a.computedDrop ?? 0))
    .slice(0, 3);

  return (
    <main className="flex-1 overflow-y-auto pb-20 w-full">
      {/* Watchlist Carousel */}
      <section className="pt-3">
        <div className="flex items-center justify-between px-3 mb-2">
          <h2 className="text-lg font-semibold">Recently Added</h2>
          {hasItems && (
            <Link href="/watchlist" className="text-xs text-emerald-700 font-medium">
              View All
            </Link>
          )}
        </div>

        {hasItems ? (
          <Carousel opts={{ align: "start", dragFree: true }} className="w-full pb-1">
            <CarouselContent className="pl-3 pr-3">
              {watchlist.map((item) => (
                <CarouselItem key={String(item._id)} className="basis-[60%] pl-2">
                  <Link href={`/product/${String(item._id)}`} className="block">
                    <Card className="rounded-xl shadow-sm ring-0 hover:shadow-md transition-shadow duration-200">
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
                          <p className="text-sm font-semibold leading-snug line-clamp-1">{item.title}</p>
                          <p className="text-[11px] text-muted-foreground">{item.brand}</p>
                          <div className="mt-1.5 flex items-center justify-between">
                            <p className="text-base font-bold text-emerald-700">
                              Rs. {(item.latestPrice || 0).toLocaleString()}
                            </p>
                            {item.dropAmount && item.dropAmount > 0 ? (
                              <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-0 text-[10px] px-1.5 py-0.5 gap-1">
                                <TrendingDown size={12} />
                                Rs. {item.dropAmount.toLocaleString()}
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 gap-1 border-0">
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
        ) : (
          <div className="px-3 py-8 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
              <Heart className="size-5 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-sm mb-1">Your watchlist is empty</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[220px]">
              Track products and get notified when prices drop.
            </p>
            <Link
              href="/add-product"
              className="mt-5 inline-flex items-center justify-center rounded-xl bg-emerald-700 text-white text-sm font-medium px-5 py-2.5 hover:bg-emerald-800 transition-colors"
            >
              Add product
            </Link>
          </div>
        )}
      </section>

      <hr className="mx-5 my-2 border-dashed" />

      {/* Biggest Price Drops */}
      <section>
        <div className="flex items-center justify-between px-3 mb-4 mt-6">
          <h2 className="text-lg font-semibold">Biggest Price Drops</h2>
          {hasItems && (
            <Link href="/view-all" className="text-xs text-emerald-700 font-medium">
              View All
            </Link>
          )}
        </div>

        {biggestDrops.length > 0 ? (
          <div className="flex flex-col gap-2.5 px-3">
            {biggestDrops.map((deal) => (
              <Link key={String(deal._id)} href={`/product/${String(deal._id)}`} className="block">
                <Card className="rounded-xl border border-emerald-100/70 bg-white shadow-sm ring-0 hover:shadow-md transition-shadow duration-200">
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
                      <p className="text-xs font-semibold leading-snug line-clamp-2 mb-1">{deal.title}</p>
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <Badge
                          className={`text-[9px] px-1.5 py-0 border-0 ${
                            deal.store === "outfitters" || deal.store === "Outfitters"
                              ? "bg-orange-50 text-orange-700 hover:bg-orange-50"
                              : "bg-blue-50 text-blue-700 hover:bg-blue-50"
                          }`}
                        >
                          {deal.store}
                        </Badge>
                        <Badge className="bg-emerald-50 text-emerald-800 hover:bg-emerald-50 border-0 text-[9px] px-1.5 py-0.5 gap-1">
                          ↓ Rs {(deal.computedDrop ?? 0).toLocaleString()} off target!
                        </Badge>
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
                      {format(deal.addedAt ? new Date(deal.addedAt) : new Date(), "d MMM")}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="px-3 py-8 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
              <TrendingDown className="size-5 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-sm mb-1">No price drops yet</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[220px]">
              Products that fall below your target price will show up here.
            </p>
         
          </div>
        )}
      </section>
    </main>
  );
}