"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Heart, Phone, Scale } from "lucide-react";
import type { Product } from "@/features/products/types";
import { StarRating } from "@/features/review";
import { ROUTES } from "@/constants/routes";
import { formatCurrency } from "@/utils/formatCurrency";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ProductCardProps {
  product: Product;
  isComparing?: boolean;
  onToggleCompare?: (id: string) => void;
}

/** One-line CPU / RAM / storage summary for the card. */
function buildSpecLine(product: Product): string {
  return [
    product.specs.cpu,
    product.specs.ram,
    product.specs.ssd ?? product.specs.storage,
  ]
    .filter((value): value is string => Boolean(value?.trim()))
    .join(" · ");
}

/** Storefront product card in the M.Video layout: image, price, short specs. */
export function ProductCard({
  product,
  isComparing,
  onToggleCompare,
}: ProductCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

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
  const specLine = buildSpecLine(product);
  const productHref = ROUTES.productDetail(product.id);

  const toggleWishlist = () => setIsWishlisted((saved) => !saved);

  const productImage =
    product.thumbnail && !imageFailed ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={product.thumbnail}
        alt={product.name}
        className="h-full w-full object-contain transition-transform duration-500 group-hover/card:scale-[1.04]"
        onError={() => setImageFailed(true)}
        loading="lazy"
        decoding="async"
      />
    ) : (
      <span className="text-muted-foreground flex h-full w-full items-center justify-center text-5xl font-bold">
        {product.name.charAt(0)}
      </span>
    );

  const cardDetails = (
    <>
      <p className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
        {product.brand}
        {product.series ? ` · ${product.series}` : ""}
      </p>

      <h3 className="line-clamp-2 min-h-[2.5rem] text-sm leading-snug font-semibold">
        {product.name}
      </h3>

      {product.reviewCount > 0 && (
        <div className="flex items-center gap-1.5">
          <StarRating value={product.rating} size={12} />
          <span className="text-muted-foreground text-xs">
            ({product.reviewCount})
          </span>
        </div>
      )}

      {specLine && (
        <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
          {specLine}
        </p>
      )}

      <div className="mt-auto flex flex-wrap items-baseline gap-x-2 gap-y-0.5 pt-1.5">
        <span className="text-lg font-bold tracking-tight sm:text-xl">
          {formatCurrency(product.price, product.currency)}
        </span>
        {hasDiscount && (
          <span className="text-muted-foreground text-xs line-through sm:text-sm">
            {formatCurrency(product.originalPrice!, product.currency)}
          </span>
        )}
      </div>
    </>
  );

  return (
    <article className="group/card text-card-foreground hover:border-primary/35 surface-glass surface-hover relative flex h-full flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_-36px_rgba(37,99,235,0.28)]">
      <div className="surface-inset relative aspect-square w-full overflow-hidden">
        <Link
          href={productHref}
          className="absolute inset-0 block p-3 sm:p-4"
          aria-label={product.name}
        >
          {productImage}
        </Link>

        <div className="pointer-events-none absolute top-2.5 left-2.5 z-10 flex max-w-[70%] flex-col items-start gap-1">
          {hasDiscount && (
            <Badge className="h-6 rounded-md bg-rose-600 px-1.5 text-xs font-bold text-white shadow-sm">
              -{discountPercent}%
            </Badge>
          )}
          {!hasDiscount && product.badge && (
            <Badge
              variant={/vip/i.test(product.badge) ? "default" : "secondary"}
              className="h-5 px-1.5 text-[10px] font-bold uppercase"
            >
              {product.badge}
            </Badge>
          )}
          {isOutOfStock && (
            <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
              Out of stock
            </Badge>
          )}
        </div>

        <button
          type="button"
          onClick={toggleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={isWishlisted}
          className="text-muted-foreground absolute top-2.5 right-2.5 z-20 inline-flex size-8 items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--surface-bg)] shadow-sm backdrop-blur-md transition-colors hover:bg-[var(--surface-bg-hover)] hover:text-rose-500 dark:hover:text-rose-400"
        >
          <Heart
            className={cn(
              "size-4",
              isWishlisted && "fill-rose-500 text-rose-500",
            )}
          />
        </button>

        <div className="absolute inset-x-3 bottom-3 z-20 flex translate-y-2 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover/card:translate-y-0 group-hover/card:opacity-100">
          <Button
            type="button"
            variant="secondary"
            size="icon-sm"
            className="shadow-lg"
            aria-label="Quick view"
            aria-pressed={isQuickViewOpen}
            onClick={() => setIsQuickViewOpen((open) => !open)}
          >
            <Eye className="size-4" />
          </Button>
          {onToggleCompare && (
            <Button
              type="button"
              variant={isComparing ? "default" : "secondary"}
              size="icon-sm"
              className="shadow-lg"
              aria-label={
                isComparing ? "Remove from comparison" : "Add to comparison"
              }
              aria-pressed={isComparing}
              onClick={() => onToggleCompare(product.id)}
            >
              <Scale className="size-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <Link href={productHref} className="flex flex-1 flex-col gap-1.5">
          {cardDetails}
        </Link>
      </div>

      <div className="px-3 pb-3 sm:px-4 sm:pb-4">
        <Button
          asChild
          variant={isOutOfStock ? "secondary" : "default"}
          size="sm"
          className="w-full"
        >
          <Link href={ROUTES.contact}>
            <Phone className="mr-1.5 size-3.5" />
            {isOutOfStock ? "Ask about restock" : "Contact to order"}
          </Link>
        </Button>

        <div
          className={cn(
            "grid transition-all duration-300",
            isQuickViewOpen
              ? "mt-3 grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0",
          )}
        >
          <div className="overflow-hidden">
            <p className="text-muted-foreground text-xs leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
