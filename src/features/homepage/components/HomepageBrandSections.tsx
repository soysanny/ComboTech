"use client";

import { RefreshCw } from "lucide-react";
import { ProductGridSkeleton } from "@/features/products";
import { Button } from "@/components/ui/button";
import { useHomepageBrandSections } from "../hooks/useHomepageBrandSections";
import { BrandProductSection } from "./BrandProductSection";

function BrandSectionSkeleton() {
  return (
    <section>
      <div className="mb-4 flex items-center gap-2.5">
        <div className="bg-muted size-9 animate-pulse rounded-lg" />
        <div className="space-y-1.5">
          <div className="bg-muted h-4 w-24 animate-pulse rounded" />
          <div className="bg-muted h-2.5 w-32 animate-pulse rounded" />
        </div>
      </div>
      <ProductGridSkeleton count={4} columns="compact4" />
    </section>
  );
}

/** Renders the admin-configured brand-based product sections. */
export function HomepageBrandSections({
  excludeIds,
  excludeNames,
  limit,
}: {
  excludeIds?: Set<string>;
  excludeNames?: Set<string>;
  limit?: number;
}) {
  const { data, isLoading, isError, refetch } = useHomepageBrandSections();

  if (isLoading) {
    return (
      <>
        <BrandSectionSkeleton />
        <BrandSectionSkeleton />
      </>
    );
  }

  if (isError) {
    return (
      <section className="bg-muted/30 rounded-xl border border-dashed p-6 text-center">
        <p className="text-muted-foreground text-sm">
          Could not load brand product sections.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() => refetch()}
        >
          <RefreshCw className="size-4" />
          Retry
        </Button>
      </section>
    );
  }

  const sections = (data ?? [])
    .map((section) => {
      const seenNames = new Set<string>();
      const products = section.products
        .filter((product) => {
          if (excludeIds?.has(product.id)) return false;
          const nameKey = product.name.trim().toLowerCase();
          if (excludeNames?.has(nameKey) || seenNames.has(nameKey)) return false;
          seenNames.add(nameKey);
          return true;
        })
        .slice(0, Math.min(section.productLimit, 4));
      return { ...section, products };
    })
    .filter((section) => section.products.length >= 3)
    .slice(0, limit ?? undefined);

  if (sections.length === 0) return null;

  return (
    <>
      {sections.map((section) => (
        <BrandProductSection key={section.id} section={section} />
      ))}
    </>
  );
}
