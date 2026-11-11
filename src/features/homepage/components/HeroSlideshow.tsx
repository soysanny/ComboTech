"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Computer,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { useBanners } from "@/features/banners";
import { isLocalImageUrl } from "../lib/imageUrl";
import type { Banner } from "@/features/admin/types";

const AUTOPLAY_INTERVAL = 7000;

function HeroCopy({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn("max-w-lg", compact && "max-w-md")}>
      <p className="text-[10px] font-semibold tracking-[0.18em] text-white/70 uppercase sm:text-[11px]">
        CamboTech · Phnom Penh
      </p>
      <h1 className="mt-2 text-balance text-[1.55rem] leading-tight font-bold sm:text-3xl lg:text-[2.1rem]">
        Computers, components &amp; accessories
      </h1>
      <p className="mt-2 line-clamp-2 max-w-md text-sm leading-relaxed text-white/80 sm:text-[15px]">
        Laptops, desktops, PC parts and accessories from ASUS, Dell, Acer, Lenovo,
        Apple and more.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2.5 sm:mt-5">
        <Button
          asChild
          size="sm"
          className="bg-white text-slate-900 hover:bg-white/90"
        >
          <Link href={ROUTES.products}>
            Shop computers
            <ArrowRight className="size-4" />
          </Link>
        </Button>
        <Button
          asChild
          size="sm"
          variant="outline"
          className="hidden border-white/35 bg-white/5 text-white hover:bg-white/15 hover:text-white sm:inline-flex"
        >
          <Link href={ROUTES.contact}>Contact to order</Link>
        </Button>
      </div>
    </div>
  );
}

function DefaultHero() {
  return (
    <section className="text-foreground relative h-[280px] overflow-hidden rounded-xl bg-slate-900 text-white sm:h-[320px] lg:h-[348px]">
      <div className="bg-primary/20 absolute inset-y-0 right-0 w-1/2 blur-3xl" />
      <div className="absolute inset-0 opacity-40">
        <div className="flex h-full items-center justify-end pr-10 sm:pr-16">
          <Computer className="size-40 text-white/10 sm:size-56" strokeWidth={1} />
        </div>
      </div>
      <div className="relative z-10 flex h-full items-center px-5 py-6 sm:px-8 lg:px-10">
        <HeroCopy />
      </div>
    </section>
  );
}

function HeroSkeleton() {
  return (
    <div
      className="bg-muted h-[280px] animate-pulse rounded-xl sm:h-[320px] lg:h-[348px]"
      aria-hidden
    >
      <div className="flex h-full flex-col justify-center gap-3 px-6 sm:px-8">
        <div className="bg-muted-foreground/15 h-3 w-32 rounded-full" />
        <div className="bg-muted-foreground/15 h-8 w-3/4 rounded-lg" />
        <div className="bg-muted-foreground/10 h-4 w-2/3 rounded" />
        <div className="bg-muted-foreground/15 mt-2 h-9 w-32 rounded-lg" />
      </div>
    </div>
  );
}

function HeroError({ refetch }: { refetch: () => void }) {
  return (
    <div className="bg-muted/40 flex h-[280px] flex-col items-center justify-center rounded-xl border border-dashed px-6 text-center sm:h-[320px] lg:h-[348px]">
      <p className="text-sm font-semibold">Could not load the slideshow</p>
      <p className="text-muted-foreground mt-1 text-xs">
        Please try again in a moment.
      </p>
      <Button variant="outline" size="sm" className="mt-4" onClick={refetch}>
        <RefreshCw className="size-4" />
        Retry
      </Button>
    </div>
  );
}

function BrandedFallback() {
  return (
    <div className="flex h-full w-full items-center justify-between bg-slate-900 px-8 text-white">
      <div>
        <p className="text-[11px] font-semibold tracking-[0.18em] uppercase opacity-60">
          CamboTech
        </p>
        <p className="mt-2 max-w-sm text-lg font-semibold">
          Featured promotion
        </p>
      </div>
      <Computer className="size-24 opacity-10" />
    </div>
  );
}

function BannerSlideshow({ banners }: { banners: Banner[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const total = banners.length;

  const goTo = useCallback(
    (index: number) => {
      if (total === 0) return;
      setCurrent(((index % total) + total) % total);
    },
    [total],
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (total <= 1 || paused || reducedMotion) return;
    const timer = window.setInterval(() => {
      setCurrent((previous) => (previous + 1) % total);
    }, AUTOPLAY_INTERVAL);
    return () => window.clearInterval(timer);
  }, [total, paused, reducedMotion, current]);

  const handleTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    if (touch) touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    const start = touchStart.current;
    const end = event.changedTouches[0];
    touchStart.current = null;
    if (!start || !end) return;
    const deltaX = end.clientX - start.x;
    const deltaY = end.clientY - start.y;
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      goTo(current + (deltaX < 0 ? 1 : -1));
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(current - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(current + 1);
    }
  };

  const activeBanner = banners[current];

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured promotions"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="bg-foreground relative h-[280px] touch-pan-y overflow-hidden rounded-xl border border-white/10 text-white outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 sm:h-[320px] lg:h-[348px]"
    >
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          aria-hidden={index !== current}
          className={cn(
            "absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none",
            index === current ? "opacity-100" : "opacity-0",
          )}
        >
          {banner.imageUrl && !failed[banner.id] ? (
            isLocalImageUrl(banner.imageUrl) ? (
              <Image
                src={banner.imageUrl}
                alt={index === current ? banner.title : ""}
                fill
                preload={index === 0}
                sizes="(max-width: 1024px) 100vw, 82vw"
                className="object-cover"
                onError={() =>
                  setFailed((previous) => ({ ...previous, [banner.id]: true }))
                }
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={banner.imageUrl}
                alt={index === current ? banner.title : ""}
                className="h-full w-full object-cover"
                onError={() =>
                  setFailed((previous) => ({ ...previous, [banner.id]: true }))
                }
              />
            )
          ) : (
            <BrandedFallback />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/10" />
        </div>
      ))}

      <div className="relative z-10 flex h-full items-center px-5 py-6 sm:px-8 lg:px-10">
        <HeroCopy />
      </div>

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(current - 1)}
            aria-label="Previous slide"
            className="absolute top-1/2 left-3 z-20 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/25 text-white backdrop-blur transition-colors hover:bg-black/45 sm:flex"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => goTo(current + 1)}
            aria-label="Next slide"
            className="absolute top-1/2 right-3 z-20 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/25 text-white backdrop-blur transition-colors hover:bg-black/45 sm:flex"
          >
            <ChevronRight className="size-4" />
          </button>

          <div className="absolute bottom-4 left-5 z-20 flex items-center gap-1.5 sm:left-10">
            {banners.map((banner, index) => (
              <button
                key={banner.id}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === current}
                className={cn(
                  "h-1.5 rounded-full transition-all motion-reduce:transition-none",
                  index === current
                    ? "w-5 bg-white"
                    : "w-1.5 bg-white/45 hover:bg-white/75",
                )}
              />
            ))}
          </div>
        </>
      )}

      <span className="sr-only" aria-live="polite">
        {activeBanner ? `Slide ${current + 1} of ${total}` : ""}
      </span>
    </section>
  );
}

/** Homepage slideshow backed by the real homepage banners. */
export function HeroSlideshow() {
  const { data: banners, isLoading, isError, refetch } = useBanners("homepage");

  if (isLoading) return <HeroSkeleton />;
  if (isError) return <HeroError refetch={() => refetch()} />;
  if (!banners || banners.length === 0) return <DefaultHero />;

  return <BannerSlideshow banners={banners} />;
}
