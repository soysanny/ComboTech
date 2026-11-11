import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductGrid } from "@/features/products";
import { ROUTES } from "@/constants/routes";
import type { HomepageBrandSectionView } from "../types";

/** One brand block on the homepage: heading, view-all link, product grid. */
export function BrandProductSection({
  section,
  excludeIds,
}: {
  section: HomepageBrandSectionView;
  excludeIds?: Set<string>;
}) {
  const products = excludeIds
    ? section.products.filter((product) => !excludeIds.has(product.id))
    : section.products;

  if (products.length === 0) return null;

  const brandHref = `${ROUTES.products}?brands=${encodeURIComponent(section.brand)}`;

  return (
    <section className="animate-fade-in" aria-labelledby={`brand-${section.id}`}>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="bg-primary/10 text-primary inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold uppercase">
            {section.brand.slice(0, 2)}
          </span>
          <div className="min-w-0">
            <h2
              id={`brand-${section.id}`}
              className="truncate text-base font-semibold tracking-tight sm:text-lg"
            >
              {section.brand}
            </h2>
            <p className="text-muted-foreground text-xs">
              Latest {section.brand} products
            </p>
          </div>
        </div>
        <Link
          href={brandHref}
          className="text-primary hover:text-primary/80 inline-flex shrink-0 items-center gap-1 text-xs font-semibold transition-colors"
        >
          View all
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <ProductGrid
        products={products}
        columns="compact4"
        className={products.length === 3 ? "md:grid-cols-3" : undefined}
      />
    </section>
  );
}
