"use client";

import { Suspense, useMemo } from "react";
import { Scale } from "lucide-react";
import {
  ComparisonTable,
  ProductGrid,
  ProductGridSkeleton,
  useProducts,
} from "@/features/products";
import { BrandNav } from "./BrandNav";
import { CatalogFilterChips } from "./CatalogFilterChips";
import { CatalogSearchInput } from "./CatalogSearchInput";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/shared/Skeleton";
import { PageWrapper } from "@/components/layout/PageWrapper";
import {
  CATEGORY_BY_SLUG,
  resolveBrand,
  SELECTABLE_BRANDS,
} from "../lib/catalogMeta";
import {
  clearAllFilters,
  clearBrandFilter,
  clearSearch,
  toProductQuery,
} from "../lib/catalogState";
import { useCatalogState } from "../hooks/useCatalogState";
import { useProductListScrollRestoration } from "../hooks/useProductListScrollRestoration";
import type { ProductFilters } from "../types";

function CatalogContent() {
  const { state, commit } = useCatalogState();

  const query = useMemo(() => toProductQuery(state), [state]);
  const { data, isLoading, isError, error, refetch } = useProducts(query);

  useProductListScrollRestoration(!isLoading && Boolean(data));

  const brands = SELECTABLE_BRANDS;
  const brand = state.brands[0]
    ? resolveBrand(state.brands[0]).name
    : undefined;
  const category = state.category
    ? CATEGORY_BY_SLUG.get(state.category)?.name
    : undefined;
  const hasFilters =
    Boolean(state.search) ||
    Boolean(brand) ||
    Boolean(category) ||
    state.series.length > 0 ||
    Boolean(state.modelKey);
  const productCount = data?.total ?? 0;

  const activeCriteria = [
    state.search ? `search “${state.search}”` : undefined,
    brand ? `brand ${brand}` : undefined,
    category ? `category ${category}` : undefined,
    state.series.length ? `series ${state.series.join(", ")}` : undefined,
    state.modelKey ? `model ${state.modelKey}` : undefined,
  ].filter(Boolean);

  const handleSelectionChange = (next: ProductFilters) => {
    commit({
      search: next.search,
      sort: next.sort ?? state.sort,
      category: undefined,
      brands: next.brands ?? [],
      series: next.series ?? [],
      modelKey: next.modelKey,
    });
  };

  const toggleCompare = (id: string) => {
    const next = state.compareIds.includes(id)
      ? state.compareIds.filter((item) => item !== id)
      : state.compareIds.length >= 4
        ? state.compareIds
        : [...state.compareIds, id];
    commit({ compareIds: next });
  };

  return (
    <PageWrapper className="py-8">
      <div className="mb-6 space-y-2">
        <h1 className="text-foreground text-3xl font-bold tracking-tight">
          Products
        </h1>
        <p className="text-muted-foreground">
          Browse our catalog of computers, components, and accessories.
        </p>
      </div>

      <div className="space-y-5">
        <div className="surface-glass flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center">
          <CatalogSearchInput
            value={state.search}
            onSearch={(search) => commit({ search })}
          />
        </div>

        <BrandNav
          filters={state}
          onChange={handleSelectionChange}
          brands={brands}
        />

        <CatalogFilterChips
          state={state}
          onClear={(patch) => commit(patch)}
          onClearAll={() => commit(clearAllFilters(state))}
        />

        {state.compareIds.length > 0 && (
          <div className="surface-glass flex items-center justify-between rounded-2xl p-3">
            <div className="flex items-center gap-2 text-sm">
              <Scale className="text-primary size-4" />
              <span className="font-medium">
                {state.compareIds.length} product
                {state.compareIds.length > 1 ? "s" : ""} selected for comparison
              </span>
            </div>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => commit({ compareIds: [] })}
            >
              Clear
            </Button>
          </div>
        )}

        {isLoading ? (
          <ProductGridSkeleton count={8} />
        ) : isError ? (
          <EmptyState
            title="Failed to load products"
            description={
              error?.message ?? "Something went wrong. Please try again."
            }
            action={<Button onClick={() => refetch()}>Try again</Button>}
          />
        ) : productCount === 0 ? (
          <EmptyState
            title="No products match these filters"
            description={
              activeCriteria.length > 0
                ? `Active criteria: ${activeCriteria.join(" · ")}.`
                : "Try a different search or brand."
            }
            action={
              <div className="flex flex-wrap justify-center gap-2">
                {state.search ? (
                  <Button
                    variant="outline"
                    onClick={() => commit(clearSearch(state))}
                  >
                    Clear search
                  </Button>
                ) : null}
                {brand ? (
                  <Button
                    variant="outline"
                    onClick={() => commit(clearBrandFilter(state))}
                  >
                    Remove brand filter
                  </Button>
                ) : null}
                {category ? (
                  <Button
                    variant="outline"
                    onClick={() => commit({ category: undefined })}
                  >
                    Clear category
                  </Button>
                ) : null}
                {hasFilters ? (
                  <Button onClick={() => commit(clearAllFilters(state))}>
                    Clear all filters
                  </Button>
                ) : null}
              </div>
            }
          />
        ) : (
          <>
            <ProductGrid
              products={data?.data ?? []}
              compareIds={state.compareIds}
              onToggleCompare={toggleCompare}
            />
            <p className="text-muted-foreground pt-2 text-center text-sm">
              Showing all {productCount}{" "}
              {productCount === 1 ? "product" : "products"}
            </p>
          </>
        )}

        {state.compareIds.length > 0 && (
          <ComparisonTable productIds={state.compareIds} />
        )}
      </div>
    </PageWrapper>
  );
}

/** Product catalog with brand browsing, URL-driven search/category, and comparison. */
export function ProductCatalog() {
  return (
    <Suspense
      fallback={
        <PageWrapper className="py-8">
          <Skeleton className="mb-8 h-10 w-48" />
          <div className="space-y-5">
            <Skeleton className="h-16 w-full rounded-2xl" />
            <ProductGridSkeleton count={8} />
          </div>
        </PageWrapper>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
