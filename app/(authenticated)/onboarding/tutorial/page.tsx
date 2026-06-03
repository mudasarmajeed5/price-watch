import { Play, TrendingDown, Bell } from "lucide-react";

export default function WatchTutorialPage() {
  return (
    <main className="min-h-dvh overflow-hidden bg-[#f8f9ff] px-6 py-6 text-[#0f3d2e]">
      <div className="mx-auto flex h-full w-full max-w-sm flex-col">
        <section className="flex flex-1 flex-col select-none">
          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#0f6b4a] mb-4 mt-2">
              <div className="h-2 w-2 rounded-full bg-[#0f6b4a]" />
              Quick Start Guide
            </div>

            <h1 className="text-2xl font-bold text-[#0f3d2e] mb-2">
              Learn Bachat in 30 Seconds
            </h1>
            <p className="text-sm text-[#6a7d76] mb-6">
              See how smart price tracking can save you money every time you
              shop - without the hassle.
            </p>

            <div className="relative w-full h-50 rounded-xl overflow-hidden bg-linear-to-br from-[#0f6b4a] to-[#0a4a35] aspect-square shadow-2xl shadow-black/30 mb-6 flex items-center justify-center group">
              <div className="absolute top-4 left-4 bg-[#0a4a35]/80 text-white text-xs font-semibold px-2 py-1 rounded-lg z-10">
                ↓ 23% Drop
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                  <Play className="w-6 h-6 text-white fill-white" />
                </div>
                <div className="text-center">
                  <p className="text-white font-medium text-sm">
                    Watch How It Works
                  </p>
                  <p className="text-white/70 text-xs mt-1">0:30 tutorial</p>
                </div>
              </div>

              <div className="absolute bottom-4 right-4 bg-[#0f8c5e] text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
                ⚡ Rs 840 Saved
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex gap-3 p-3 rounded-lg bg-white/50 w-full text-left">
                <TrendingDown className="w-5 h-5 text-[#0f6b4a] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-[#0f3d2e]">
                    Track Prices
                  </h3>
                  <p className="text-xs text-[#6a7d76]">
                    Monitor price history across hundreds of stores in real
                    time.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-3 rounded-lg bg-white/50 w-full text-left">
                <Bell className="w-5 h-5 text-[#0f6b4a] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-[#0f3d2e]">
                    Price Drop Alert
                  </h3>
                  <p className="text-xs text-[#6a7d76]">
                    Get notified the moment a product hits your target price.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-auto pb-2">
              <button
                type="button"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white text-[#1f2937] border border-gray-300 px-6 py-3 text-sm font-semibold shadow-[0_6px_14px_rgba(15,107,74,0.18)]"
              >
                <Play className="w-4 h-4 text-gray-500 fill-gray-500" />
                Watch Tutorial
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
