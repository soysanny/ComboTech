"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Menu, X, Sun, Moon, Computer, Phone } from "lucide-react";
import { Suspense, useState } from "react";
import { ROUTES } from "@/constants/routes";
import { SITE, CATEGORY_NAV, BRAND_NAV, brandNavHref } from "@/constants/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toggleTheme } from "@/redux/slices/themeSlice";
import { SearchBox, SearchBoxFallback } from "./SearchBox";
import type { RootState } from "@/redux/store";

const navItems = [
  { label: "Home", href: ROUTES.home },
  { label: "Products", href: ROUTES.products },
  { label: "About", href: ROUTES.about },
  { label: "Contact", href: ROUTES.contact },
];

/** Shared interaction styling for the primary navigation and category bar. */
const primaryNavActiveClasses =
  "border-primary/25 bg-primary/10 text-foreground after:via-primary/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] after:absolute after:inset-x-3.5 after:bottom-1 after:h-px after:rounded-full after:bg-gradient-to-r after:from-transparent after:to-transparent after:content-['']";
const primaryNavInactiveClasses =
  "text-foreground/70 hover:text-foreground border-transparent hover:bg-[var(--hover-bg)]";

function primaryNavItemClasses(isActive: boolean, className?: string) {
  return cn(
    "relative rounded-lg border font-medium transition-colors duration-200",
    isActive ? primaryNavActiveClasses : primaryNavInactiveClasses,
    className,
  );
}

function Logo() {
  return (
    <Link
      href={ROUTES.home}
      className="group inline-flex shrink-0 items-center gap-3 rounded-xl"
      aria-label="Go to homepage"
    >
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[linear-gradient(140deg,oklch(0.72_0.15_245),oklch(0.62_0.14_285))] text-white shadow-[0_10px_24px_-14px_rgba(56,189,248,0.75)] ring-1 ring-white/15 transition-shadow duration-200 group-hover:shadow-[0_14px_30px_-14px_rgba(56,189,248,0.9)]">
        <Computer className="size-[22px]" strokeWidth={2.5} />
      </span>
      <span className="hidden flex-col gap-1 leading-none whitespace-nowrap sm:flex">
        <span className="font-brand text-lg font-semibold tracking-tight">
          CamboTech
        </span>
        <span className="text-[11px] font-medium tracking-wide text-[var(--app-muted)]">
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
      size="icon"
      onClick={() => dispatch(toggleTheme())}
      aria-label={`Switch theme, currently ${mode}`}
      title="Toggle theme"
      className="text-foreground/70 hover:text-foreground hover:bg-[var(--hover-bg)]"
    >
      <Sun className="size-[18px] scale-100 rotate-0 transition-all duration-200 dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute size-[18px] scale-0 rotate-90 transition-all duration-200 dark:scale-100 dark:rotate-0" />
    </Button>
  );
}

