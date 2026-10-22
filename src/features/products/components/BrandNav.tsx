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
 * CC Computer style brand / series navigation bar. Selecting a brand filters the
 * catalog and reveals that brand's product lines (Vivobook, Legion, TUF...).
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
    const source =
      activeBrands.length > 0
        ? activeBrands
        : Object.keys(seriesByBrand);
    const set = new Set<string>();
    source.forEach((brand) =>
      (seriesByBrand[brand] ?? []).forEach((s) => set.add(s)),
    );
    return Array.from(set).sort();
  }, [activeBrands, seriesByBrand]);

  const toggleBrand = (brand: string) => {
    const next = activeBrands.includes(brand)
      ? activeBrands.filter((b) => b !== brand)
      : [...activeBrands, brand];
    onChange({
      ...filters,
      brands: next.length > 0 ? next : undefined,
      series: undefined,
    });
  };

  const toggleSeries = (series: string) => {
    const next = activeSeries.includes(series)
      ? activeSeries.filter((s) => s !== series)
      : [...activeSeries, series];
    onChange({ ...filters, series: next.length > 0 ? next : undefined });
  };

  if (brands.length === 0) return null;

  return (
    <div
      className={cn(
        "bg-card ring-foreground/5 space-y-3 rounded-2xl p-4 shadow-sm ring-1",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground mr-1 text-xs font-semibold tracking-wide uppercase">
          Brands
        </span>
        <button
          type="button"
          onClick={() =>
            onChange({ ...filters, brands: undefined, series: undefined })
          }
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
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
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold uppercase transition-colors",
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
        <div className="border-border/60 flex flex-wrap items-center gap-2 border-t pt-3">
          <span className="text-muted-foreground mr-1 text-xs font-semibold tracking-wide uppercase">
            Series
          </span>
          {visibleSeries.map((series) => {
            const active = activeSeries.includes(series);
            return (
              <button
                key={series}
                type="button"
                onClick={() => toggleSeries(series)}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-xs transition-colors",
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
