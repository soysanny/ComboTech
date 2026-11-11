"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/shared/Skeleton";
import { useBanners } from "../hooks/useBanners";
import type { Banner } from "@/features/admin/types";

function bannerHref(banner: Banner) {
  const raw = banner.linkUrl?.trim();
  if (!raw) return ROUTES.products;
  if (raw.startsWith("/") || /^https?:\/\//i.test(raw)) return raw;
  return `/${raw}`;
}

function isExternal(href: string) {
  return /^https?:\/\//i.test(href);
}

function PromoCard({ banner }: { banner: Banner }) {
  const href = bannerHref(banner);
  const content = (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={banner.imageUrl}
        alt={banner.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover/promo:scale-[1.04]"
        loading="lazy"
        decoding="async"
        draggable={false}
      />
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
      <span className="pointer-events-none absolute inset-x-0 bottom-0 line-clamp-2 p-4 text-sm font-semibold text-white drop-shadow-sm sm:text-base">
        {banner.title}
      </span>
    </>
  );

  return (
    <div className="group/promo hover:border-primary/30 surface-glass relative aspect-[16/9] w-[82%] shrink-0 overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_30px_80px_-40px_rgba(37,99,235,0.35)] sm:aspect-[16/7] sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)] xl:w-[calc(25%-0.75rem)]">
      {isExternal(href) ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="block h-full w-full"
          aria-label={banner.title}
        >
          {content}
        </a>
      ) : (
        <Link
          href={href}
          className="block h-full w-full"
          aria-label={banner.title}
        >
          {content}
        </Link>
      )}
    </div>
  );
}

function PromoCarouselSkeleton() {
  return (
    <div aria-hidden className="flex gap-4 overflow-hidden">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "aspect-[16/9] w-[82%] shrink-0 overflow-hidden rounded-2xl sm:aspect-[16/7] sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)] xl:w-[calc(25%-0.75rem)]",
            index > 1 && "hidden lg:block",
          )}
        >
          <Skeleton className="h-full w-full rounded-2xl" />
        </div>
      ))}
    </div>
  );
}

/** M.Video-style promo rail: horizontally scrollable cards with desktop arrows. */
export function PromoBannerCarousel() {
  const {
    data: banners,
    isLoading,
    isError,
    refetch,
  } = useBanners("promotion");
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState({ left: false, right: false });

  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    setCanScroll({
      left: track.scrollLeft > 4,
      right: track.scrollLeft < maxScroll - 4,
    });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updateScrollState();
    track.addEventListener("scroll", updateScrollState, { passive: true });

    const observer = new ResizeObserver(updateScrollState);
    observer.observe(track);

    return () => {
      track.removeEventListener("scroll", updateScrollState);
      observer.disconnect();
    };
  }, [updateScrollState, banners]);

  const scrollByCards = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;

    const cards = Array.from(track.children) as HTMLElement[];
    const left = track.scrollLeft;
    const viewportRight = left + track.clientWidth;

    if (direction === 1) {
      const nextCard = cards.find(
        (card) => card.offsetLeft + card.offsetWidth > viewportRight + 1,
      );
      track.scrollTo({
        left: nextCard
          ? nextCard.offsetLeft
          : track.scrollWidth - track.clientWidth,
        behavior: "smooth",
      });
      return;
    }

    let previousCard: HTMLElement | undefined;
    for (const card of cards) {
      if (card.offsetLeft < left - 1) previousCard = card;
      else break;
    }

    track.scrollTo({
      left: previousCard
        ? Math.max(
            0,
            previousCard.offsetLeft +
              previousCard.offsetWidth -
              track.clientWidth,
          )
        : 0,
      behavior: "smooth",
    });
  };

  if (isLoading) return <PromoCarouselSkeleton />;
  if (isError) {
    return (
      <section className="surface-glass flex flex-col items-center justify-center rounded-2xl p-6 text-center">
        <p className="text-muted-foreground text-sm">
          Could not load current promotions.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() => refetch()}
        >
          <RefreshCw className="mr-2 size-4" />
          Retry
        </Button>
      </section>
    );
  }
  if (!banners || banners.length === 0) return null;

  return (
    <section className="group/promos relative" aria-label="Promotions">
      <div
        ref={trackRef}
        className="flex [scrollbar-width:none] gap-4 overflow-x-auto scroll-smooth pb-1 [&::-webkit-scrollbar]:hidden"
      >
        {banners.map((banner) => (
          <PromoCard key={banner.id} banner={banner} />
        ))}
      </div>

      <button
        type="button"
        onClick={() => scrollByCards(-1)}
        aria-label="Scroll promotions left"
        disabled={!canScroll.left}
        className="absolute top-1/2 -left-3 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-900 opacity-0 shadow-md ring-1 ring-black/5 transition-all group-hover/promos:opacity-100 hover:bg-white focus-visible:opacity-100 disabled:hidden sm:flex"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        onClick={() => scrollByCards(1)}
        aria-label="Scroll promotions right"
        disabled={!canScroll.right}
        className="absolute top-1/2 -right-3 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-900 opacity-0 shadow-md ring-1 ring-black/5 transition-all group-hover/promos:opacity-100 hover:bg-white focus-visible:opacity-100 disabled:hidden sm:flex"
      >
        <ChevronRight className="size-5" />
      </button>
    </section>
  );
}
