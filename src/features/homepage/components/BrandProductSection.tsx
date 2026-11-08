import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductGrid } from "@/features/products";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import type { HomepageBrandSectionView } from "../types";

/** One brand block on the homepage: heading, view-all link, product grid. */
export function BrandProductSection({
  section,
}: {
  section: HomepageBrandSectionView;
}) {
  const brandHref = `${ROUTES.products}?brands=${encodeURIComponent(section.brand)}`;

  return (
    <section className="animate-fade-in">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="bg-primary/10 text-primary ring-primary/15 inline-flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold uppercase ring-1">
            {section.brand.slice(0, 2)}
          </span>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {section.brand}
            </h2>
            <p className="text-muted-foreground text-sm">
              Latest {section.brand} products
            </p>
          </div>
        </div>
        <Button asChild variant="ghost" size="sm" className="gap-1">
          <Link href={brandHref}>
            View all
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      <ProductGrid products={section.products} />
    </section>
  );
}
