"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, Play, TrendingDown, Bell } from "lucide-react";

const slides = [
  {
    type: "intro",
    title: "Learn Bachat in 30 Seconds",
    description:
      "See how smart price tracking can save you money every time you shop — without the hassle.",
  },
  {
    type: "image",
    title: "Track Prices Automatically",
    description:
      "Set it and forget it. We monitor prices across your favorite brands like Outfitters and BreakOut, so you never miss a deal.",
    image: "/images/image_1.avif",
    indicator: "left",
  },
  {
    type: "image",
    title: "Smart Price Alerts",
    description:
      "Set your target price and relax. We'll send you an instant notification the moment your favorite product hits your budget.",
    image: "/images/image_2.jpg",
    indicator: "right",
  },
];

export default function OnboardingPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const slide = slides[activeIndex];
  const startX = useRef<number | null>(null);
  const router = useRouter();

  const goToSlide = (index: number) => {
    if (index >= slides.length) {
      router.push("/add-product");
      return;
    }
    const nextIndex = Math.max(0, Math.min(index, slides.length - 1));
    setDirection(nextIndex > activeIndex ? "next" : "prev");
    setActiveIndex(nextIndex);
  };

  const handleStart = (clientX: number) => {
    startX.current = clientX;
  };

  const handleEnd = (clientX: number) => {
    if (startX.current === null) return;
    const deltaX = clientX - startX.current;
    if (deltaX > 20) {
      goToSlide(activeIndex - 1);
    } else if (deltaX < -20) {
      goToSlide(activeIndex + 1);
    }
    startX.current = null;
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    handleStart(event.touches[0]?.clientX ?? 0);
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    handleEnd(event.changedTouches[0]?.clientX ?? 0);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    handleStart(event.clientX);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    handleEnd(event.clientX);
  };

  return (
    <main
      className="h-dvh overflow-hidden bg-[#f8f9ff] px-6 py-8 text-[#0f3d2e]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <div className="mx-auto flex h-full w-full max-w-sm flex-col">
        <section className="flex flex-1 flex-col select-none">
          {/* Header: Back (when applicable) + Skip */}
          <div className="flex items-center justify-between pb-10 text-sm font-medium text-[#7a8a83]">
            {activeIndex > 0 ? (
              <button
                type="button"
                onClick={() => goToSlide(activeIndex - 1)}
                className="text-sm text-[#7a8a83] pl-1"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            <div
              className="cursor-pointer pr-1"
              onClick={() => router.push("/add-product")}
            >
              Skip
            </div>
          </div>

          {/* Slide content */}
          <div
            key={activeIndex}
            className={`transition-all duration-300 ease-out animate-in fade-in ${
              direction === "next"
                ? "slide-in-from-right-3"
                : "slide-in-from-left-3"
            }`}
          >
            {slide.type === "intro" ? (
              // Intro slide
              <div className="flex flex-col flex-1">
                {/* Badge */}
                <div className="flex items-center gap-2 text-xs font-semibold text-[#0f6b4a] mb-4">
                  <div className="h-2 w-2 rounded-full bg-[#0f6b4a]" />
                  Quick Start Guide
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-[#0f3d2e] mb-2">
                  {slide.title}
                </h1>
                <p className="text-sm text-[#6a7d76] mb-6">
                  {slide.description}
                </p>

                {/* Video Card */}
                <div className="relative w-full h-50 rounded-xl overflow-hidden bg-linear-to-br from-[#0f6b4a] to-[#0a4a35] aspect-square shadow-2xl shadow-black/30 mb-6 flex items-center justify-center group cursor-pointer">
                  {/* Drop indicator */}
                  <div className="absolute top-4 left-4 bg-[#0a4a35]/80 text-white text-xs font-semibold px-2 py-1 rounded-lg z-10">
                    ↓ 23% Drop
                  </div>

                  {/* Play button */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <Play className="w-6 h-6 text-white fill-white" />
                    </div>
                    <div className="text-center">
                      <p className="text-white font-medium text-sm">
                        Watch How It Works
                      </p>
                      <p className="text-white/70 text-xs mt-1">
                        0:30 tutorial
                      </p>
                    </div>
                  </div>

                  {/* Savings badge */}
                  <div className="absolute bottom-4 right-4 bg-[#0f8c5e] text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
                    ⚡ Rs 840 Saved
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {/* Track Prices */}
                  <button
                    type="button"
                    onClick={() => goToSlide(1)}
                    className="flex gap-3 p-3 rounded-lg bg-white/50 w-full text-left"
                    aria-label="Go to Track Prices slide"
                  >
                    <TrendingDown className="w-5 h-5 text-[#0f6b4a] flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-[#0f3d2e]">
                        Track Prices
                      </h3>
                      <p className="text-xs text-[#6a7d76]">
                        Monitor price history across hundreds of stores in real
                        time.
                      </p>
                    </div>
                  </button>

                  {/* Price Drop Alert */}
                  <button
                    type="button"
                    onClick={() => goToSlide(2)}
                    className="flex gap-3 p-3 rounded-lg bg-white/50 w-full text-left"
                    aria-label="Go to Price Drop Alert slide"
                  >
                    <Bell className="w-5 h-5 text-[#0f6b4a] flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-[#0f3d2e]">
                        Price Drop Alert
                      </h3>
                      <p className="text-xs text-[#6a7d76]">
                        Get notified the moment a product hits your target
                        price.
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              // Image slides
              <>
                {/* Square card with black drop shadow */}
                <div className="relative w-full overflow-hidden rounded-xl aspect-square shadow-2xl shadow-black/50">
                  <Image
                    src={slide.image ? slide.image : "/images/placeholder.png"}
                    alt={slide.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 384px"
                    className="object-cover"
                    style={{
                      boxShadow: "inset 0 0 25px rgba(0, 0, 0, 0.2)",
                      border: "1px solid rgba(0, 0, 0, 0.1)",
                    }}
                    priority
                  />
                </div>

                {/* Text */}
                <div className="mt-8 text-center">
                  <h1 className="text-xl font-semibold text-[#16211b]">
                    {slide.title}
                  </h1>
                  <p className="mt-3 text-sm leading-relaxed text-[#6a7d76]">
                    {slide.description}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Indicators */}
          <div className="mt-6 flex items-center justify-center gap-2">
            {slides.map((_, index) => (
              <button
                key={`indicator-${index}`}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => goToSlide(index)}
                className={`h-1.5 w-6 rounded-full transition-all ${
                  index === activeIndex ? "bg-[#0f6b4a]" : "bg-[#d5e1db]"
                }`}
              />
            ))}
          </div>
        </section>

        {/* CTA Button */}
        <div className="mt-auto pt-6">
          {activeIndex === 0 && (
            <button
              type="button"
              onClick={() => {
                /* TODO: open tutorial modal or navigate to tutorial */
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white text-black border border-gray-200 px-6 py-3 text-sm font-semibold mb-3"
            >
              <Play className="w-4 h-4" />
              Watch Tutorial
            </button>
          )}

          <button
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f6b4a] px-6 py-3 text-sm font-semibold text-white"
            onClick={() => goToSlide(activeIndex + 1)}
          >
            {activeIndex === 0
              ? "Get Started"
              : activeIndex === 1
                ? "Continue"
                : "Finish"}
            <span aria-hidden="true">
              <ArrowRight className="w-4 h-4" />
            </span>
          </button>
        </div>
      </div>
    </main>
  );
}
