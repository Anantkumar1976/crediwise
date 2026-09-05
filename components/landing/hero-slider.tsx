"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";

interface HeroSlide {
  id: string;
  src: string;
  alt: string;
  headline: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  ctaAriaLabel: string;
}

const SLIDES: HeroSlide[] = [
  {
    id: "journey",
    src: "/images/crediwise/crediwise-financial-journey-banner.png",
    alt: "A young professional reviews options on a phone at a laptop, with a compare-apply-track path illustrated beside him.",
    headline: "Your Financial Journey Made Simple",
    description: "Compare. Apply. Track. All in one place.",
    ctaLabel: "Get Started",
    ctaHref: "/auth/sign-up",
    ctaAriaLabel: "Get started with CrediWise",
  },
  {
    id: "home",
    src: "/images/crediwise/crediwise-home-loan-banner.png",
    alt: "A smiling Indian family sitting together in a sunlit living room after moving into a new home.",
    headline: "Home Loans for a Brighter Future",
    description:
      "Compare top lenders, get the best rates, and make your dream home a reality.",
    ctaLabel: "Explore Home Loans",
    ctaHref: "/auth/sign-up",
    ctaAriaLabel: "Explore home loans and create an account",
  },
  {
    id: "car",
    src: "/images/crediwise/crediwise-car-loan-banner.png",
    alt: "A confident young man leaning on a car against a bright city skyline.",
    headline: "Car Loans That Move You Forward",
    description: "Compare offers, get better rates, and hit the road with confidence.",
    ctaLabel: "Explore Car Loans",
    ctaHref: "/auth/sign-up",
    ctaAriaLabel: "Explore car loans and create an account",
  },
  {
    id: "personal",
    src: "/images/crediwise/crediwise-personal-loan-banner.png",
    alt: "A smiling young woman holding a laptop outdoors, with icons for education, healthcare, travel, and shopping.",
    headline: "Personal Loans for Life’s Possibilities",
    description:
      "For education, healthcare, travel, weddings and more. Find the right loan, right now.",
    ctaLabel: "Explore Personal Loans",
    ctaHref: "/auth/sign-up",
    ctaAriaLabel: "Explore personal loans and create an account",
  },
];

const AUTOPLAY_MS = 5000;
const SWIPE_THRESHOLD = 48;

function SlideCopy({
  slide,
  headingId,
}: {
  slide: HeroSlide;
  headingId: string;
}) {
  return (
    <div className="flex w-full max-w-[28rem] flex-col items-start">
      <h1
        id={headingId}
        className="text-[1.75rem] font-bold leading-tight tracking-tight text-[#0A2540] sm:text-[2rem] md:text-[2.625rem] md:leading-[1.15] lg:text-[3.15rem]"
      >
        {slide.headline}
      </h1>
      <p className="mt-3 max-w-[450px] text-base leading-relaxed text-[#3D4F63] md:mt-4 md:text-[1.0625rem]">
        {slide.description}
      </p>
      <Link
        href={slide.ctaHref}
        aria-label={slide.ctaAriaLabel}
        className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#00A88E] px-7 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-[#00957D] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A88E] active:scale-[0.98] sm:w-auto md:mt-6"
      >
        {slide.ctaLabel}
      </Link>
    </div>
  );
}

function ArrowIcon({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      {direction === "prev" ? (
        <path
          fillRule="evenodd"
          d="M12.79 4.22a.75.75 0 010 1.06L8.06 10l4.73 4.72a.75.75 0 11-1.06 1.06l-5.25-5.25a.75.75 0 010-1.06l5.25-5.25a.75.75 0 011.06 0z"
          clipRule="evenodd"
        />
      ) : (
        <path
          fillRule="evenodd"
          d="M7.21 15.78a.75.75 0 010-1.06L11.94 10 7.21 5.28a.75.75 0 111.06-1.06l5.25 5.25a.75.75 0 010 1.06l-5.25 5.25a.75.75 0 01-1.06 0z"
          clipRule="evenodd"
        />
      )}
    </svg>
  );
}

