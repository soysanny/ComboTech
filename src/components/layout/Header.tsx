"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sun, Moon, Computer, Phone } from "lucide-react";
import { useState } from "react";
import { ROUTES } from "@/constants/routes";
import {
  SITE,
  CATEGORY_NAV,
  BRAND_NAV,
  brandNavHref,
} from "@/constants/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toggleTheme } from "@/redux/slices/themeSlice";
import { SearchBox } from "./SearchBox";
import type { RootState } from "@/redux/store";

const navItems = [
  { label: "Home", href: ROUTES.home },
  { label: "Products", href: ROUTES.products },
  { label: "About", href: ROUTES.about },
  { label: "Contact", href: ROUTES.contact },
];

function Logo() {
  return (
    <Link
      href={ROUTES.home}
      className="group inline-flex shrink-0 items-center gap-2.5"
      aria-label="Go to homepage"
    >
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[linear-gradient(140deg,oklch(0.55_0.18_250),oklch(0.65_0.16_190))] text-sm font-bold text-white shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
        <Computer className="size-5" strokeWidth={2.5} />
      </span>
      <span className="hidden flex-col leading-none sm:flex">
        <span className="font-brand text-base font-semibold tracking-tight">
          CamboTech
        </span>
        <span className="text-muted-foreground text-[10px] font-medium tracking-wide">
          {SITE.tagline}
        </span>
      </span>
    </Link>
  );
}

function ThemeToggle() {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state: RootState) => state.theme.mode);

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={() => dispatch(toggleTheme())}
      aria-label={`Switch theme, currently ${mode}`}
      title="Toggle theme"
    >
      <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}

/** Category navigation row — mirrors CC Computer's storefront menu. */
function CategoryNav() {
  return (
    <div className="border-border/60 bg-muted/30 border-t">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-1 overflow-x-auto px-4 py-1.5 sm:px-6 lg:px-8">
        {CATEGORY_NAV.map((category) => (
          <Link
            key={category.slug}
            href={`${ROUTES.products}?category=${category.slug}`}
            className="text-muted-foreground hover:bg-background hover:text-foreground shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wide whitespace-nowrap uppercase transition-colors"
          >
            {category.label}
          </Link>
        ))}
        <Link
          href={ROUTES.contact}
          className="text-primary hover:bg-background shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wide whitespace-nowrap uppercase transition-colors"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-background/85 supports-[backdrop-filter]:backdrop-blur-xl sticky top-0 z-40 border-b border-white/40 shadow-[0_1px_2px_-1px_rgba(0,0,0,0.04)] dark:border-white/5">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <SearchBox className="hidden max-w-md flex-1 md:block" />

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Primary">
          {navItems.map((item) => {
            const isActive =
              item.href === ROUTES.home
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <a
            href={SITE.phoneHref}
            className="text-muted-foreground hover:text-foreground hidden items-center gap-1.5 rounded-lg px-2 text-sm font-semibold transition-colors lg:flex"
          >
            <Phone className="size-3.5" />
            {SITE.phoneDisplay}
          </a>
          <ThemeToggle />

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="xl:hidden"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
      </div>

      <CategoryNav />

      <div
        id="mobile-nav"
        className={cn(
          "border-border/70 overflow-hidden border-t bg-background/95 transition-all duration-300 ease-in-out xl:hidden",
          isMenuOpen ? "max-h-[36rem] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <nav
          className="mx-auto grid max-w-7xl gap-1 px-4 py-3 sm:px-6"
          aria-label="Mobile primary"
        >
          <SearchBox mobile className="mb-2 md:hidden" />

          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className={cn(
                "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}

          <div className="border-border/60 mt-2 border-t pt-3">
            <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
              Shop by category
            </p>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORY_NAV.map((category) => (
                <Link
                  key={category.slug}
                  href={`${ROUTES.products}?category=${category.slug}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-muted text-muted-foreground hover:text-foreground rounded-full px-3 py-1 text-xs font-medium transition-colors"
                >
                  {category.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="border-border/60 mt-3 border-t pt-3">
            <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
              Brands
            </p>
            <div className="flex flex-wrap gap-1.5">
              {BRAND_NAV.map((brand) => (
                <Link
                  key={brand.label}
                  href={brandNavHref(brand)}
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-muted text-muted-foreground hover:text-foreground rounded-full px-3 py-1 text-xs font-semibold uppercase transition-colors"
                >
                  {brand.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <a
              href={SITE.phoneHref}
              className="text-muted-foreground flex items-center gap-1.5 text-sm font-semibold"
            >
              <Phone className="size-4" />
              {SITE.phoneDisplay}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
