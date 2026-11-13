"use client";

import { ProductCard } from "@/components/cards/ProductCard";
import { Skeleton } from "@/components/shared/Skeleton";
import type { Product } from "../types";

const GRID_CLASSES =
  "grid grid-cols-2 items-stretch gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6";

const SECTION_CLASSES = "surface-glass rounded-3xl p-3 sm:p-4";

export interface ProductGridProps {
  products: Product[];
  compareIds?: string[];
  onToggleCompare?: (id: string) => void;
}

/** Responsive grid of product cards with optional comparison selection. */
export function ProductGrid({
  products,
  compareIds,
  onToggleCompare,
}: ProductGridProps) {
  return (
    <div className={`${SECTION_CLASSES} ${GRID_CLASSES}`}>
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

/** Skeleton placeholder matching the product card layout. */
export function ProductGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className={`${SECTION_CLASSES} ${GRID_CLASSES}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="surface-glass flex h-full flex-col overflow-hidden rounded-2xl"
        >
          <Skeleton className="aspect-square w-full rounded-none" />
          <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="mt-2 h-5 w-2/5" />
            <div className="mt-auto pt-3">
              <Skeleton className="h-8 w-full rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