function CategoryNavItems({
  activeCategory,
}: {
  activeCategory?: string | null;
}) {
  const pathname = usePathname();
  const isContactActive = pathname === ROUTES.contact;

  return (
    <div className="border-b border-[var(--surface-border)] bg-[var(--surface-strong-bg)]">
      <div className="mx-auto flex h-[66px] w-full max-w-7xl items-center gap-2 px-4 sm:px-6 lg:px-8">
        <nav
          aria-label="Product categories"
          className="flex min-w-0 flex-1 [scrollbar-width:none] items-center gap-1 overflow-x-auto overscroll-x-contain py-2 [&::-webkit-scrollbar]:hidden"
        >
          {CATEGORY_NAV.map((category) => {
            const isActive = activeCategory === category.slug;

            return (
              <Link
                key={category.slug}
                href={`${ROUTES.products}?category=${category.slug}`}
                aria-current={isActive ? "page" : undefined}
                className={primaryNavItemClasses(
                  isActive,
                  "focus-visible:ring-ring/60 focus-visible:ring-offset-background inline-flex h-11 shrink-0 items-center px-3.5 text-[15px] tracking-normal whitespace-nowrap focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:px-4 sm:text-base lg:h-12",
                )}
              >
                {category.label}
              </Link>
            );
          })}
        </nav>

        <span
          className="h-6 w-px shrink-0 bg-[var(--surface-border)]"
          aria-hidden
        />

        <Link
          href={ROUTES.contact}
          aria-current={isContactActive ? "page" : undefined}
          className={primaryNavItemClasses(
            isContactActive,
            "focus-visible:ring-ring/60 focus-visible:ring-offset-background inline-flex h-11 shrink-0 items-center px-3 text-[15px] tracking-normal whitespace-nowrap focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:px-4 sm:text-base lg:h-12",
          )}
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}

/** Category navigation row — mirrors CC Computer's storefront menu. */
function CategoryNav() {
  const searchParams = useSearchParams();

  return <CategoryNavItems activeCategory={searchParams.get("category")} />;
}

function CategoryNavFallback() {
  return <CategoryNavItems />;
}

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isCatalogPage = pathname === ROUTES.products;

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--surface-border)] bg-[var(--nav-bg)] shadow-[0_18px_50px_-38px_rgba(0,0,0,0.8)] supports-[backdrop-filter]:backdrop-blur-2xl">
      <div className="mx-auto flex h-[4.5rem] w-full max-w-7xl items-center justify-between gap-4 px-4 sm:gap-5 sm:px-6 lg:gap-6 lg:px-8">
        <Logo />

        <Suspense
          fallback={
            <SearchBoxFallback className="hidden max-w-lg flex-1 md:block" />
          }
        >
          <SearchBox className="hidden max-w-lg flex-1 md:block" />
        </Suspense>

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
                aria-current={isActive ? "page" : undefined}
                className={primaryNavItemClasses(
                  isActive,
                  "px-3.5 py-2.5 text-[15px]",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <a
            href={SITE.phoneHref}
            className="text-foreground/70 hover:text-foreground hidden items-center gap-2 rounded-lg px-2.5 py-2 text-[15px] font-medium tabular-nums transition-colors duration-200 hover:bg-[var(--hover-bg)] lg:flex"
          >
            <Phone className="text-primary size-[18px]" />
            {SITE.phoneDisplay}
          </a>
          <span
            className="hidden h-5 w-px bg-[var(--surface-border)] lg:block"
            aria-hidden
          />
          <ThemeToggle />

          <Button
            type="button"
            variant="ghost"
            size="icon"
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

      {!isCatalogPage && (
        <Suspense fallback={<CategoryNavFallback />}>
          <CategoryNav />
        </Suspense>
      )}

      <div
        id="mobile-nav"
        className={cn(
          "border-t border-[var(--surface-border)] bg-[var(--surface-strong-bg)] backdrop-blur-2xl transition-all duration-300 ease-in-out xl:hidden",
          isMenuOpen
            ? "max-h-[calc(100dvh-7rem)] overflow-y-auto opacity-100"
            : "max-h-0 overflow-hidden opacity-0",
        )}
      >
        <nav
          className="mx-auto grid max-w-7xl gap-1.5 px-4 py-4 sm:px-6"
          aria-label="Mobile primary"
        >
          <Suspense
            fallback={<SearchBoxFallback mobile className="mb-2 md:hidden" />}
          >
            <SearchBox mobile className="mb-2 md:hidden" />
          </Suspense>

          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className={cn(
                "rounded-lg border px-3.5 py-3 text-[15px] font-medium transition-colors duration-200",
                pathname === item.href
                  ? "border-primary/25 bg-primary/10 text-foreground"
                  : "text-foreground/70 hover:text-foreground border-transparent hover:bg-[var(--hover-bg)]",
              )}
            >
              {item.label}
            </Link>
          ))}

          <div className="border-border/60 mt-2 border-t pt-3">
            <p className="text-foreground/60 mb-2 text-[11px] font-semibold tracking-wider uppercase">
              Shop by category
            </p>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_NAV.map((category) => (
                <Link
                  key={category.slug}
                  href={`${ROUTES.products}?category=${category.slug}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-foreground/70 hover:text-foreground rounded-full border border-[var(--surface-border)] bg-[var(--subtle-bg)] px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-200 hover:border-[var(--surface-border-hover)]"
                >
                  {category.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="border-border/60 mt-3 border-t pt-3">
            <p className="text-foreground/60 mb-2 text-[11px] font-semibold tracking-wider uppercase">
              Brands
            </p>
            <div className="flex flex-wrap gap-2">
              {BRAND_NAV.map((brand) => (
                <Link
                  key={brand.label}
                  href={brandNavHref(brand)}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-foreground/70 hover:text-foreground rounded-full border border-[var(--surface-border)] bg-[var(--subtle-bg)] px-3.5 py-1.5 text-[11px] font-semibold tracking-wide uppercase transition-colors duration-200 hover:border-[var(--surface-border-hover)]"
                >
                  {brand.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <a
              href={SITE.phoneHref}
              className="text-foreground/70 hover:text-foreground flex items-center gap-2 text-[15px] font-medium transition-colors duration-200"
            >
              <Phone className="text-primary size-[18px]" />
              {SITE.phoneDisplay}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
