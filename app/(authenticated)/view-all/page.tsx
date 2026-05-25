import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const recentlyAdded = [
  {
    id: 1,
    name: "Relaxed Fit Knitted Polo",
    brand: "Brunches",
    price: 3849,
    originalPrice: 5499,
    discount: 30,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
  },
  {
    id: 2,
    name: "Uni Directional Knitted Polo",
    brand: "Brunches",
    price: 4899,
    originalPrice: 6999,
    discount: 30,
    image:
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=500&q=80",
  },
  {
    id: 3,
    name: "Cotton Dress Shirt",
    brand: "Oxford Co.",
    price: 5447,
    originalPrice: 9900,
    discount: 45,
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&q=80",
  },
  {
    id: 4,
    name: "Cotton Dress Shirt",
    brand: "Oxford Co.",
    price: 5447,
    originalPrice: 9900,
    discount: 45,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
  },
  {
    id: 5,
    name: "Relaxed Fit Knitted Polo",
    brand: "Brunches",
    price: 3849,
    originalPrice: 5499,
    discount: 30,
    image:
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=500&q=80",
  },
  {
    id: 6,
    name: "Uni Directional Knitted Polo",
    brand: "Brunches",
    price: 4899,
    originalPrice: 6999,
    discount: 30,
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&q=80",
  },
];

export default function ViewAllPage() {
  return (
    <>
      <header className="bg-background border-b px-3 py-4 sticky top-0 z-10 flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft size={20} className="text-foreground" />
        </Link>
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold">Recently Added</h1>
          <span className="text-[11px] text-muted-foreground">
            Deals added in the last few days
          </span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-20">
        <section className="px-3 py-4">
          <div className="flex flex-col gap-3">
            {recentlyAdded.map((item) => (
              <Card
                key={item.id}
                className="rounded-2xl border shadow-none bg-background"
              >
                <CardContent className="p-2 py-2 flex items-center gap-3 relative">
                  <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-muted shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0 pr-16">
                    <p className="text-xs font-semibold leading-snug line-clamp-1">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground mb-1">
                      {item.brand}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-bold text-emerald-700">
                        PKR {item.price.toLocaleString("en-PK")}
                      </span>
                      <span className="text-[10px] text-muted-foreground line-through">
                        PKR {item.originalPrice.toLocaleString("en-PK")}
                      </span>
                    </div>
                  </div>
                  <Badge className="absolute right-3 top-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-0 text-[9px] px-2 py-0.5">
                    {item.discount}% Off
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
