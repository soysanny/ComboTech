"use client";

import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Headphones,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
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
    <section className="bg-card rounded-xl border p-5 shadow-sm sm:p-6">
      <p className="text-primary text-[11px] font-semibold tracking-[0.16em] uppercase">
        We&apos;re here to help
      </p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
        Contact CamboTech
      </h1>
      <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed sm:text-base">
        Questions about an order, a product, or a payment? Reach out and our team
        will get back to you as quickly as we can.
      </p>
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
            <div className="group bg-card flex h-full items-start gap-3 rounded-xl border p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
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

      <div className="bg-card rounded-xl border p-6 shadow-sm">
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

      <div className="bg-card rounded-xl border p-6 shadow-sm">
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
    <section className="bg-card flex flex-col items-start justify-between gap-4 rounded-xl border px-5 py-5 sm:flex-row sm:items-center">
      <div>
        <h2 className="text-base font-semibold tracking-tight sm:text-lg">
          Prefer to browse first?
        </h2>
        <p className="text-muted-foreground mt-0.5 max-w-lg text-sm">
          Explore our catalog of computers, laptops, and accessories — and reach
          out whenever you need a hand.
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

export function ContactPageContent() {
  return (
    <PageWrapper className="space-y-6 py-4 sm:py-6">
      <Hero />
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <ContactInfo />
        <Card className="bg-card shadow-sm">
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