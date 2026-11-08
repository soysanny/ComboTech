"use client";

import { RefreshCw } from "lucide-react";
import { ProductGridSkeleton } from "@/features/products";
import { Button } from "@/components/ui/button";
import { useHomepageBrandSections } from "../hooks/useHomepageBrandSections";
import { BrandProductSection } from "./BrandProductSection";

function BrandSectionSkeleton() {
  return (
    <section>
      <div className="mb-6 flex items-center gap-3">
        <div className="bg-muted size-10 animate-pulse rounded-xl" />
        <div className="space-y-2">
          <div className="bg-muted h-6 w-28 animate-pulse rounded" />
          <div className="bg-muted h-3 w-40 animate-pulse rounded" />
        </div>
      </div>
      <ProductGridSkeleton count={4} />
    </section>
  );
}

/** Renders the admin-configured brand-based product sections. */
export function HomepageBrandSections() {
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
      <section className="border-border/60 bg-muted/30 rounded-2xl border p-8 text-center">
        <p className="text-muted-foreground text-sm">
          Could not load brand product sections.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() => refetch()}
        >
          <RefreshCw className="mr-2 size-4" />
          Retry
        </Button>
      </section>
    );
  }

  if (!data || data.length === 0) return null;

  return (
    <>
      {data.map((section) => (
        <BrandProductSection key={section.id} section={section} />
      ))}
    </>
  );
}
