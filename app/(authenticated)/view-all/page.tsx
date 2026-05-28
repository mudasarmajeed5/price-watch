import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCollection } from "@/lib/products";

export default async function ViewAllPage() {
  const recentlyAdded = await getCollection();
  const biggestDrops = [...recentlyAdded]
    .sort((a, b) => (b.dropAmount || 0) - (a.dropAmount || 0))
    .slice(0, 10);
  return (
    <>
      <main className="flex-1 overflow-y-auto pb-20">
        <section className="px-3 py-4">
          <div className="flex flex-col gap-3">
            {biggestDrops.map((item) => (
              <Link
                key={String(item._id)}
                href={`/product/${String(item._id)}`}
                className="block"
              >
                <Card className="rounded-2xl border shadow-none bg-background">
                  <CardContent className="p-2 py-2 flex items-center gap-3 relative">
                    <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-muted shrink-0">
                      <Image
                        src={item.image || "/placeholder.png"}
                        alt={item.title || "Product"}
                        fill
                        loading="eager"
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0 pr-16">
                      <p className="text-xs font-semibold leading-snug line-clamp-1">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground mb-1">
                        {item.brand}
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-bold text-emerald-700">
                          PKR {(item.latestPrice || 0).toLocaleString("en-PK")}
                        </span>
                        {item.originalPrice ? (
                          <span className="text-[10px] text-muted-foreground line-through">
                            PKR {item.originalPrice.toLocaleString("en-PK")}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    {item.discount && (
                      <Badge className="absolute right-3 top-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-0 text-[9px] px-2 py-0.5">
                        {item.discount}% Off
                      </Badge>
                    )}
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
