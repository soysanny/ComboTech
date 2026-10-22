"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, Eye, Phone, Heart, Scale, Gift } from "lucide-react";
import type { Product } from "@/features/products/types";
import { ROUTES } from "@/constants/routes";
import { formatCurrency } from "@/utils/formatCurrency";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export interface ProductCardProps {
  product: Product;
  isComparing?: boolean;
  onToggleCompare?: (id: string) => void;
}

interface SpecLine {
  label: string;
  value: string;
}

/** Build the compact spec rows shown on the card (CC Computer style). */
function buildSpecLines(product: Product): SpecLine[] {
  const { specs } = product;
  const lines: SpecLine[] = [];

  const push = (label: string, value?: string) => {
    if (value && value.trim() && value.trim().toLowerCase() !== "no") {
      lines.push({ label, value: value.trim() });
    }
  };

  push("CPU", specs.cpu);
  push("RAM", specs.ram);
  push("SSD", specs.ssd ?? specs.storage);
  push("Display", specs.display);
  push("GPU", specs.gpu);
  push("OS", specs.os);

  const weightColor = [specs.weight, specs.color]
    .filter((v) => v && v.trim())
    .join(" | ");
  push("Weight", weightColor);

  return lines.slice(0, 7);
}

/** Storefront product card: thumbnail, price, dense specs, and free gifts. */
export function ProductCard({
  product,
  isComparing,
  onToggleCompare,
}: ProductCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

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

  const specLines = buildSpecLines(product);
  const freeGifts = product.freeGifts ?? [];

  return (
    <article className="group/card bg-card text-card-foreground ring-foreground/5 hover:ring-primary/20 flex flex-col overflow-hidden rounded-2xl shadow-[0_2px_6px_-2px_rgba(0,0,0,0.05),0_8px_24px_-8px_rgba(0,0,0,0.06)] ring-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.12),0_4px_10px_-3px_rgba(0,0,0,0.05)]">
      <Link href={ROUTES.productDetail(product.id)} className="contents">
        <div className="bg-muted relative aspect-square w-full overflow-hidden">
          {product.thumbnail && !imageFailed ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.thumbnail}
              alt={product.name}
              className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover/card:scale-[1.05]"
              onError={() => setImageFailed(true)}
              loading="lazy"
            />
          ) : (
            <div className="text-muted-foreground flex h-full w-full items-center justify-center text-5xl font-bold">
              {product.name.charAt(0)}
            </div>
          )}

          <div className="absolute top-3 left-3 flex max-w-[85%] flex-wrap gap-1.5">
            {product.badge ? (
              <Badge
                variant={
                  /vip/i.test(product.badge) ? "default" : "secondary"
                }
                className="h-5 px-1.5 text-[10px] font-bold uppercase"
              >
                {product.badge}
              </Badge>
            ) : (
              <>
                {product.isNewArrival && (
                  <Badge className="h-5 px-1.5 text-[10px] font-bold">
                    New
                  </Badge>
                )}
                {product.isBestSeller && (
                  <Badge
                    variant="secondary"
                    className="h-5 px-1.5 text-[10px] font-bold"
                  >
                    Best seller
                  </Badge>
                )}
              </>
            )}
            {hasDiscount && (
              <Badge
                variant="destructive"
                className="h-5 px-1.5 text-[10px] font-bold"
              >
                -{discountPercent}%
              </Badge>
            )}
          </div>

          {isOutOfStock && (
            <span className="bg-foreground/85 absolute top-3 right-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
              Out of stock
            </span>
          )}

          <div className="absolute inset-x-3 bottom-3 flex translate-y-2 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover/card:translate-y-0 group-hover/card:opacity-100">
            <Button
              type="button"
              variant="secondary"
              size="icon-sm"
              className="shadow-lg"
              aria-label="Add to wishlist"
              onClick={(event) => event.preventDefault()}
            >
              <Heart className="size-4" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon-sm"
              className="shadow-lg"
              aria-label="Quick view"
              onClick={(event) => {
                event.preventDefault();
                setIsQuickViewOpen((open) => !open);
              }}
            >
              <Eye className="size-4" />
            </Button>
            {onToggleCompare && (
              <label
                className="bg-secondary text-secondary-foreground shadow-lg flex size-8 cursor-pointer items-center justify-center rounded-lg"
                onClick={(event) => event.preventDefault()}
                title="Compare"
              >
                <Scale className="text-muted-foreground absolute size-4" />
                <Checkbox
                  checked={isComparing}
                  onCheckedChange={() => onToggleCompare(product.id)}
                  className="size-4 opacity-0"
                  aria-label="Compare product"
                />
              </label>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            {product.brand}
            {product.series ? ` · ${product.series}` : ""}
          </p>
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
            {product.name}
          </h3>

          <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
            <span className="text-foreground font-semibold">
              {product.rating.toFixed(1)}
            </span>
            <span>({product.reviewCount})</span>
            <span className="text-border mx-1">•</span>
            <span>{product.soldCount.toLocaleString()} sold</span>
          </div>

          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-base font-bold text-rose-600 dark:text-rose-400">
              {formatCurrency(product.price, product.currency)}
            </span>
            {hasDiscount && (
              <span className="text-muted-foreground text-xs line-through">
                {formatCurrency(product.originalPrice!, product.currency)}
              </span>
            )}
          </div>

          {specLines.length > 0 && (
            <dl className="border-border/60 mt-1 space-y-0.5 border-t pt-2 text-xs leading-relaxed">
              {specLines.map((line) => (
                <div key={line.label} className="flex gap-1.5">
                  <dt className="text-muted-foreground shrink-0 font-medium">
                    {line.label}:
                  </dt>
                  <dd className="text-foreground/90 line-clamp-1 flex-1">
                    {line.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          {product.productCode && (
            <p className="text-muted-foreground/80 text-[11px]">
              Code: <span className="font-medium">{product.productCode}</span>
            </p>
          )}

          {freeGifts.length > 0 && (
            <ul className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              {freeGifts.slice(0, 2).map((gift, index) => (
                <li key={index} className="flex items-start gap-1">
                  <Gift className="mt-0.5 size-3 shrink-0" />
                  <span className="line-clamp-1">Free: {gift}</span>
                </li>
              ))}
            </ul>
          )}

          {isLowStock && (
            <p className="text-destructive text-xs font-medium">
              Only {product.stock} left in stock
            </p>
          )}
        </div>
      </Link>

      <div className="px-4 pb-4">
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
          className={`grid transition-all duration-300 ${
            isQuickViewOpen
              ? "mt-3 grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
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
