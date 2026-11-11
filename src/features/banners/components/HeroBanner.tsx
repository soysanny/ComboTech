"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { useBanners } from "../hooks/useBanners";
import type { Banner } from "@/features/admin/types";

const AUTOPLAY_MS = 8000;
const SWIPE_THRESHOLD = 50;

function bannerHref(banner: Banner) {
  const raw = banner.linkUrl?.trim();
  if (!raw) return ROUTES.products;
  if (raw.startsWith("/") || /^https?:\/\//i.test(raw)) return raw;
  return `/${raw}`;
}

function isExternal(href: string) {
  return /^https?:\/\//i.test(href);
}

function DefaultHero() {
  return (
    <section className="banner-gradient relative overflow-hidden rounded-2xl border border-white/20 px-6 py-14 text-white shadow-[0_40px_120px_-50px_rgba(2,6,23,1)] sm:px-12 sm:py-20">
      <div className="relative z-10 max-w-2xl">
        <Badge className="mb-5 border-white/20 bg-white/10 text-white backdrop-blur-sm">
          New arrivals available
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
          Build your dream setup today
        </h1>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-white/80 sm:text-lg">
          Premium computers, laptops, components, and gaming gear with honest
          pricing and local warranty support.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button
            asChild
            size="lg"
            className="bg-white text-slate-900 hover:bg-white/90"
          >
            <Link href={ROUTES.products}>
              Shop now
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
          >
            <Link href={ROUTES.products}>View deals</Link>
          </Button>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="bg-primary/30 absolute top-0 right-0 h-96 w-96 translate-x-1/3 -translate-y-1/3 rounded-full blur-3xl" />
        <div className="bg-accent/30 absolute bottom-0 left-0 h-80 w-80 -translate-x-1/3 translate-y-1/3 rounded-full blur-3xl" />
      </div>
    </section>
  );
}

function HeroSkeleton() {
  return (
    <section
      aria-hidden
      className="bg-muted relative aspect-[4/3] w-full animate-pulse overflow-hidden rounded-2xl sm:aspect-[16/7] lg:aspect-[16/6]"
    >
      <div className="absolute inset-x-0 bottom-0 space-y-3 p-5 sm:p-8">
        <div className="bg-foreground/10 h-5 w-24 rounded-full" />
        <div className="bg-foreground/10 h-7 w-2/3 rounded-lg sm:h-10" />
        <div className="bg-foreground/10 h-4 w-1/2 rounded-lg" />
      </div>
    </section>
  );
}

function HeroError({ refetch }: { refetch: () => void }) {
  return (
    <section className="relative flex min-h-[260px] flex-col items-center justify-center overflow-hidden rounded-2xl bg-[linear-gradient(135deg,oklch(0.35_0.04_10),oklch(0.30_0.08_20))] px-6 py-14 text-center text-white shadow-lg sm:min-h-[380px]">
      <h2 className="text-2xl font-bold">Could not load banners</h2>
      <p className="mt-2 text-white/70">
        Something went wrong while loading the homepage banner.
      </p>
      <Button
        onClick={refetch}
        variant="outline"
        size="sm"
        className="mt-5 border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
      >
        <RefreshCw className="mr-2 size-4" />
        Retry
      </Button>
    </section>
  );
}

interface DragState {
  startX: number;
  startY: number;
  lastDx: number;
  moved: boolean;
}

function BannerCarousel({ banners }: { banners: Banner[] }) {
  const total = banners.length;
  // Physical track includes a clone of the last slide before the real slides
  // and a clone of the first slide after them, so looping never jumps.
  const loopEnabled = total > 1;
  const [position, setPosition] = useState(loopEnabled ? 1 : 0);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragRef = useRef<DragState | null>(null);
  const suppressClickRef = useRef(false);
  const prefersReducedMotion = useMediaQuery(
    "(prefers-reduced-motion: reduce)",
  );

  const current = loopEnabled ? (((position - 1) % total) + total) % total : 0;

  const goTo = useCallback(
    (index: number) => {
      setAnimate(true);
      setPosition((((index % total) + total) % total) + 1);
    },
    [total],
  );
  const next = useCallback(() => {
    setAnimate(true);
    setPosition((value) => value + 1);
  }, []);
  const previous = useCallback(() => {
    setAnimate(true);
    setPosition((value) => value - 1);
  }, []);

  useEffect(() => {
    if (total <= 1 || paused || prefersReducedMotion) return;
    const timer = window.setTimeout(next, AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [position, paused, total, next, prefersReducedMotion]);

  const handleTransitionEnd = (
    event: React.TransitionEvent<HTMLDivElement>,
  ) => {
    if (event.target !== event.currentTarget || !animate) return;

    if (position === total + 1) {
      setAnimate(false);
      setPosition(1);
    } else if (position === 0) {
      setAnimate(false);
      setPosition(total);
    }
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    // Reference behaviour: touch/pen swipe is supported, mouse dragging is not.
    if (total <= 1 || event.pointerType === "mouse") return;
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      lastDx: 0,
      moved: false,
    };
    suppressClickRef.current = false;
    setPaused(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;

    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;

    if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
      drag.moved = true;
      drag.lastDx = dx;
      suppressClickRef.current = true;
      setDragOffset(dx);
    }
  };

  const finishDrag = () => {
    const drag = dragRef.current;
    if (!drag) return;

    dragRef.current = null;
    setDragOffset(0);
    setPaused(false);

    if (Math.abs(drag.lastDx) >= SWIPE_THRESHOLD) {
      if (drag.lastDx < 0) next();
      else previous();
    }
  };

  const handleClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClickRef.current = false;
  };

  const slides = loopEnabled
    ? [banners[total - 1], ...banners, banners[0]]
    : banners;

  return (
    <section
      className="group/hero relative"
      aria-roledescription="carousel"
      aria-label="Featured promotions"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setPaused(false);
        }
      }}
    >
      <div
        className="surface-glass relative aspect-[4/3] touch-pan-y overflow-hidden rounded-3xl sm:aspect-[16/7] lg:aspect-[16/6]"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
      >
        <div
          className={cn(
            "flex h-full w-full",
            !animate || dragOffset !== 0
              ? "transition-none"
              : "transition-transform duration-500 ease-out",
          )}
          style={{
            transform: `translate3d(calc(${-position * 100}% + ${dragOffset}px), 0, 0)`,
          }}
          onClickCapture={handleClickCapture}
          onTransitionEnd={handleTransitionEnd}
        >
          {slides.map((banner, physicalIndex) => {
            const index = loopEnabled
              ? physicalIndex === 0
                ? total - 1
                : physicalIndex === total + 1
                  ? 0
                  : physicalIndex - 1
              : physicalIndex;
            const isClone =
              loopEnabled &&
              (physicalIndex === 0 || physicalIndex === total + 1);
            const href = bannerHref(banner);
            const slide = (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  decoding="async"
                  draggable={false}
                />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-start gap-3 p-5 text-white sm:p-8 lg:p-10">
                  <span className="line-clamp-2 max-w-xl text-lg font-bold tracking-tight drop-shadow-sm sm:text-2xl lg:text-3xl">
                    {banner.title}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-900 shadow-sm sm:text-sm">
                    Shop now
                    <ArrowRight className="size-3.5" />
                  </span>
                </span>
              </>
            );

            return (
              <div
                key={`${banner.id}-${physicalIndex}`}
                className="relative h-full w-full shrink-0"
                aria-hidden={isClone || index !== current}
              >
                {isExternal(href) ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="block h-full w-full"
                    aria-label={banner.title}
                    tabIndex={isClone || index !== current ? -1 : undefined}
                  >
                    {slide}
                  </a>
                ) : (
                  <Link
                    href={href}
                    className="block h-full w-full"
                    aria-label={banner.title}
                    tabIndex={isClone || index !== current ? -1 : undefined}
                  >
                    {slide}
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={previous}
              aria-label="Previous slide"
              className="absolute top-1/2 left-3 z-20 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 opacity-0 shadow-md backdrop-blur transition-all group-hover/hero:opacity-100 hover:bg-white focus-visible:opacity-100 sm:flex"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next slide"
              className="absolute top-1/2 right-3 z-20 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 opacity-0 shadow-md backdrop-blur transition-all group-hover/hero:opacity-100 hover:bg-white focus-visible:opacity-100 sm:flex"
            >
              <ChevronRight className="size-5" />
            </button>

            <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-2 py-1.5 backdrop-blur-md">
              {banners.map((banner, index) => (
                <button
                  key={banner.id}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={index === current ? "true" : undefined}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    index === current
                      ? "w-6 bg-white"
                      : "w-1.5 bg-white/60 hover:bg-white/90",
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

/** M.Video-style homepage hero: contained, rounded, autoplaying slider. */
export function HeroBanner() {
  const { data: banners, isLoading, isError, refetch } = useBanners("homepage");

  if (isLoading) return <HeroSkeleton />;
  if (isError) return <HeroError refetch={refetch} />;
  if (!banners || banners.length === 0) return <DefaultHero />;

  return <BannerCarousel banners={banners} />;
}
