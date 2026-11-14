"use client";

import { cn } from "@/lib/utils";
import type { ProductFilters } from "../types";

const EMPTY: string[] = [];

export interface BrandNavProps {
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
  /** All brands present in the catalog. */
  brands: string[];
  className?: string;
}

/**
 * CC Computer style brand navigation bar. Brands are single-select: choosing a
 * new brand replaces the previous selection, and "All brands" clears it.
 */
export function BrandNav({
  filters,
  onChange,
  brands,
  className,
}: BrandNavProps) {
  const activeBrands = filters.brands ?? EMPTY;
  const activeBrand = activeBrands[activeBrands.length - 1];
  const isAllSelected = activeBrands.length === 0;

  const showAllProducts = () =>
    onChange({
      ...filters,
      brands: undefined,
    });

  const selectBrand = (brand: string) => {
    onChange({
      ...filters,
      brands: [brand],
    });
  };

  if (brands.length === 0) return null;

  return (
    <div className={cn("surface-glass space-y-3 rounded-2xl p-4", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground mr-1 text-xs font-semibold tracking-wide uppercase">
          Brands
        </span>
        <button
          type="button"
          onClick={showAllProducts}
          aria-pressed={isAllSelected}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
            isAllSelected
              ? "active-pill text-white"
              : "text-muted-foreground hover:text-foreground border border-[var(--surface-border)] bg-[var(--subtle-bg)]",
          )}
        >
          All brands
        </button>
        {brands.map((brand) => {
          const active = activeBrand === brand;
          return (
            <button
              key={brand}
              type="button"
              onClick={() => selectBrand(brand)}
              aria-pressed={active}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold uppercase transition-colors",
                active
                  ? "active-pill text-white"
                  : "text-muted-foreground hover:text-foreground border border-[var(--surface-border)] bg-[var(--subtle-bg)]",
              )}
            >
              {brand}
            </button>
          );
        })}
      </div>
    </div>
  );
}
