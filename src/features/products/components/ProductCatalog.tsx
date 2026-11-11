"use client";

import { useState, useEffect, useRef, Suspense, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search, X, Scale } from "lucide-react";
import {
  ProductGrid,
  ProductGridSkeleton,
  useProducts,
  ComparisonTable,
} from "@/features/products";
import { BrandNav } from "./BrandNav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/shared/Skeleton";
import { PageWrapper } from "@/components/layout/PageWrapper";
import type { ProductFilters, ProductSortOption } from "../types";

// Show the complete catalog by default; the API caps a single response at this
// size, and "Load more" raises it further if the catalog ever exceeds it.
const PAGE_SIZE = 2000;

function ActiveFilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <Badge variant="secondary" className="gap-1 pl-2.5">
      {label}
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        className="size-4 hover:bg-transparent"
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
      >
        <X className="size-3" />
      </Button>
    </Badge>
  );
}

function parseFiltersFromSearchParams(
  searchParams: URLSearchParams,
): ProductFilters {
  return {
    search: searchParams.get("search") ?? undefined,
    category:
      (searchParams.get("category") as ProductFilters["category"]) ?? undefined,
    brands: searchParams.get("brands")?.split(",") ?? undefined,
    minPrice: searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined,
    maxPrice: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined,
    cpu: searchParams.get("cpu")?.split(",") ?? undefined,
    gpu: searchParams.get("gpu")?.split(",") ?? undefined,
    ram: searchParams.get("ram")?.split(",") ?? undefined,
    storage: searchParams.get("storage")?.split(",") ?? undefined,
    screenSize:
      searchParams.get("screenSize")?.split(",").map(Number) ?? undefined,
    ssd: searchParams.get("ssd") === "true" ? true : undefined,
    hdd: searchParams.get("hdd") === "true" ? true : undefined,
    inStockOnly: searchParams.get("inStockOnly") === "true",
    sort: (searchParams.get("sort") as ProductSortOption) ?? "newest",
  };
}

function useBrandOptions() {
  const { data } = useProducts({ pageSize: 2000 });
  return useMemo(
    () => Array.from(new Set((data?.data ?? []).map((p) => p.brand))).sort(),
    [data],
  );
}

function CatalogContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const brands = useBrandOptions();

  const [filters, setFilters] = useState<ProductFilters>(() =>
    parseFiltersFromSearchParams(searchParams),
  );
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") ?? "",
  );
  const [compareIds, setCompareIds] = useState<string[]>(
    () => searchParams.get("compare")?.split(",").filter(Boolean) ?? [],
  );
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const searchParamsString = searchParams.toString();
  const lastQueryRef = useRef(searchParamsString);

  const { data, isLoading, isFetching, isError, error } = useProducts({
    ...filters,
    pageSize,
  });

  // Keep the filter state in sync when the URL changes from header links,
  // browser Back/Forward, or a manual navigation to another category.
  useEffect(() => {
    if (searchParamsString === lastQueryRef.current) return;

    const nextParams = new URLSearchParams(searchParamsString);
    setFilters(parseFiltersFromSearchParams(nextParams));
    setSearchInput(nextParams.get("search") ?? "");
    setCompareIds(nextParams.get("compare")?.split(",").filter(Boolean) ?? []);
    lastQueryRef.current = searchParamsString;
  }, [searchParamsString]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.category) params.set("category", filters.category);
    if (filters.brands?.length) params.set("brands", filters.brands.join(","));
    if (filters.cpu?.length) params.set("cpu", filters.cpu.join(","));
    if (filters.gpu?.length) params.set("gpu", filters.gpu.join(","));
    if (filters.ram?.length) params.set("ram", filters.ram.join(","));
    if (filters.storage?.length)
      params.set("storage", filters.storage.join(","));
    if (filters.screenSize?.length)
      params.set("screenSize", filters.screenSize.join(","));
    if (filters.ssd) params.set("ssd", "true");
    if (filters.hdd) params.set("hdd", "true");
    if (filters.minPrice !== undefined)
      params.set("minPrice", String(filters.minPrice));
    if (filters.maxPrice !== undefined)
      params.set("maxPrice", String(filters.maxPrice));
    if (filters.inStockOnly) params.set("inStockOnly", "true");
    if (filters.sort && filters.sort !== "newest")
      params.set("sort", filters.sort);
    if (compareIds.length > 0) params.set("compare", compareIds.join(","));

    const query = params.toString();
    if (query === lastQueryRef.current) return;

    lastQueryRef.current = query;
    router.replace(`${pathname}${query ? `?${query}` : ""}`, {
      scroll: false,
    });
  }, [filters, compareIds, router, pathname]);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setFilters((prev) => ({
      ...prev,
      search: searchInput.trim() || undefined,
    }));
  };

  const toggleCompare = (id: string) => {
    setCompareIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : prev.length >= 4
          ? prev
          : [...prev, id],
    );
  };

  const activeChips: { key: string; label: string; remove: () => void }[] = [];
  if (filters.category) {
    activeChips.push({
      key: "category",
      label: filters.category.replace(/-/g, " "),
      remove: () => setFilters((prev) => ({ ...prev, category: undefined })),
    });
  }
  filters.brands?.forEach((brand) => {
    activeChips.push({
      key: `brand-${brand}`,
      label: brand,
      remove: () =>
        setFilters((prev) => ({
          ...prev,
          brands: prev.brands?.filter((b) => b !== brand),
        })),
    });
  });
  filters.cpu?.forEach((cpu) => {
    activeChips.push({
      key: `cpu-${cpu}`,
      label: cpu,
      remove: () =>
        setFilters((prev) => ({
          ...prev,
          cpu: prev.cpu?.filter((c) => c !== cpu),
        })),
    });
  });
  filters.gpu?.forEach((gpu) => {
    activeChips.push({
      key: `gpu-${gpu}`,
      label: gpu,
      remove: () =>
        setFilters((prev) => ({
          ...prev,
          gpu: prev.gpu?.filter((g) => g !== gpu),
        })),
    });
  });
  filters.ram?.forEach((ram) => {
    activeChips.push({
      key: `ram-${ram}`,
      label: ram,
      remove: () =>
        setFilters((prev) => ({
          ...prev,
          ram: prev.ram?.filter((r) => r !== ram),
        })),
    });
  });
  filters.storage?.forEach((storage) => {
    activeChips.push({
      key: `storage-${storage}`,
      label: storage,
      remove: () =>
        setFilters((prev) => ({
          ...prev,
          storage: prev.storage?.filter((s) => s !== storage),
        })),
    });
  });
  filters.screenSize?.forEach((size) => {
    activeChips.push({
      key: `screen-${size}`,
      label: `${size}"`,
      remove: () =>
        setFilters((prev) => ({
          ...prev,
          screenSize: prev.screenSize?.filter((s) => s !== size),
        })),
    });
  });
  if (filters.minPrice !== undefined) {
    activeChips.push({
      key: "minPrice",
      label: `Min $${filters.minPrice}`,
      remove: () => setFilters((prev) => ({ ...prev, minPrice: undefined })),
    });
  }
  if (filters.maxPrice !== undefined) {
    activeChips.push({
      key: "maxPrice",
      label: `Max $${filters.maxPrice}`,
      remove: () => setFilters((prev) => ({ ...prev, maxPrice: undefined })),
    });
  }
  if (filters.ssd) {
    activeChips.push({
      key: "ssd",
      label: "SSD only",
      remove: () => setFilters((prev) => ({ ...prev, ssd: undefined })),
    });
  }
  if (filters.hdd) {
    activeChips.push({
      key: "hdd",
      label: "HDD only",
      remove: () => setFilters((prev) => ({ ...prev, hdd: undefined })),
    });
  }
  if (filters.inStockOnly) {
    activeChips.push({
      key: "inStock",
      label: "In stock",
      remove: () => setFilters((prev) => ({ ...prev, inStockOnly: false })),
    });
  }

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

      <BrandNav
        filters={filters}
        onChange={setFilters}
        brands={brands}
        className="mb-8"
      />

      <div className="space-y-5">
        <form onSubmit={handleSearch} className="relative">
          <Search className="text-muted-foreground/70 absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            type="search"
            placeholder="Search products, brands, or categories..."
            className="input-glass h-12 pr-24 pl-10 transition-all"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <Button
            type="submit"
            size="sm"
            className="absolute top-1/2 right-1.5 -translate-y-1/2"
          >
            Search
          </Button>
        </form>

        {activeChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {activeChips.map((chip) => (
              <ActiveFilterChip
                key={chip.key}
                label={chip.label}
                onRemove={chip.remove}
              />
            ))}
            <Button
              variant="ghost"
              size="xs"
              onClick={() =>
                setFilters({ search: filters.search, sort: filters.sort })
              }
            >
              Clear all
            </Button>
          </div>
        )}

        {compareIds.length > 0 && (
          <div className="surface-glass flex items-center justify-between rounded-2xl p-3">
            <div className="flex items-center gap-2 text-sm">
              <Scale className="text-primary size-4" />
              <span className="font-medium">
                {compareIds.length} product{compareIds.length > 1 ? "s" : ""}{" "}
                selected for comparison
              </span>
            </div>
            <Button variant="ghost" size="xs" onClick={() => setCompareIds([])}>
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
            action={
              <Button onClick={() => window.location.reload()}>
                Try again
              </Button>
            }
          />
        ) : data?.data.length === 0 ? (
          <EmptyState
            title="No products found"
            description="Try adjusting your filters or search query."
            action={
              <Button onClick={() => setFilters({ sort: "newest" })}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <>
            <ProductGrid
              products={data?.data ?? []}
              compareIds={compareIds}
              onToggleCompare={toggleCompare}
            />
            <div className="flex flex-col items-center gap-3 pt-2">
              <p className="text-muted-foreground text-sm">
                Showing {data?.data.length} of {data?.total} products
              </p>
              {data && data.data.length < data.total && (
                <Button
                  variant="outline"
                  onClick={() => setPageSize((size) => size + PAGE_SIZE)}
                  disabled={isFetching}
                >
                  {isFetching ? "Loading..." : "Load more products"}
                </Button>
              )}
            </div>
          </>
        )}

        {compareIds.length > 0 && <ComparisonTable productIds={compareIds} />}
      </div>
    </PageWrapper>
  );
}

/** Product catalog with brand selection, search, and comparison. */
export function ProductCatalog() {
  return (
    <Suspense
      fallback={
        <PageWrapper className="py-8">
          <Skeleton className="mb-8 h-10 w-48" />
          <Skeleton className="mb-8 h-16 w-full rounded-2xl" />
          <div className="space-y-5">
            <Skeleton className="h-11 w-full" />
            <ProductGridSkeleton count={8} />
          </div>
        </PageWrapper>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
