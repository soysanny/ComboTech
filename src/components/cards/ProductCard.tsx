"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Phone, Scale } from "lucide-react";
import type { Product } from "@/features/products/types";
import { ROUTES } from "@/constants/routes";
import { formatCurrency } from "@/utils/formatCurrency";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getProductImageSrc } from "@/features/products/lib/productImages";
import { recordCatalogReturnTarget } from "@/features/products/lib/catalogNavigation";
import { cn } from "@/lib/utils";

export interface ProductCardProps {
  product: Product;
  isComparing?: boolean;
  onToggleCompare?: (id: string) => void;
}

type ImageStatus = "loading" | "loaded" | "error";

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

interface Pricing {
  price: number;
  originalPrice?: number;
  hasDiscount: boolean;
  discountPercent: number;
  showDiscountBadge: boolean;
}

function getPricing(product: Product): Pricing {
  const price = Number.isFinite(product.price) ? product.price : 0;
  const originalPrice =
    typeof product.originalPrice === "number" &&
    Number.isFinite(product.originalPrice)
      ? product.originalPrice
      : undefined;
  const hasDiscount = originalPrice !== undefined && originalPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return {
    price,
    originalPrice,
    hasDiscount,
    discountPercent,
    showDiscountBadge: hasDiscount && discountPercent >= 1,
  };
}

function ProductImage({
  src,
  alt,
  productName,
}: {
  src: string | null;
  alt: string;
  productName: string;
}) {
  const [status, setStatus] = useState<ImageStatus>(src ? "loading" : "error");

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {status === "loading" && (
        <span
          aria-hidden
          className="absolute inset-0 animate-pulse rounded-xl bg-[var(--hover-bg)]"
        />
      )}

      {src && status !== "error" && (
        // Product images are arbitrary remote/local URLs, so a plain img keeps
        // them working without host allow-list changes.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={cn(
            "h-full w-full object-contain transition-opacity duration-300",
            status === "loaded" ? "opacity-100" : "opacity-0",
          )}
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      )}

      {status === "error" && (
        <div
          role="img"
          aria-label={`${productName} image coming soon`}
          className="surface-inset flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl px-4 text-center"
        >
          <span className="bg-[var(--surface-bg)] text-muted-foreground inline-flex size-12 items-center justify-center rounded-full border border-[var(--surface-border)] text-lg font-bold">
            {productName.charAt(0).toUpperCase()}
          </span>
          <span className="text-muted-foreground text-[11px] font-medium">
            Image coming soon
          </span>
        </div>
      )}
    </div>
  );
}

function PriceBlock({
  product,
  pricing,
  size = "card",
}: {
  product: Product;
  pricing: Pricing;
  size?: "card" | "dialog";
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-baseline gap-x-2 gap-y-0.5",
        size === "card" ? "min-h-7 pt-3" : "",
      )}
    >
      <span
        className={cn(
          "font-bold tracking-tight whitespace-nowrap",
          size === "card" ? "text-lg sm:text-xl" : "text-2xl",
        )}
      >
        {formatCurrency(pricing.price, product.currency)}
      </span>
      {pricing.hasDiscount && (
        <span
          className={cn(
            "text-muted-foreground line-through whitespace-nowrap",
            size === "card" ? "text-xs sm:text-sm" : "text-base",
          )}
        >
          {formatCurrency(pricing.originalPrice!, product.currency)}
        </span>
      )}
    </div>
  );
}