export function HeroSlider() {
  const headingId = useId();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const interactionEpoch = useRef(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const goTo = useCallback((nextIndex: number, fromUser = false) => {
    const count = SLIDES.length;
    setIndex(((nextIndex % count) + count) % count);
    if (fromUser) {
      interactionEpoch.current += 1;
      setPaused(false);
    }
  }, []);

  const goNext = useCallback((fromUser = false) => {
    goTo(index + 1, fromUser);
  }, [goTo, index]);

  const goPrev = useCallback((fromUser = false) => {
    goTo(index - 1, fromUser);
  }, [goTo, index]);

  useEffect(() => {
    if (reduceMotion || paused) return;
    const epoch = interactionEpoch.current;
    const timer = window.setTimeout(() => {
      if (interactionEpoch.current !== epoch) return;
      setIndex((current) => (current + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [index, paused, reduceMotion]);

  const onTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start == null) return;
    const delta = event.changedTouches[0].clientX - start;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    if (delta < 0) goNext(true);
    else goPrev(true);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goNext(true);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goPrev(true);
    }
  };

  const active = SLIDES[index];

  return (
    <section
      id="about"
      className="relative scroll-mt-24 overflow-x-clip bg-white"
      aria-roledescription="carousel"
      aria-label="CrediWise loan highlights"
      onKeyDown={onKeyDown}
    >
      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setPaused(false);
          }
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 md:aspect-[247/100]">
          {SLIDES.map((slide, slideIndex) => {
            const isActive = slideIndex === index;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 ${
                  reduceMotion ? "" : "transition-opacity duration-500 ease-out"
                } ${isActive ? "opacity-100" : "opacity-0"}`}
              >
                <Image
                  src={slide.src}
                  alt={isActive ? slide.alt : ""}
                  fill
                  preload={slideIndex === 0}
                  sizes="100vw"
                  className="object-cover object-[72%_center] md:object-[78%_center]"
                />
              </div>
            );
          })}

          <div
            className="pointer-events-none absolute inset-y-0 left-0 hidden w-[54%] bg-gradient-to-r from-white from-[12%] via-white/80 via-[42%] to-transparent md:block"
            aria-hidden
          />

          <div className="absolute inset-y-0 left-0 hidden w-[40%] min-w-[17.5rem] max-w-[42%] items-center px-8 md:flex lg:px-12 xl:px-16">
            <SlideCopy slide={active} headingId={`${headingId}-desktop`} />
          </div>

          <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 hidden -translate-y-1/2 justify-between px-3 md:flex lg:px-5">
            <button
              type="button"
              onClick={() => goPrev(true)}
              className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/70 text-[#0A2540] shadow-sm backdrop-blur-sm transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A88E]"
              aria-label="Previous slide"
            >
              <ArrowIcon direction="prev" />
            </button>
            <button
              type="button"
              onClick={() => goNext(true)}
              className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/70 text-[#0A2540] shadow-sm backdrop-blur-sm transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A88E]"
              aria-label="Next slide"
            >
              <ArrowIcon direction="next" />
            </button>
          </div>

          <div className="absolute bottom-4 left-0 right-0 z-10 hidden justify-center md:flex">
            <div
              className="flex items-center gap-2 rounded-full bg-white/70 px-2.5 py-1.5 shadow-sm backdrop-blur-sm"
              role="tablist"
              aria-label="Choose slide"
            >
              {SLIDES.map((slide, slideIndex) => {
                const selected = slideIndex === index;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-label={`Show slide ${slideIndex + 1}: ${slide.headline}`}
                    onClick={() => goTo(slideIndex, true)}
                    className={`h-2.5 rounded-full transition ${
                      selected ? "w-7 bg-[#00A88E]" : "w-2.5 bg-[#0A2540]/25 hover:bg-[#0A2540]/45"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-b border-slate-200/80 bg-white px-5 py-7 md:hidden">
          <SlideCopy slide={active} headingId={`${headingId}-mobile`} />
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => goPrev(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-[#0A2540] transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A88E]"
              aria-label="Previous slide"
            >
              <ArrowIcon direction="prev" />
            </button>
            <div className="flex items-center gap-2" role="tablist" aria-label="Choose slide">
              {SLIDES.map((slide, slideIndex) => {
                const selected = slideIndex === index;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-label={`Show slide ${slideIndex + 1}: ${slide.headline}`}
                    onClick={() => goTo(slideIndex, true)}
                    className={`h-2.5 rounded-full transition ${
                      selected ? "w-7 bg-[#00A88E]" : "w-2.5 bg-[#0A2540]/25"
                    }`}
                  />
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => goNext(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-[#0A2540] transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A88E]"
              aria-label="Next slide"
            >
              <ArrowIcon direction="next" />
            </button>
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        Slide {index + 1} of {SLIDES.length}: {active.headline}
      </p>
    </section>
  );
}
