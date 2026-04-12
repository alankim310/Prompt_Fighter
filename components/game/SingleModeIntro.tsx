"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SingleIntroSlide } from "@/lib/game/types";

export function SingleModeIntro({
  slides,
}: {
  slides: SingleIntroSlide[];
}) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSlide = slides[currentIndex];
  const isFirstSlide = currentIndex === 0;
  const isLastSlide = currentIndex === slides.length - 1;

  function handleBack() {
    if (isFirstSlide) {
      return;
    }

    setCurrentIndex((index) => index - 1);
  }

  function handleNext() {
    if (isLastSlide) {
      router.push("/single");
      return;
    }

    setCurrentIndex((index) => index + 1);
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#050406] text-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={currentSlide.id}
        src={currentSlide.imageUrl}
        alt={currentSlide.title}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,3,7,0.2)_0%,rgba(4,3,7,0.42)_36%,rgba(4,3,7,0.88)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,208,102,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(120,61,255,0.12),transparent_22%)]" />

      <div className="relative z-10 flex min-h-screen flex-col px-4 py-4 sm:px-6 sm:py-6">
        <div className="flex items-start justify-between gap-4">
          <div className="rounded-full border border-white/10 bg-black/35 px-4 py-2 text-sm font-semibold text-zinc-100 backdrop-blur-md">
            Intro {currentIndex + 1} / {slides.length}
          </div>

          <Link
            href="/single"
            className="rounded-full border border-amber-300/50 bg-amber-300 px-5 py-2.5 text-sm font-black uppercase tracking-[0.2em] text-black shadow-[0_10px_30px_rgba(251,191,36,0.35)] transition hover:bg-amber-200"
          >
            Skip Intro
          </Link>
        </div>

        <div className="flex flex-1 items-end py-6 sm:py-10">
          <div className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-black/45 p-6 shadow-[0_24px_90px_rgba(0,0,0,0.5)] backdrop-blur-md sm:p-8">
            <div className="text-[11px] uppercase tracking-[0.35em] text-amber-200/75">
              Story Prelude
            </div>
            <h1 className="mt-4 text-4xl font-black leading-tight text-white sm:text-5xl">
              {currentSlide.title}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-zinc-100 sm:text-lg">
              {currentSlide.body}
            </p>

            <div className="mt-8 flex items-center gap-2">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`h-2.5 rounded-full transition-all ${
                    index === currentIndex
                      ? "w-10 bg-amber-300"
                      : "w-2.5 bg-white/30"
                  }`}
                />
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleBack}
                disabled={isFirstSlide}
                className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-zinc-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/5 disabled:text-zinc-500"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="rounded-full border border-emerald-300/30 bg-emerald-300 px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-emerald-950 shadow-[0_10px_30px_rgba(110,231,183,0.28)] transition hover:bg-emerald-200"
              >
                {isLastSlide ? "Enter Chapter Map" : "Next"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
