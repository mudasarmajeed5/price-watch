import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { WatchlistService } from "@/lib/services/watchlist.service";
import { PriceAlertRepository } from "@/lib/repositories/price-alert.repository";
import { AlertCircle, TrendingDown, TrendingUp, Laptop } from "lucide-react";
import Link from "next/link";
import { ObjectId } from "mongodb";

export const revalidate = 60; // Cache for 60 seconds

const formatPkrCompact = (value: number) =>
  new Intl.NumberFormat("en-PK", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

const formatPkrExact = (value: number) =>
  new Intl.NumberFormat("en-PK").format(value);

export default async function SavingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  try {
    const watchlistService = new WatchlistService();
    const alertRepo = new PriceAlertRepository();
    const userId = new ObjectId(session.user.id!);

    const watchlist = await watchlistService.getUserWatchlist(userId);

    // Total savings is the sum of (target - current) only for products already below target.
    const totalSavings = watchlist.reduce((sum, item) => {
      const targetPrice = item.targetPrice ?? 0;
      const latestPrice = item.latestPrice ?? 0;
      if (!targetPrice || latestPrice >= targetPrice) {
        return sum;
      }
      return sum + (targetPrice - latestPrice);
    }, 0);

    if (!watchlist || watchlist.length === 0) {
      return (
        <div className="min-h-screen bg-gray-50 px-4 py-8">
          <div className="max-w-lg mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-medium text-gray-900">
                Your Savings
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Watchlist &amp; price tracking
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-7 h-7 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                No products in your watchlist yet.
                <br />
                Start adding products to get price alerts.
              </p>
              <Link
                href="/add-product"
                className="inline-block mt-4 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Add a product →
              </Link>
            </div>
          </div>
        </div>
      );
    }

    const allAlerts = await alertRepo.getUserAlerts(userId);
    const productsWithAlerts = watchlist.filter((item) =>
      allAlerts.some((a) => a.productId.equals(item.productId)),
    ).length;

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-lg mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-medium text-gray-900">Your Savings</h1>
            <p className="text-sm text-gray-500 mt-1">
              Watchlist &amp; price tracking
            </p>
          </div>

          {/* Stats */}
          <div className="mb-6 space-y-2.5">
            <div className="bg-white rounded-2xl border border-violet-100 p-4">
              <p className="text-[11px] font-medium uppercase tracking-wider text-blue-500">
                Total Saved
              </p>
              <p className="mt-1 text-[28px] leading-tight font-semibold text-blue-700 break-words">
                PKR {formatPkrCompact(totalSavings)}
              </p>
              <p className="mt-1 text-[11px] text-gray-400">
                Exact: PKR {formatPkrExact(totalSavings)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
                <p className="text-2xl font-medium text-blue-600">
                  {watchlist.length}
                </p>
                <p className="text-[11px] text-gray-400 mt-1 leading-tight">
                  Products
                  <br />
                  watched
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
                <p className="text-2xl font-medium text-green-700">
                  {productsWithAlerts}
                </p>
                <p className="text-[11px] text-gray-400 mt-1 leading-tight">
                  Active
                  <br />
                  alerts
                </p>
              </div>
            </div>
          </div>

          {/* Section Label */}
          <p className="text-[11px] font-medium uppercase tracking-widest text-gray-400 mb-3">
            Watchlist
          </p>

          {/* Product Cards */}
          <div className="flex flex-col gap-2.5">
            {watchlist.map((item) => {
              const priceChange = (item.targetPrice || 0) - item.latestPrice;
              const isAboveTarget = item.latestPrice > (item.targetPrice || 0);
              const hasTarget = !!item.targetPrice;

              return (
                <div
                  key={item._id?.toString()}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
                >
                  {/* Top: image + title + badges */}
                  <div className="flex gap-3 p-3.5 pb-3">
                    <div className="w-16 h-16 rounded-xl border border-gray-100 bg-gray-50 shrink-0 overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Laptop className="w-7 h-7 text-gray-300" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item._id}`}
                        className="text-sm font-medium text-gray-900 leading-snug line-clamp-2 hover:text-blue-600 transition-colors"
                      >
                        {item.title}
                      </Link>
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        <span className="text-[11px] font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                          {item.store}
                        </span>
                        {item.discount && item.discount > 0 && (
                          <span className="text-[11px] font-medium bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                            {item.discount}% below target
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Prices row */}
                  <div
                    className={`grid border-t border-gray-100 ${
                      hasTarget ? "grid-cols-2" : "grid-cols-1"
                    }`}
                  >
                    <div
                      className={`px-3.5 py-2.5 ${hasTarget ? "border-r border-gray-100" : ""}`}
                    >
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">
                        Current price
                      </p>
                      <p className="text-base font-medium text-gray-900">
                        PKR {item.latestPrice.toLocaleString()}
                      </p>
                    </div>

                    {hasTarget && (
                      <div className="px-3.5 py-2.5">
                        <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">
                          Target price
                        </p>
                        <p className="text-base font-medium text-blue-600">
                          PKR {item.targetPrice!.toLocaleString()}
                        </p>
                        {isAboveTarget ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-red-500 mt-0.5">
                            <TrendingUp className="w-3 h-3" />
                            +PKR {Math.abs(priceChange).toLocaleString()}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-green-600 mt-0.5">
                            <TrendingDown className="w-3 h-3" />
                            −PKR {Math.abs(priceChange).toLocaleString()}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 border-t border-gray-100">
                    <Link
                      href={`/product/${item._id}`}
                      className="py-2.5 text-center text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors border-r border-gray-100"
                    >
                      View details
                    </Link>
                    <a
                      href={item.canonicalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 text-center text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                      Visit store
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading price results:", error);
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="max-w-lg mx-auto">
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
            <p className="text-sm text-red-600">
              Error loading price results. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }
}
