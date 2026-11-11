"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { HeroBanner, PromoBannerCarousel } from "@/features/banners";
import { HomepageProducts } from "@/features/homepage";

export function HomePageContent() {
  return (
    <PageWrapper className="space-y-8 py-6 sm:space-y-10 sm:py-8">
      <HeroBanner />
      <PromoBannerCarousel />
      <HomepageProducts />

      <section className="banner-gradient relative overflow-hidden rounded-3xl border border-white/20 px-6 py-12 text-white shadow-[0_40px_120px_-60px_rgba(2,6,23,0.45)] backdrop-blur-xl sm:px-12 sm:py-16">
        <div className="relative z-10 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
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
