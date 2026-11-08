"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowRight,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ParticlesBg } from "@/components/ui/particles-bg";
import { AnimatedText } from "@/components/ui/animated-text";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { useBanners } from "@/features/banners";
import { HomepageBrandSections } from "@/features/homepage";
import type { Banner } from "@/features/admin/types";

function DefaultHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-[linear-gradient(135deg,oklch(0.22_0.04_260),oklch(0.32_0.08_250))] px-6 py-16 text-white shadow-2xl sm:px-12 sm:py-20 lg:py-24">
      <ParticlesBg theme="dark" className="opacity-70" />
      <div className="relative z-10 max-w-2xl">
        <Badge className="mb-5 border-white/20 bg-white/10 text-white backdrop-blur-sm">
          New arrivals available
        </Badge>
        <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          <AnimatedText text="Build your dream setup today" />
        </h1>
        <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/80">
          Premium computers, laptops, components, and gaming gear with honest
          pricing and local warranty support.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            asChild
            size="lg"
            className="bg-white text-slate-900 hover:bg-white/90"
          >
            <Link href={ROUTES.products}>Shop now</Link>
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
        <div className="absolute top-0 right-0 h-96 w-96 translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-80 w-80 -translate-x-1/3 translate-y-1/3 rounded-full bg-accent/30 blur-3xl" />
      </div>
    </section>
  );
}

function HeroSkeleton() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-[linear-gradient(135deg,oklch(0.22_0.04_260),oklch(0.32_0.08_250))] px-6 py-16 text-white shadow-2xl sm:px-12 sm:py-20 lg:py-24 animate-pulse">
      <div className="relative z-10 max-w-2xl space-y-4">
        <div className="h-6 w-44 rounded-full bg-white/20" />
        <div className="h-12 w-3/4 rounded-xl bg-white/20 sm:h-14" />
        <div className="h-5 w-full rounded-lg bg-white/15" />
        <div className="h-5 w-2/3 rounded-lg bg-white/15" />
        <div className="flex gap-3 pt-4">
          <div className="h-11 w-32 rounded-lg bg-white/20" />
          <div className="h-11 w-32 rounded-lg bg-white/10" />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute top-0 right-0 h-96 w-96 translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-80 w-80 -translate-x-1/3 translate-y-1/3 rounded-full bg-accent/30 blur-3xl" />
      </div>
    </section>
  );
}

function HeroError({ refetch }: { refetch: () => void }) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-[linear-gradient(135deg,oklch(0.35_0.04_10),oklch(0.30_0.08_20))] px-6 py-16 text-white shadow-2xl sm:px-12 sm:py-20 lg:py-24">
      <div className="relative z-10 flex flex-col items-center text-center">
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
      </div>
    </section>
  );
}

function BannerCarousel({ banners }: { banners: Banner[] }) {
  const [current, setCurrent] = useState(0);
  const total = banners.length;

  const goTo = useCallback(
    (index: number) => {
      setCurrent(((index % total) + total) % total);
    },
    [total],
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, total]);

  const banner = banners[current];
  if (!banner) return null;

  const bannerHref =
    banner.linkUrl && banner.linkUrl.startsWith("/")
      ? banner.linkUrl
      : ROUTES.products;

  return (
    <section className="relative overflow-hidden rounded-3xl shadow-2xl">
      <div className="relative min-h-[320px] sm:min-h-[400px] lg:min-h-[460px]">
        {banners.map((item, index) => (
          <div
            key={item.id}
            className={cn(
              "absolute inset-0 z-0 transition-opacity duration-700",
              index === current ? "opacity-100" : "opacity-0",
            )}
            aria-hidden={index !== current}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.imageUrl}
              alt={item.title}
              className="h-full w-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent" />
          </div>
        ))}

        <ParticlesBg
          theme="dark"
          background={false}
          className="pointer-events-none z-[1] opacity-60"
        />

        <div className="pointer-events-none relative z-10 flex min-h-[320px] items-center px-6 py-16 text-white sm:min-h-[400px] sm:px-12 sm:py-20 lg:min-h-[460px] lg:py-24">
          <div className="pointer-events-auto max-w-2xl">
            <Badge className="mb-5 border-white/20 bg-white/10 text-white backdrop-blur-sm">
              {banner.type === "promotion"
                ? "Special offer"
                : "New arrivals available"}
            </Badge>
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <AnimatedText key={banner.id} text={banner.title} />
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/85">
              Premium computers, laptops, components, and gaming gear with honest
              pricing and local warranty support.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-white text-slate-900 hover:bg-white/90"
              >
                <Link href={bannerHref}>Shop now</Link>
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
        </div>

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(current - 1)}
              aria-label="Previous slide"
              className="absolute top-1/2 left-3 z-20 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50 sm:flex"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next slide"
              className="absolute top-1/2 right-3 z-20 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50 sm:flex"
            >
              <ChevronRight className="size-5" />
            </button>
            <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
              {banners.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    index === current
                      ? "w-6 bg-white"
                      : "w-2 bg-white/50 hover:bg-white/80",
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

function Hero() {
  const { data: banners, isLoading, isError, refetch } = useBanners("homepage");

  if (isLoading) return <HeroSkeleton />;
  if (isError) return <HeroError refetch={refetch} />;
  if (!banners || banners.length === 0) return <DefaultHero />;

  return <BannerCarousel banners={banners} />;
}

export function HomePageContent() {
  return (
    <PageWrapper className="space-y-14 py-8">
      <Hero />
      <HomepageBrandSections />

      <section className="relative overflow-hidden rounded-3xl bg-[linear-gradient(135deg,oklch(0.55_0.18_250),oklch(0.65_0.16_190))] px-6 py-12 text-white shadow-xl sm:px-12 sm:py-16">
        <div className="relative z-10 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Ready to upgrade your workspace?
            </h2>
            <p className="mt-2 max-w-lg text-white/85">
              Browse our full catalog of computers, components, and accessories
              built for professionals and gamers.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="bg-white text-slate-900 hover:bg-white/90"
          >
            <Link href={ROUTES.products}>
              Browse catalog
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 h-80 w-80 translate-x-1/3 -translate-y-1/3 rounded-full bg-white/20 blur-3xl" />
        </div>
      </section>
    </PageWrapper>
  );
}
