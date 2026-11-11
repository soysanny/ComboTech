import Link from "next/link";
import { Computer, Mail, MapPin, Phone } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import {
  SITE,
  SOCIAL_LINKS,
  CATEGORY_NAV,
  PAYMENT_METHODS,
} from "@/constants/site";
import { SocialIcon } from "@/components/icons/social-icons";

export function Footer() {
  const shopLinks = CATEGORY_NAV.slice(0, 5);
  const moreLinks = CATEGORY_NAV.slice(5);

  return (
    <footer className="bg-muted/30 mt-10 border-t">
      <div className="mx-auto grid w-full max-w-[1440px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.7fr_1fr_1fr_1.5fr] lg:gap-12 lg:px-8">
        <div className="space-y-4">
          <Link
            href={ROUTES.home}
            className="group inline-flex items-center gap-2.5"
          >
            <span className="bg-primary text-primary-foreground inline-flex size-9 items-center justify-center rounded-lg shadow-sm">
              <Computer className="size-5" strokeWidth={2.4} />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-brand text-[15px] font-semibold tracking-tight">
                {SITE.name}
              </span>
              <span className="text-muted-foreground mt-0.5 text-[10px] font-medium tracking-wide">
                {SITE.tagline}
              </span>
            </span>
          </Link>
          <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
            {SITE.description}
          </p>

          <div className="flex items-center gap-1.5">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.key}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                title={social.label}
                className="text-muted-foreground hover:bg-muted hover:text-foreground inline-flex size-8 items-center justify-center rounded-md transition-colors"
              >
                <SocialIcon name={social.key} className="size-4" />
              </a>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-muted-foreground text-[11px] font-semibold tracking-wide uppercase">
              We accept
            </p>
            <div className="flex flex-wrap gap-1.5">
              {PAYMENT_METHODS.map((method) => (
                <span
                  key={method.label}
                  title={method.title}
                  className="bg-background inline-flex h-8 min-w-12 items-center justify-center rounded-md border px-2.5 text-[10px] font-bold tracking-wide"
                >
                  {method.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold tracking-tight">Shop</p>
          <div className="mt-3 grid gap-2 text-sm">
            {shopLinks.map((link) => (
              <Link
                key={link.slug}
                className="text-muted-foreground hover:text-foreground w-fit transition-colors"
                href={`${ROUTES.products}?category=${link.slug}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold tracking-tight">More</p>
          <div className="mt-3 grid gap-2 text-sm">
            {moreLinks.map((link) => (
              <Link
                key={link.slug}
                className="text-muted-foreground hover:text-foreground w-fit transition-colors"
                href={`${ROUTES.products}?category=${link.slug}`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              className="text-muted-foreground hover:text-foreground w-fit transition-colors"
              href={ROUTES.contact}
            >
              Contact Us
            </Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold tracking-tight">Get in touch</p>
          <div className="mt-3 space-y-2.5 text-sm">
            <div className="text-muted-foreground flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              <span className="leading-relaxed">{SITE.address}</span>
            </div>
            <a
              href={SITE.phoneHref}
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 transition-colors"
            >
              <Phone className="size-4" />
              {SITE.phoneDisplay}
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 break-all transition-colors"
            >
              <Mail className="size-4 shrink-0" />
              {SITE.email}
            </a>
          </div>
        </div>
      </div>

      <div className="border-t">
        <div className="text-muted-foreground mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-2 px-4 py-4 text-xs sm:flex-row sm:px-6 lg:px-8">
          <span>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </span>
          <div className="flex items-center gap-4">
            <Link
              href={ROUTES.contact}
              className="hover:text-foreground transition-colors"
            >
              Contact
            </Link>
            <Link
              href={ROUTES.about}
              className="hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href={ROUTES.products}
              className="hover:text-foreground transition-colors"
            >
              Shop
            </Link>
            <Link
              href={ROUTES.login}
              className="hover:text-foreground transition-colors"
            >
              Staff
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
