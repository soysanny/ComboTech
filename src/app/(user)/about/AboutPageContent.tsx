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
import { ROUTES } from "@/constants/routes";

function Hero() {
  return (
    <section className="bg-card flex flex-col gap-5 rounded-xl border p-5 shadow-sm sm:p-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="max-w-2xl">
        <p className="text-primary text-[11px] font-semibold tracking-[0.16em] uppercase">
          About CamboTech
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Technology, chosen with care.
        </h1>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed sm:text-base">
          Your trusted destination for computers, laptops, PC components and
          accessories in Phnom Penh. We combine genuine products with fair
          pricing and practical local support.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button asChild>
          <Link href={ROUTES.products}>
            Explore products
            <ArrowRight className="size-4" />
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={ROUTES.contact}>Talk to our team</Link>
        </Button>
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
            className="group bg-card flex flex-col items-center gap-3 rounded-xl border p-5 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
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
    <section className="bg-foreground text-background relative overflow-hidden rounded-xl px-6 py-10 shadow-sm sm:px-10">
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <Target className="mx-auto mb-4 size-9 opacity-70" />
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Our Mission
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed opacity-80 sm:text-base">
          To provide the best computing experience with quality products and
          outstanding customer support — empowering every individual and
          business in Cambodia to reach their full potential through technology.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
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
                className="border-background/15 bg-background/10 rounded-xl border p-5 text-left"
              >
                <Icon className="mb-3 size-6" />
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed opacity-75">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
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
              className="group bg-card rounded-xl border p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
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
    <section className="bg-card flex flex-col items-start justify-between gap-4 rounded-xl border px-5 py-5 sm:flex-row sm:items-center">
      <div>
        <h2 className="text-base font-semibold tracking-tight sm:text-lg">
          Ready to upgrade your setup?
        </h2>
        <p className="text-muted-foreground mt-0.5 max-w-lg text-sm">
          Browse our full catalog of computers, components, and accessories.
        </p>
      </div>
      <Button asChild size="sm">
        <Link href={ROUTES.products}>
          Shop now
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </section>
  );
}

export function AboutPageContent() {
  return (
    <PageWrapper className="space-y-6 py-4 sm:py-6">
      <Hero />
      <Stats />
      <OurStory />
      <Mission />
      <WhyChooseUs />
      <CTABanner />
    </PageWrapper>
  );
}
