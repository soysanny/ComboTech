"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Scale } from "lucide-react";
import type { Product } from "@/features/products/types";
import { ROUTES } from "@/constants/routes";
import { CATEGORY_NAV } from "@/constants/site";
import { formatCurrency } from "@/utils/formatCurrency";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ProductCardProps {
  product: Product;
  isComparing?: boolean;
  onToggleCompare?: (id: string) => void;
}

/** Short, useful spec line for the compact homepage/catalog card. */
function buildSpecSummary(product: Product): string {
  const { specs } = product;
  const values = [
    specs.cpu,
    specs.ram,
    specs.ssd ?? specs.storage,
    specs.display,
  ]
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value) && value !== "No");

  return values.slice(0, 3).join(" · ");
}

/** Consistent product card: image, name, compact specs, price and order CTA. */
export function ProductCard({
  product,
  isComparing,
  onToggleCompare,
}: ProductCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage =
    Boolean(product.thumbnail) &&
    !product.thumbnail.endsWith("/placeholder.svg");

  const hasDiscount =
    typeof product.originalPrice === "number" &&
    product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.originalPrice! - product.price) / product.originalPrice!) *
          100,
      )
    : 0;

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const specSummary = buildSpecSummary(product);
  const categoryLabel =
    CATEGORY_NAV.find((category) => category.slug === product.category)?.label ??
    product.category.replace(/-/g, " ");
  const brandLabel =
    product.brand && product.brand.toUpperCase() !== "OTHER"
      ? product.brand
      : categoryLabel;
  const seriesLabel =
    product.series &&
    product.series.toUpperCase() !== "OTHER" &&
    product.series.toLowerCase() !== product.brand.toLowerCase()
      ? product.series
      : null;
  const specLine =
    specSummary || (brandLabel !== categoryLabel ? categoryLabel : "");
  const rawBadge = product.badge?.trim();
  const meaningfulBadge =
    rawBadge && !/^(default company|default|none|n\/a)$/i.test(rawBadge)
      ? rawBadge
      : null;
  const badge = meaningfulBadge
    ? meaningfulBadge
    : product.isNewArrival
      ? "New"
      : product.isBestSeller
        ? "Best seller"
        : null;

  return (
    <article className="group/card bg-card text-card-foreground hover:border-primary/30 flex h-full flex-col overflow-hidden rounded-xl border shadow-sm transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div className="bg-muted/25 relative aspect-square w-full overflow-hidden">
        <Link
          href={ROUTES.productDetail(product.id)}
          className="absolute inset-0 block p-2 focus-visible:outline-none"
          aria-label={product.name}
        >
          {hasImage && !imageFailed ? (
            <Image
              src={product.thumbnail}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1440px) 20vw, 16vw"
              className="object-contain p-1.5 transition-transform duration-300 group-hover/card:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover/card:scale-100"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <span className="text-muted-foreground bg-muted flex h-full w-full items-center justify-center rounded-lg text-4xl font-bold uppercase">
              {product.name.charAt(0)}
            </span>
          )}
        </Link>

        <div className="pointer-events-none absolute top-2 left-2 flex max-w-[80%] flex-wrap gap-1">
          {badge && (
            <Badge
              variant={/vip/i.test(badge) ? "default" : "secondary"}
              className="h-5 px-1.5 text-[10px] font-semibold"
            >
              {badge}
            </Badge>
          )}
          {hasDiscount && (
            <Badge
              variant="destructive"
              className="h-5 px-1.5 text-[10px] font-semibold"
            >
              -{discountPercent}%
            </Badge>
          )}
        </div>

        {isOutOfStock && (
          <span className="bg-foreground/85 absolute top-2 right-2 rounded-md px-1.5 py-0.5 text-[10px] font-semibold text-white">
            Out of stock
          </span>
        )}

        {onToggleCompare && (
          <Button
            type="button"
            variant={isComparing ? "default" : "secondary"}
            size="icon-xs"
            className="absolute bottom-2 right-2 shadow-sm"
            aria-label={
              isComparing ? "Remove from comparison" : "Add to comparison"
            }
            aria-pressed={isComparing}
            onClick={() => onToggleCompare(product.id)}
          >
            <Scale className="size-3" />
          </Button>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <p className="text-muted-foreground truncate text-[10px] font-semibold tracking-wide uppercase">
          {brandLabel}
          {seriesLabel ? ` · ${seriesLabel}` : ""}
        </p>

        <Link
          href={ROUTES.productDetail(product.id)}
          className="hover:text-primary line-clamp-2 min-h-[2.5rem] text-sm leading-snug font-semibold transition-colors"
        >
          {product.name}
        </Link>

        <p className="text-muted-foreground line-clamp-1 min-h-[1.05rem] text-[11px] leading-tight">
          {specLine || "\u00A0"}
        </p>

        <div className="mt-auto flex flex-wrap items-baseline gap-x-2 gap-y-0.5 pt-1">
          <span className="text-[15px] font-bold tracking-tight">
            {formatCurrency(product.price, product.currency)}
          </span>
          {hasDiscount && (
            <span className="text-muted-foreground text-[11px] line-through">
              {formatCurrency(product.originalPrice!, product.currency)}
            </span>
          )}
        </div>

        {isLowStock && (
          <p className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
            Only {product.stock} left
          </p>
        )}
      </div>

      <div className="px-3 pt-0 pb-3">
        <Button
          asChild
          variant={isOutOfStock ? "outline" : "default"}
          size="sm"
          className={cn("h-8 w-full", isOutOfStock && "text-muted-foreground")}
        >
          <Link href={ROUTES.contact}>
            <Phone className="size-3.5" />
            {isOutOfStock ? "Ask about restock" : "Contact to order"}
          </Link>
        </Button>
      </div>
    </article>
  );
}
