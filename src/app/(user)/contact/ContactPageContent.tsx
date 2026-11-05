"use client";

import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Headphones,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Badge } from "@/components/ui/badge";
import { ParticlesBg } from "@/components/ui/particles-bg";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import { ContactForm } from "@/features/contact";

const contactChannels = [
  {
    icon: Mail,
    label: "Email",
    value: SITE.email,
    href: `mailto:${SITE.email}`,
  },
  {
    icon: Phone,
    label: "Phone",
    value: SITE.phoneDisplay,
    href: SITE.phoneHref,
  },
  {
    icon: MessageSquare,
    label: "Live chat",
    value: "Available soon",
  },
  {
    icon: MapPin,
    label: "Address",
    value: SITE.address,
  },
];

const supportHours = [
  { day: "Monday – Friday", time: "8:00 AM – 6:00 PM" },
  { day: "Saturday", time: "9:00 AM – 4:00 PM" },
  { day: "Sunday", time: "Closed" },
];

const expectations = [
  "We reply to most messages within 24 hours",
  "Order and payment issues are prioritized",
  "Warranty claims helped end-to-end",
];

function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-[linear-gradient(135deg,oklch(0.22_0.04_260),oklch(0.32_0.08_250))] px-6 py-16 text-white shadow-2xl sm:px-12 sm:py-20 lg:py-24">
      <ParticlesBg theme="dark" background={false} />
      <div className="relative z-10 max-w-3xl">
        <Badge className="mb-5 border-white/20 bg-white/10 text-white backdrop-blur-sm">
          <Sparkles className="mr-1.5 size-3.5" />
          We&apos;re here to help
        </Badge>
        <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Contact Us
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">
          Questions about an order, a product, or a payment? Our team is ready
          to help. Reach out and we&apos;ll get back to you as quickly as we can.
        </p>
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute top-0 right-0 h-96 w-96 translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-80 w-80 -translate-x-1/3 translate-y-1/3 rounded-full bg-accent/30 blur-3xl" />
      </div>
    </section>
  );
}

function ContactInfo() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {contactChannels.map((channel) => {
          const Icon = channel.icon;
          const content = (
            <div className="group flex h-full items-start gap-3 rounded-2xl border border-transparent bg-white/60 p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-md dark:bg-white/5 dark:hover:bg-white/10">
              <div className="bg-primary/10 text-primary inline-flex size-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110">
                <Icon className="size-5" />
              </div>
              <div>
                <p className="text-xs font-medium tracking-wide uppercase text-muted-foreground">
                  {channel.label}
                </p>
                <p className="mt-0.5 font-semibold">{channel.value}</p>
              </div>
            </div>
          );
          return channel.href ? (
            <a
              key={channel.label}
              href={channel.href}
              className="block h-full focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 rounded-2xl"
            >
              {content}
            </a>
          ) : (
            <div key={channel.label} className="h-full">
              {content}
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-transparent bg-white/60 p-6 shadow-sm dark:bg-white/5">
        <div className="flex items-center gap-2">
          <Clock className="size-5 text-primary" />
          <h2 className="text-lg font-semibold">Support hours</h2>
        </div>
        <ul className="mt-4 space-y-2.5 text-sm">
          {supportHours.map((row) => (
            <li
              key={row.day}
              className="flex items-center justify-between gap-4 border-b border-dashed border-border/60 pb-2.5 last:border-0 last:pb-0"
            >
              <span className="text-muted-foreground">{row.day}</span>
              <span className="font-medium">{row.time}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-transparent bg-white/60 p-6 shadow-sm dark:bg-white/5">
        <div className="flex items-center gap-2">
          <Headphones className="size-5 text-primary" />
          <h2 className="text-lg font-semibold">What to expect</h2>
        </div>
        <ul className="mt-4 space-y-3 text-sm">
          {expectations.map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function CTABanner() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-[linear-gradient(135deg,oklch(0.55_0.18_250),oklch(0.65_0.16_190))] px-6 py-12 text-white shadow-xl sm:px-12 sm:py-16">
      <div className="relative z-10 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Prefer to browse first?
          </h2>
          <p className="mt-2 max-w-lg text-white/85">
            Explore our catalog of computers, laptops, and accessories — and
            reach out whenever you need a hand.
          </p>
        </div>
        <Button
          asChild
          size="lg"
          className="bg-white text-slate-900 hover:bg-white/90"
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

export function ContactPageContent() {
  return (
    <PageWrapper className="space-y-10 py-8">
      <Hero />
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <ContactInfo />
        <Card className="border-white/60 bg-white/80 shadow-[0_18px_55px_-30px_rgba(15,23,42,0.55)] backdrop-blur-sm dark:bg-card/80">
          <CardHeader className="space-y-1">
            <CardTitle>Send us a message</CardTitle>
            <CardDescription>
              Fill in the form below and our team will respond by email.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>
      </div>
      <CTABanner />
    </PageWrapper>
  );
}