function QuickViewDialog({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const imageSrc = getProductImageSrc(product);
  const pricing = getPricing(product);
  const specLine = buildSpecLine(product);
  const productHref = ROUTES.productDetail(product.id);
  const rememberReturnPosition = () => recordCatalogReturnTarget(product.id);

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">
            {product.name}
          </DialogTitle>
          <DialogDescription>
            {product.brand}
            {product.series ? ` · ${product.series}` : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="surface-inset relative aspect-square overflow-hidden rounded-xl p-4">
            <ProductImage
              key={imageSrc ?? "fallback"}
              src={imageSrc}
              alt={product.name}
              productName={product.name}
            />
          </div>

          <div className="flex flex-col gap-4">
            <PriceBlock product={product} pricing={pricing} size="dialog" />

            {specLine && (
              <p className="text-muted-foreground text-sm leading-relaxed">
                {specLine}
              </p>
            )}

            <p className="text-muted-foreground line-clamp-5 text-sm leading-relaxed">
              {product.description}
            </p>

            <div className="mt-auto flex flex-col gap-2">
              <Button asChild>
                <Link href={productHref} onClick={rememberReturnPosition}>
                  View full details
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={ROUTES.contact}>
                  <Phone className="mr-1.5 size-4" />
                  Contact to order
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Storefront product card in the M.Video layout: image, price, short specs. */
export function ProductCard({
  product,
  isComparing,
  onToggleCompare,
}: ProductCardProps) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const pricing = getPricing(product);
  const isOutOfStock = product.stock <= 0;
  const specLine = buildSpecLine(product);
  const imageSrc = getProductImageSrc(product);
  const productHref = ROUTES.productDetail(product.id);
  const brandLine = `${product.brand}${product.series ? ` · ${product.series}` : ""}`;
  const rememberReturnPosition = () => recordCatalogReturnTarget(product.id);

  const cardDetails = (
    <>
      <p
        className="text-muted-foreground line-clamp-1 min-h-4 text-[11px] font-medium tracking-wide uppercase"
        title={brandLine}
      >
        {brandLine}
      </p>

      <h3
        className="line-clamp-2 min-h-[2.5rem] text-sm leading-snug font-semibold break-words"
        title={product.name}
      >
        {product.name}
      </h3>

      {specLine && (
        <p className="text-muted-foreground line-clamp-1 text-xs leading-relaxed">
          {specLine}
        </p>
      )}

      <div className="mt-auto">
        <PriceBlock product={product} pricing={pricing} />
      </div>
    </>
  );

  return (
    <>
      <article className="group/card text-card-foreground surface-glass surface-hover hover:border-primary/35 relative flex h-full flex-col overflow-hidden rounded-2xl transition-[border-color,background-color,box-shadow] duration-200 hover:shadow-[0_24px_60px_-40px_rgba(37,99,235,0.35)]">
        <div className="surface-inset relative aspect-square w-full overflow-hidden">
          <Link
            href={productHref}
            onClick={rememberReturnPosition}
            className="absolute inset-0 flex items-center justify-center p-3 sm:p-4"
            aria-label={`View ${product.name}`}
          >
            <ProductImage
              key={imageSrc ?? "fallback"}
              src={imageSrc}
              alt={product.name}
              productName={product.name}
            />
          </Link>

          <div className="pointer-events-none absolute top-2.5 left-2.5 z-10 flex max-w-[70%] flex-col items-start gap-1">
            {pricing.showDiscountBadge && (
              <Badge className="h-6 rounded-md bg-rose-600 px-1.5 text-xs font-bold text-white shadow-sm">
                -{pricing.discountPercent}%
              </Badge>
            )}
            {!pricing.showDiscountBadge && product.badge && (
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

          <div
            className={cn(
              "absolute inset-x-3 bottom-3 z-20 flex items-center justify-center gap-2 transition-all duration-200",
              "pointer-events-none translate-y-1 opacity-0",
              "group-hover/card:pointer-events-auto group-hover/card:translate-y-0 group-hover/card:opacity-100",
              "group-focus-within/card:pointer-events-auto group-focus-within/card:translate-y-0 group-focus-within/card:opacity-100",
              "[@media(hover:none)]:pointer-events-auto [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100",
            )}
          >
            <Button
              type="button"
              variant="secondary"
              size="icon-sm"
              className="shadow-lg"
              aria-label={`Quick view: ${product.name}`}
              aria-pressed={isQuickViewOpen}
              onClick={() => setIsQuickViewOpen(true)}
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
                  isComparing
                    ? `Remove ${product.name} from comparison`
                    : `Add ${product.name} to comparison`
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
          <Link
            href={productHref}
            onClick={rememberReturnPosition}
            className="flex flex-1 flex-col gap-1.5"
          >
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
        </div>
      </article>

      {isQuickViewOpen && (
        <QuickViewDialog
          product={product}
          onClose={() => setIsQuickViewOpen(false)}
        />
      )}
    </>
  );
}
