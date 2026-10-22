"use client";

import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  Headphones,
  Award,
  Target,
  Users,
  Star,
  Heart,
  Globe,
  Sparkles,
  ArrowRight,
  Cpu,
  Monitor,
  ShoppingBag,
  Clock,
  CreditCard,
} from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SectionShell } from "@/components/shared/SectionShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ParticlesBg } from "@/components/ui/particles-bg";
import { ROUTES } from "@/constants/routes";

function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-[linear-gradient(135deg,oklch(0.22_0.04_260),oklch(0.32_0.08_250))] px-6 py-16 text-white shadow-2xl sm:px-12 sm:py-20 lg:py-24">
      <ParticlesBg theme="dark" background={false} />
      <div className="relative z-10 max-w-3xl">
        <Badge className="mb-5 border-white/20 bg-white/10 text-white backdrop-blur-sm">
          <Sparkles className="mr-1.5 size-3.5" />
          Since 2020
        </Badge>
        <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          About CAMBOTECH
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">
          Your trusted online destination for premium computers, laptops, gaming
          PCs, and accessories. We combine quality products with fair pricing and
          exceptional service to power Cambodia&apos;s tech community.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            asChild
            size="lg"
            className="bg-white text-slate-900 hover:bg-white/90"
          >
            <Link href={ROUTES.products}>
              Explore products
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
          >
            <Link href={ROUTES.home}>Learn more</Link>
          </Button>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute top-0 right-0 h-96 w-96 translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-80 w-80 -translate-x-1/3 translate-y-1/3 rounded-full bg-accent/30 blur-3xl" />
      </div>

      <div className="absolute right-8 bottom-8 hidden lg:block">
        <div className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md">
          <div className="flex -space-x-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="size-10 rounded-full border-2 border-white/30 bg-gradient-to-br from-primary/60 to-accent/60"
                style={{ zIndex: 4 - i }}
              />
            ))}
          </div>
          <div>
            <p className="text-sm font-semibold">Trusted by 10,000+</p>
            <p className="text-xs text-white/70">Happy customers</p>
          </div>
        </div>
      </div>
    </section>
  );
}

const stats = [
  { value: "10,000+", label: "Happy Customers", icon: Users },
  { value: "5,000+", label: "Products Sold", icon: ShoppingBag },
  { value: "50+", label: "Brand Partners", icon: Award },
  { value: "24/7", label: "Customer Support", icon: Headphones },
];

