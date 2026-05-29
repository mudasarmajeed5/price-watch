"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const slides = [
  {
    title: "Track Prices Automatically",
    description:
      "Set it and forget it. We monitor prices across your favorite brands like Outfitters and BreakOut, so you never miss a deal.",
    image: "/images/image_1.avif",
    indicator: "left",
  },
  {
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
          {/* Skip */}
          <div
            className="flex items-center justify-end pb-10 text-sm font-medium text-[#7a8a83] cursor-pointer pr-1"
            onClick={() => router.push("/add-product")}
          >
            Skip
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
            {/* Square card with black drop shadow */}
            <div className="relative w-full overflow-hidden rounded-xl aspect-square shadow-2xl shadow-black/50">
              <Image
                src={slide.image}
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
          <button
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f6b4a] px-6 py-3 text-sm font-semibold text-white"
            onClick={() => goToSlide(activeIndex + 1)}
          >
            {activeIndex === 0 ? "Get Started" : "Continue"}
            <span aria-hidden="true">
              <ArrowRight className="w-4 h-4" />
            </span>
          </button>
        </div>
      </div>
    </main>
  );
}