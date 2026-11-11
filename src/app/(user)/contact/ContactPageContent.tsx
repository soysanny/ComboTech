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
    <section className="banner-gradient relative overflow-hidden rounded-3xl border border-white/20 px-6 py-16 text-white shadow-[0_40px_120px_-60px_rgba(2,6,23,0.45)] backdrop-blur-xl sm:px-12 sm:py-20 lg:py-24">
      <ParticlesBg theme="dark" background={false} />
      <div className="relative z-10 max-w-3xl">
        <Badge className="mb-5 border-white/20 bg-white/10 text-white backdrop-blur-sm">
          <Sparkles className="mr-1.5 size-3.5" />
          We&apos;re here to help
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
          Contact Us
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">
          Questions about an order, a product, or a payment? Our team is ready
          to help. Reach out and we&apos;ll get back to you as quickly as we
          can.
        </p>
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="bg-primary/30 absolute top-0 right-0 h-96 w-96 translate-x-1/3 -translate-y-1/3 rounded-full blur-3xl" />
        <div className="bg-accent/30 absolute bottom-0 left-0 h-80 w-80 -translate-x-1/3 translate-y-1/3 rounded-full blur-3xl" />
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
            <div className="group surface-glass surface-hover flex h-full items-start gap-3 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
              <div className="bg-primary/10 text-primary inline-flex size-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110">
                <Icon className="size-5" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
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
              className="focus-visible:ring-ring block h-full rounded-2xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
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

      <div className="surface-glass rounded-2xl p-6">
        <div className="flex items-center gap-2">
          <Clock className="text-primary size-5" />
          <h2 className="text-lg font-semibold">Support hours</h2>
        </div>
        <ul className="mt-4 space-y-2.5 text-sm">
          {supportHours.map((row) => (
            <li
              key={row.day}
              className="border-border/60 flex items-center justify-between gap-4 border-b border-dashed pb-2.5 last:border-0 last:pb-0"
            >
              <span className="text-muted-foreground">{row.day}</span>
              <span className="font-medium">{row.time}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="surface-glass rounded-2xl p-6">
        <div className="flex items-center gap-2">
          <Headphones className="text-primary size-5" />
          <h2 className="text-lg font-semibold">What to expect</h2>
        </div>
        <ul className="mt-4 space-y-3 text-sm">
          {expectations.map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
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
    <section className="banner-gradient relative overflow-hidden rounded-3xl border border-white/20 px-6 py-12 text-white shadow-[0_40px_120px_-60px_rgba(2,6,23,0.45)] backdrop-blur-xl sm:px-12 sm:py-16">
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
        <Card className="surface-glass">
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
