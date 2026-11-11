"use client";

import Link from "next/link";
import { ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/shared/Skeleton";
import { ROUTES } from "@/constants/routes";
import { useBanners } from "@/features/banners";
import { isDisplayableImageUrl } from "../lib/imageUrl";
import { PromoCarousel } from "./PromoCarousel";

function PromoCarouselsSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4" aria-hidden>
      {[0, 1, 2].map((index) => (
        <Skeleton
          key={index}
          className="aspect-[16/6] w-full rounded-xl"
        />
      ))}
    </div>
  );
}

/** Renders the compact promotion slider beneath the main slideshow. */
export function PromoBannerCarousels() {
  const { data: banners, isLoading, isError, refetch } = useBanners("promotion");

  if (isLoading) return <PromoCarouselsSkeleton />;

  if (isError) {
    return (
      <div className="bg-card flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-6 text-center sm:flex-row sm:text-left">
        <p className="text-muted-foreground text-sm">
          Could not load promotional banners.
        </p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="size-4" />
          Retry
        </Button>
      </div>
    );
  }

  const seenImages = new Set<string>();
  const promotions = (banners ?? []).filter((banner) => {
    if (!isDisplayableImageUrl(banner.imageUrl)) return false;
    if (seenImages.has(banner.imageUrl)) return false;
    seenImages.add(banner.imageUrl);
    return true;
  });
  if (promotions.length === 0) return null;

  return (
    <section className="space-y-3" aria-labelledby="promotions-heading">
      <div className="flex items-end justify-between gap-4">
        <h2
          id="promotions-heading"
          className="text-base font-semibold tracking-tight sm:text-lg"
        >
          Deals &amp; promotions
        </h2>
        <Link
          href={ROUTES.products}
          className="text-primary hover:text-primary/80 inline-flex items-center gap-1 text-xs font-semibold transition-colors"
        >
          View products
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
      <PromoCarousel banners={promotions} label="Promotional offers" />
    </section>
  );
}
