"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Computer } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import { isLocalImageUrl } from "../lib/imageUrl";
import type { Banner } from "@/features/admin/types";

function resolveHref(linkUrl?: string): { href: string; external: boolean } {
  if (linkUrl && linkUrl.startsWith("/")) {
    return { href: linkUrl, external: false };
  }
  if (linkUrl && /^https?:\/\//i.test(linkUrl)) {
    return { href: linkUrl, external: true };
  }
  return { href: ROUTES.products, external: false };
}

function PromoSlide({ banner }: { banner: Banner }) {
  const [failed, setFailed] = useState(false);
  const { href, external } = resolveHref(banner.linkUrl);

  const content = (
    <>
      {banner.imageUrl && !failed ? (
        isLocalImageUrl(banner.imageUrl) ? (
          <Image
            src={banner.imageUrl}
            alt={banner.title}
            fill
            sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none"
            onError={() => setFailed(true)}
          />
        ) : (
          // Remote banner URLs are not in the Next image allow-list.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={banner.imageUrl}
            alt={banner.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none"
            onError={() => setFailed(true)}
          />
        )
      ) : (
        <div className="flex h-full w-full items-center justify-between bg-slate-900 px-5 text-white">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.16em] uppercase opacity-60">
              CamboTech
            </p>
            <p className="mt-1 text-sm font-semibold">Promotion</p>
            <p className="mt-0.5 text-xs text-white/65">Browse our products</p>
          </div>
          <Computer className="size-12 opacity-20" />
        </div>
      )}
      <span className="sr-only">{banner.title}</span>
      <span className="absolute right-3 bottom-3 inline-flex size-8 items-center justify-center rounded-full bg-black/30 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        <ArrowRight className="size-4" />
      </span>
    </>
  );

  const className =
    "group focus-visible:ring-ring relative block aspect-[16/7] overflow-hidden rounded-xl border bg-muted shadow-sm transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:aspect-[16/6]";

  return external ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {content}
    </a>
  ) : (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}

export interface PromoCarouselProps {
  banners: Banner[];
  label?: string;
}

/** Horizontal promotion slider: 3-up on desktop, swipeable on mobile. */
export function PromoCarousel({
  banners,
  label = "Promotional offers",
}: PromoCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateControls = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    setCanPrev(scroller.scrollLeft > 4);
    setCanNext(
      scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 4,
    );
  }, []);

  useEffect(() => {
    updateControls();
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.addEventListener("scroll", updateControls, { passive: true });
    const observer = new ResizeObserver(updateControls);
    observer.observe(scroller);
    return () => {
      scroller.removeEventListener("scroll", updateControls);
      observer.disconnect();
    };
  }, [updateControls, banners.length]);

  const scrollByCard = (direction: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const slide = scroller.querySelector<HTMLElement>("[data-slide]");
    const gap =
      Number.parseFloat(getComputedStyle(scroller).columnGap || "0") || 0;
    const amount = (slide?.offsetWidth ?? scroller.clientWidth) + gap;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    scroller.scrollBy({
      left: direction * amount,
      behavior: reduced ? "auto" : "smooth",
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollByCard(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollByCard(1);
    }
  };

  if (banners.length === 0) return null;

  const slideWidth =
    banners.length === 1
      ? "w-full"
      : banners.length === 2
        ? "w-[85%] sm:w-[calc((100%-0.75rem)/2)]"
        : "w-[85%] sm:w-[calc((100%-0.75rem)/2)] lg:w-[calc((100%-2rem)/3)]";

  return (
    <section className="relative" aria-roledescription="carousel" aria-label={label}>
      <div
        ref={scrollerRef}
        role="group"
        aria-roledescription="slides"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="no-scrollbar focus-visible:ring-ring/50 flex snap-x snap-mandatory gap-3 overflow-x-auto rounded-xl pb-1 outline-none focus-visible:ring-2 lg:gap-4"
      >
        {banners.map((banner) => (
          <div
            key={banner.id}
            data-slide
            aria-roledescription="slide"
            className={cn("shrink-0 snap-start", slideWidth)}
          >
            <PromoSlide banner={banner} />
          </div>
        ))}
      </div>

      {banners.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={!canPrev}
            aria-label="Previous promotions"
            className="bg-background/95 text-foreground hover:bg-background absolute top-1/2 left-2 z-10 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full border shadow-md backdrop-blur transition-colors disabled:pointer-events-none disabled:opacity-40 sm:flex"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={!canNext}
            aria-label="Next promotions"
            className="bg-background/95 text-foreground hover:bg-background absolute top-1/2 right-2 z-10 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full border shadow-md backdrop-blur transition-colors disabled:pointer-events-none disabled:opacity-40 sm:flex"
          >
            <ChevronRight className="size-4" />
          </button>
        </>
      )}
    </section>
  );
}
