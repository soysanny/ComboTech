"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { ProductFilters } from "../types";

const EMPTY: string[] = [];

export interface BrandNavProps {
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
  /** All brands present in the catalog. */
  brands: string[];
  /** Map of brand -> series offered by that brand. */
  seriesByBrand: Record<string, string[]>;
  className?: string;
}

/**
 * Compact brand / series filter bar. Brands scroll horizontally on small
 * screens; series only appear once a brand is selected.
 */
export function BrandNav({
  filters,
  onChange,
  brands,
  seriesByBrand,
  className,
}: BrandNavProps) {
  const activeBrands = filters.brands ?? EMPTY;
  const activeSeries = filters.series ?? EMPTY;

  const visibleSeries = useMemo(() => {
    if (activeBrands.length === 0) return [];
    const set = new Set<string>();
    activeBrands.forEach((brand) =>
      (seriesByBrand[brand] ?? []).forEach((series) => set.add(series)),
    );
    return Array.from(set).sort();
  }, [activeBrands, seriesByBrand]);

  const toggleBrand = (brand: string) => {
    const next = activeBrands.includes(brand)
      ? activeBrands.filter((value) => value !== brand)
      : [...activeBrands, brand];
    onChange({
      ...filters,
      brands: next.length > 0 ? next : undefined,
      series: undefined,
    });
  };

  const toggleSeries = (series: string) => {
    const next = activeSeries.includes(series)
      ? activeSeries.filter((value) => value !== series)
      : [...activeSeries, series];
    onChange({ ...filters, series: next.length > 0 ? next : undefined });
  };

  if (brands.length === 0) return null;

  return (
    <div
      className={cn(
        "bg-card space-y-2.5 rounded-xl border p-3 shadow-sm",
        className,
      )}
    >
      <div className="no-scrollbar -mx-1 flex items-center gap-2 overflow-x-auto px-1">
        <span className="text-muted-foreground shrink-0 text-[11px] font-semibold tracking-wide uppercase">
          Brands
        </span>
        <button
          type="button"
          onClick={() =>
            onChange({ ...filters, brands: undefined, series: undefined })
          }
          aria-pressed={activeBrands.length === 0}
          className={cn(
            "min-h-9 shrink-0 rounded-full px-3 text-xs font-semibold whitespace-nowrap transition-colors",
            activeBrands.length === 0
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:text-foreground",
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
              aria-pressed={active}
              className={cn(
                "min-h-9 shrink-0 rounded-full px-3 text-xs font-semibold whitespace-nowrap uppercase transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              {brand}
            </button>
          );
        })}
      </div>

      {visibleSeries.length > 0 && (
        <div className="no-scrollbar border-border/60 -mx-1 flex items-center gap-2 overflow-x-auto border-t px-1 pt-2.5">
          <span className="text-muted-foreground shrink-0 text-[11px] font-semibold tracking-wide uppercase">
            Series
          </span>
          {visibleSeries.map((series) => {
            const active = activeSeries.includes(series);
            return (
              <button
                key={series}
                type="button"
                onClick={() => toggleSeries(series)}
                aria-pressed={active}
                className={cn(
                  "min-h-8 shrink-0 rounded-full border px-2.5 text-[11px] whitespace-nowrap transition-colors",
                  active
                    ? "border-primary bg-primary/10 text-primary font-semibold"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
                )}
              >
                {series}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
