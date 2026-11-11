import Link from "next/link";
import {
  Cable,
  Cpu,
  HardDrive,
  History,
  Keyboard,
  Laptop,
  Monitor,
  Printer,
  Speaker,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import { CATEGORY_NAV, type CategoryNavItem } from "@/constants/site";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import type { ProductCategorySlug } from "@/features/products/types";

export const CATEGORY_ICONS: Record<ProductCategorySlug, LucideIcon> = {
  laptops: Laptop,
  desktops: Monitor,
  "pc-components": Cpu,
  used: History,
  peripherals: Keyboard,
  storage: HardDrive,
  network: Wifi,
  speakers: Speaker,
  printers: Printer,
  accessories: Cable,
};

export function categoryHref(slug: ProductCategorySlug): string {
  return `${ROUTES.products}?category=${slug}`;
}

export interface CategoryLinkProps {
  category: CategoryNavItem;
  compact?: boolean;
  onNavigate?: () => void;
  className?: string;
}

/** One clickable category row used by the sidebar, header menu, and drawer. */
export function CategoryLink({
  category,
  compact,
  onNavigate,
  className,
}: CategoryLinkProps) {
  const Icon = CATEGORY_ICONS[category.slug];

  return (
    <Link
      href={categoryHref(category.slug)}
      onClick={onNavigate}
      title={category.label}
      className={cn(
        "group text-foreground/85 hover:bg-primary/5 hover:text-primary focus-visible:bg-primary/5 flex min-h-11 items-center gap-2.5 rounded-lg px-2.5 text-sm font-medium transition-colors",
        compact && "min-h-11 gap-2 px-2 text-[11px] leading-tight",
        className,
      )}
    >
      <Icon
        className={cn(
          "text-muted-foreground group-hover:text-primary size-4 shrink-0 transition-colors",
          compact && "size-3.5",
        )}
        aria-hidden="true"
      />
      <span
        className={cn(
          "min-w-0 break-words",
          compact ? "line-clamp-2" : "truncate",
        )}
      >
        {category.label}
      </span>
    </Link>
  );
}

/** Full category list for drawers and sheets. */
export function CategoryLinkList({
  onNavigate,
  className,
}: {
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-0.5", className)}>
      {CATEGORY_NAV.map((category) => (
        <CategoryLink
          key={category.slug}
          category={category}
          onNavigate={onNavigate}
        />
      ))}
    </div>
  );
}
