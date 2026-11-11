import Link from "next/link";
import { ArrowRight, RefreshCw } from "lucide-react";
import { ProductGrid, ProductGridSkeleton } from "@/features/products";
import { Button } from "@/components/ui/button";
import type { Product } from "@/features/products/types";

export interface ProductSectionProps {
  title: string;
  description?: string;
  href?: string;
  products: Product[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  skeletonCount?: number;
}

/** Compact homepage product section with a heading, grid, and view-all link. */
export function ProductSection({
  title,
  description,
  href,
  products,
  isLoading,
  isError,
  onRetry,
  skeletonCount = 6,
}: ProductSectionProps) {
  if (!isLoading && !isError && products.length === 0) return null;

  const sectionId = `section-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <section aria-labelledby={sectionId}>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h2
            id={sectionId}
            className="text-base font-semibold tracking-tight sm:text-lg"
          >
            {title}
          </h2>
          {description && (
            <p className="text-muted-foreground mt-0.5 truncate text-xs sm:text-sm">
              {description}
            </p>
          )}
        </div>
        {href && (
          <Link
            href={href}
            className="text-primary hover:text-primary/80 inline-flex shrink-0 items-center gap-1 text-xs font-semibold transition-colors"
          >
            View all
            <ArrowRight className="size-3.5" />
          </Link>
        )}
      </div>

      {isLoading ? (
        <ProductGridSkeleton count={skeletonCount} />
      ) : isError ? (
        <div className="bg-card flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-8 text-center">
          <p className="text-muted-foreground text-sm">
            Could not load {title.toLowerCase()}.
          </p>
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry}>
              <RefreshCw className="size-4" />
              Retry
            </Button>
          )}
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </section>
  );
}