function Stats() {
  return (
    <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="group flex flex-col items-center gap-3 rounded-2xl border border-transparent bg-white/60 p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-md dark:bg-white/5 dark:hover:bg-white/10"
          >
            <div className="bg-primary/10 text-primary inline-flex size-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110">
              <Icon className="size-6" />
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
}

function OurStory() {
  return (
    <SectionShell spacing="lg">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Our Story
          </h2>
          <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
            <p>
              CAMBOTECH was founded in 2020 with a simple mission: to make
              premium technology accessible to everyone in Cambodia. What started
              as a small operation run by a handful of tech enthusiasts has
              grown into one of the country&apos;s most trusted e-commerce
              platforms for computers and accessories.
            </p>
            <p>
              We saw a gap in the market — customers deserved better access to
              quality tech products with local warranty support and honest
              pricing. From day one, we&apos;ve partnered directly with leading
              global brands to bring you authentic products at competitive
              prices, backed by reliable after-sales service.
            </p>
            <p>
              Today, we serve thousands of customers across Cambodia — from
              students and professionals to gamers and creative studios. Our
              commitment to quality, transparency, and outstanding customer
              support remains at the heart of everything we do.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Heart className="size-4 text-rose-500 fill-rose-500" />
            <span>Built with passion for technology</span>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[linear-gradient(135deg,oklch(0.25_0.04_260),oklch(0.35_0.10_250))] shadow-lg">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 inline-flex size-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                  <Monitor className="size-10 text-white" />
                </div>
                <p className="text-sm font-semibold text-white/80">
                  Modern tech workspace
                </p>
              </div>
            </div>

            <div className="absolute -right-4 -bottom-4 size-48 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -left-4 -top-4 size-32 rounded-full bg-accent/20 blur-3xl" />

            <div className="absolute bottom-3 left-3 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
              Phnom Penh, Cambodia
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

function Mission() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-[linear-gradient(135deg,oklch(0.50_0.18_250),oklch(0.55_0.20_190))] px-6 py-14 text-white shadow-xl sm:px-12 sm:py-20">
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <Target className="mx-auto mb-6 size-12 text-white/80" />
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Our Mission
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/90">
          To provide the best computing experience with quality products and
          outstanding customer support — empowering every individual and
          business in Cambodia to reach their full potential through technology.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {[
            {
              icon: Star,
              title: "Quality First",
              desc: "Every product is sourced from authorized distributors with full warranty coverage.",
            },
            {
              icon: Heart,
              title: "Customer Focus",
              desc: "Your satisfaction drives every decision we make — from pricing to support.",
            },
            {
              icon: Globe,
              title: "Local Impact",
              desc: "Building Cambodia's tech ecosystem by making premium gear accessible to all.",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-white/15 bg-white/10 p-6 text-left backdrop-blur-sm"
              >
                <Icon className="mb-3 size-7" />
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 h-72 w-72 translate-x-1/3 -translate-y-1/3 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 -translate-x-1/3 translate-y-1/3 rounded-full bg-black/15 blur-3xl" />
      </div>
    </section>
  );
}

const whyChooseUs = [
  {
    icon: ShieldCheck,
    title: "Premium Quality",
    desc: "We source only authentic, brand-new products from authorized distributors — every item is backed by manufacturer warranty.",
  },
  {
    icon: Truck,
    title: "Fast Shipping",
    desc: "Nationwide shipping across Cambodia with real-time tracking. Most orders arrive within 1–3 business days.",
  },
  {
    icon: CreditCard,
    title: "Secure Shopping",
    desc: "Multiple payment options including ABA, Wing, and cash payments — all transactions are encrypted and secure.",
  },
  {
    icon: Headphones,
    title: "Expert Support",
    desc: "Our knowledgeable team provides post-purchase guidance, troubleshooting, and warranty claim assistance.",
  },
  {
    icon: Clock,
    title: "Easy Returns",
    desc: "7-day return policy on most items. We make the process simple and hassle-free because your trust matters.",
  },
  {
    icon: Cpu,
    title: "Latest Tech",
    desc: "We continuously update our catalog with the newest releases — from RTX 5000 series GPUs to the latest laptops.",
  },
];

function WhyChooseUs() {
  return (
    <SectionShell spacing="lg">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Why Choose Us
        </h2>
        <p className="text-muted-foreground mx-auto mt-3 max-w-2xl">
          We don&apos;t just sell products — we create experiences built on
          trust, quality, and care.
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {whyChooseUs.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="group rounded-2xl border border-transparent bg-white/60 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-md dark:bg-white/5 dark:hover:bg-white/10"
            >
              <div className="bg-primary/10 text-primary mb-4 inline-flex size-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110">
                <Icon className="size-6" />
              </div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}

function CTABanner() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-[linear-gradient(135deg,oklch(0.55_0.18_250),oklch(0.65_0.16_190))] px-6 py-12 text-white shadow-xl sm:px-12 sm:py-16">
      <div className="relative z-10 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Ready to upgrade your setup?
          </h2>
          <p className="mt-2 max-w-lg text-white/85">
            Join thousands of satisfied customers who trust CAMBOTECH for their
            tech needs. Browse our catalog today.
          </p>
        </div>
        <Button
          asChild
          size="lg"
          className="bg-white text-foreground hover:bg-white/90"
        >
          <Link href={ROUTES.products}>
            Shop now
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 h-80 w-80 translate-x-1/3 -translate-y-1/3 rounded-full bg-white/20 blur-3xl" />
      </div>
    </section>
  );
}

export function AboutPageContent() {
  return (
    <PageWrapper className="space-y-14 py-8">
      <Hero />
      <Stats />
      <OurStory />
      <Mission />
      <WhyChooseUs />
      <CTABanner />
    </PageWrapper>
  );
}
