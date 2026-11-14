"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CatalogState } from "../lib/catalogState";
import { CATEGORY_BY_SLUG, resolveBrand } from "../lib/catalogMeta";

export interface CatalogFilterChipsProps {
  state: CatalogState;
  onClear: (patch: Partial<CatalogState>) => void;
  onClearAll: () => void;
}

interface FilterChipProps {
  label: string;
  value: string;
  onRemove: () => void;
}

function FilterChip({ label, value, onRemove }: FilterChipProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[var(--surface-border)] bg-[var(--subtle-bg)] py-1 pr-1 pl-3 text-xs font-medium">
      <span className="text-muted-foreground">{label}:</span>
      <span className="text-foreground max-w-52 truncate">{value}</span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label.toLowerCase()} filter`}
        className="text-muted-foreground hover:text-foreground hover:bg-[var(--hover-bg)] inline-flex size-5 items-center justify-center rounded-full transition-colors"
      >
        <X className="size-3" />
      </button>
    </span>
  );
}

/** Active catalog criteria with individual remove actions and "Clear all". */
export function CatalogFilterChips({
  state,
  onClear,
  onClearAll,
}: CatalogFilterChipsProps) {
  const brand = state.brands[0] ? resolveBrand(state.brands[0]).name : undefined;
  const category = state.category
    ? CATEGORY_BY_SLUG.get(state.category)?.name
    : undefined;
  const hasFilters =
    Boolean(state.search) ||
    Boolean(brand) ||
    Boolean(category) ||
    state.series.length > 0 ||
    Boolean(state.modelKey);

  if (!hasFilters) return null;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-2xl border border-[var(--surface-border)] bg-[var(--subtle-bg)] px-3 py-2",
      )}
    >
      <span className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
        Active
      </span>

      {state.search ? (
        <FilterChip
          label="Search"
          value={`“${state.search}”`}
          onRemove={() => onClear({ search: undefined })}
        />
      ) : null}

      {brand ? (
        <FilterChip
          label="Brand"
          value={brand}
          onRemove={() => onClear({ brands: [] })}
        />
      ) : null}

      {category ? (
        <FilterChip
          label="Category"
          value={category}
          onRemove={() => onClear({ category: undefined })}
        />
      ) : null}

      {state.series.map((series) => (
        <FilterChip
          key={series}
          label="Series"
          value={series}
          onRemove={() =>
            onClear({ series: state.series.filter((item) => item !== series) })
          }
        />
      ))}

      {state.modelKey ? (
        <FilterChip
          label="Model"
          value={state.modelKey}
          onRemove={() => onClear({ modelKey: undefined })}
        />
      ) : null}

      <Button
        variant="ghost"
        size="xs"
        onClick={onClearAll}
        className="ml-auto"
      >
        Clear all
      </Button>
    </div>
  );
}
