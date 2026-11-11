"use client";

import { ProductCard } from "@/components/cards/ProductCard";
import { Skeleton } from "@/components/shared/Skeleton";
import { cn } from "@/lib/utils";
import type { Product } from "../types";

export const PRODUCT_GRID_CLASSES =
  "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 min-[1380px]:grid-cols-6!";
export const BRAND_PRODUCT_GRID_CLASSES =
  "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4";

export interface ProductGridProps {
  products: Product[];
  compareIds?: string[];
  onToggleCompare?: (id: string) => void;
  columns?: "standard" | "compact4";
  className?: string;
}

/** Responsive grid of product cards with optional comparison selection. */
export function ProductGrid({
  products,
  compareIds,
  onToggleCompare,
  columns = "standard",
  className,
}: ProductGridProps) {
  return (
    <div
      className={cn(
        columns === "compact4"
          ? BRAND_PRODUCT_GRID_CLASSES
          : PRODUCT_GRID_CLASSES,
        className,
      )}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isComparing={compareIds?.includes(product.id)}
          onToggleCompare={onToggleCompare}
        />
      ))}
    </div>
  );
}

/** Skeleton placeholder for the product grid. */
export function ProductGridSkeleton({
  count = 8,
  columns = "standard",
  className,
}: {
  count?: number;
  columns?: "standard" | "compact4";
  className?: string;
}) {
  return (
    <div
      className={cn(
        columns === "compact4"
          ? BRAND_PRODUCT_GRID_CLASSES
          : PRODUCT_GRID_CLASSES,
        className,
      )}
      aria-hidden
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-card flex h-full flex-col overflow-hidden rounded-xl border shadow-sm"
        >
          <Skeleton className="aspect-square w-full rounded-none" />
          <div className="space-y-2 p-3">
            <Skeleton className="h-2.5 w-1/3" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-8 w-full rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
