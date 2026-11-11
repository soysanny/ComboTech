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
 * CC Computer style brand navigation bar. Selecting a brand filters the
 * catalog by that brand.
 */
export function BrandNav({
  filters,
  onChange,
  brands,
  className,
}: BrandNavProps) {
  const activeBrands = filters.brands ?? EMPTY;
  const isAllSelected =
    activeBrands.length === 0 &&
    !filters.category &&
    !filters.cpu?.length &&
    !filters.gpu?.length &&
    !filters.ram?.length &&
    !filters.storage?.length &&
    !filters.screenSize?.length &&
    !filters.ssd &&
    !filters.hdd &&
    filters.minPrice === undefined &&
    filters.maxPrice === undefined &&
    !filters.inStockOnly;

  const showAllProducts = () =>
    onChange({
      search: filters.search,
      sort: filters.sort,
    });

  const toggleBrand = (brand: string) => {
    const next = activeBrands.includes(brand)
      ? activeBrands.filter((b) => b !== brand)
      : [...activeBrands, brand];
    onChange({
      ...filters,
      brands: next.length > 0 ? next : undefined,
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
          All
        </button>
        {brands.map((brand) => {
          const active = activeBrands.includes(brand);
          return (
            <button
              key={brand}
              type="button"
              onClick={() => toggleBrand(brand)}
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
