"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ChevronDown,
  Computer,
  LayoutGrid,
  Menu,
  Moon,
  Phone,
  Sun,
} from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SearchBox } from "./SearchBox";
import {
  CATEGORY_ICONS,
  CategoryLink,
  categoryHref,
} from "./CategoryLinks";
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
      aria-label="CamboTech home"
    >
      <span className="bg-primary text-primary-foreground inline-flex size-9 items-center justify-center rounded-lg shadow-sm transition-transform duration-200 group-hover:scale-105">
        <Computer className="size-5" strokeWidth={2.4} />
      </span>
      <span className="hidden flex-col leading-none sm:flex">
        <span className="font-brand text-[15px] font-semibold tracking-tight">
          CamboTech
        </span>
        <span className="text-muted-foreground mt-0.5 text-[10px] font-medium tracking-wide">
          Laptop &amp; PC Store
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
      className="hidden sm:inline-flex"
      onClick={() => dispatch(toggleTheme())}
      aria-label={`Switch theme, currently ${mode}`}
      title="Toggle theme"
    >
      <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}

function AllCategoriesMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="hidden shrink-0 gap-2 lg:inline-flex"
        >
          <LayoutGrid className="size-4" />
          All Categories
          <ChevronDown className="size-3.5 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-60 p-2"
        aria-label="Product categories"
      >
        <DropdownMenuLabel className="px-2 py-1.5">
          Shop by category
        </DropdownMenuLabel>
        {CATEGORY_NAV.map((category) => {
          const Icon = CATEGORY_ICONS[category.slug];
          return (
            <DropdownMenuItem key={category.slug} asChild>
              <Link
                href={categoryHref(category.slug)}
                className="gap-2.5 py-2 text-sm"
              >
                <Icon className="text-muted-foreground size-4" />
                {category.label}
              </Link>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={ROUTES.products} className="py-2 text-sm font-semibold">
            View all products
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/85 sticky top-0 z-40 border-b shadow-[0_1px_2px_-1px_rgba(0,0,0,0.04)] backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center gap-2 px-4 sm:gap-3 sm:px-6 lg:px-8">
        <Logo />
        <AllCategoriesMenu />

        <SearchBox className="min-w-0 flex-1 lg:max-w-2xl" />

        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Primary">
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
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1">
          <Button
            asChild
            size="sm"
            className="hidden lg:inline-flex"
          >
            <Link href={ROUTES.contact}>
              <Phone className="size-3.5" />
              Contact to order
            </Link>
          </Button>
          <ThemeToggle />

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="lg:hidden"
            onClick={() => setIsMenuOpen(true)}
            aria-expanded={isMenuOpen}
            aria-label="Open menu and categories"
          >
            <Menu className="size-5" />
          </Button>
        </div>
      </div>

      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent
          side="left"
          className="w-[88vw] overflow-y-auto p-0 sm:max-w-sm"
        >
          <SheetHeader className="border-b px-4 py-4">
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>

          <div className="space-y-5 px-4 py-4">
            <SearchBox mobile />

            <nav className="grid gap-0.5" aria-label="Mobile primary">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={cn(
                    "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div>
              <p className="text-muted-foreground mb-2 px-1 text-xs font-semibold tracking-wide uppercase">
                Shop by category
              </p>
              <div className="grid gap-0.5">
                {CATEGORY_NAV.map((category) => (
                  <CategoryLink
                    key={category.slug}
                    category={category}
                    onNavigate={closeMenu}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="text-muted-foreground mb-2 px-1 text-xs font-semibold tracking-wide uppercase">
                Brands
              </p>
              <div className="flex flex-wrap gap-1.5">
                {BRAND_NAV.map((brand) => (
                  <Link
                    key={brand.label}
                    href={brandNavHref(brand)}
                    onClick={closeMenu}
                    className="bg-muted text-muted-foreground hover:text-foreground rounded-md px-2.5 py-1.5 text-[11px] font-semibold tracking-wide uppercase transition-colors"
                  >
                    {brand.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <Button asChild className="w-full">
                <Link href={ROUTES.contact} onClick={closeMenu}>
                  <Phone className="size-4" />
                  Contact to order
                </Link>
              </Button>
              <a
                href={SITE.phoneHref}
                className="text-muted-foreground hover:text-foreground mt-3 flex items-center justify-center gap-1.5 text-sm font-semibold transition-colors"
              >
                <Phone className="size-4" />
                {SITE.phoneDisplay}
              </a>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
