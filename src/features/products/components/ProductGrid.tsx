"use client";

import { ProductCard } from "@/components/cards/ProductCard";
import { Skeleton } from "@/components/shared/Skeleton";
import type { Product } from "../types";

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
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-card ring-foreground/5 flex flex-col overflow-hidden rounded-2xl shadow-sm ring-1"
        >
          <Skeleton className="aspect-square w-full rounded-none" />
          <div className="space-y-3 p-4">
            <Skeleton className="h-3 w-1/3" />
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
