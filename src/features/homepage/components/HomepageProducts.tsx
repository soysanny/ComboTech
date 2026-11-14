"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, RefreshCw } from "lucide-react";
import {
  ProductGrid,
  ProductGridSkeleton,
  useProducts,
} from "@/features/products";
import { useProductListScrollRestoration } from "@/features/products/hooks/useProductListScrollRestoration";
import type { Product } from "@/features/products/types";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

/**
 * Interleave products across brand + category groups so the homepage shows a
 * mixed catalog instead of blocks grouped by brand or product type.
 */
function mixProducts(products: Product[]): Product[] {
  if (products.length <= 2) return products;

  const groups = new Map<string, Product[]>();
  products.forEach((product) => {
    const key = `${product.brand}::${product.category}`;
    const group = groups.get(key);
    if (group) group.push(product);
    else groups.set(key, [product]);
  });

  const queues = Array.from(groups.values());
  const mixed: Product[] = [];
  let cursor = 0;

  while (mixed.length < products.length) {
    let picked = false;
    for (const queue of queues) {
      const product = queue[cursor];
      if (product) {
        mixed.push(product);
        picked = true;
      }
    }
    if (!picked) break;
    cursor += 1;
  }

  return mixed;
}

function ProductSectionSkeleton() {
  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="bg-muted h-7 w-40 animate-pulse rounded" />
          <div className="bg-muted h-4 w-64 animate-pulse rounded" />
        </div>
        <div className="bg-muted h-8 w-20 animate-pulse rounded-lg" />
      </div>
      <ProductGridSkeleton count={10} />
    </section>
  );
}

/** Homepage catalog: every product in one mixed, responsive grid. */
export function HomepageProducts() {
  const { data, isLoading, isError, error, refetch } = useProducts({
    pageSize: 2000,
    sort: "newest",
  });

  const products = useMemo(() => mixProducts(data?.data ?? []), [data]);

  useProductListScrollRestoration(!isLoading && Boolean(data));

  if (isLoading) return <ProductSectionSkeleton />;

  if (isError) {
    return (
      <section className="surface-glass rounded-3xl p-8 text-center">
        <h2 className="text-foreground text-xl font-bold tracking-tight">
          All products
        </h2>
        <p className="text-muted-foreground mt-2 text-sm">
          {error?.message ?? "Could not load products."}
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => refetch()}
        >
          <RefreshCw className="mr-2 size-4" />
          Retry
        </Button>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="surface-glass rounded-3xl p-8 text-center">
        <h2 className="text-foreground text-xl font-bold tracking-tight">
          All products
        </h2>
        <p className="text-muted-foreground mt-2 text-sm">
          No products are available right now.
        </p>
      </section>
    );
  }

  return (
    <section className="animate-fade-in space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
            All products
          </h2>
          <p className="text-muted-foreground text-sm">
            Browse every brand and category in one place.
          </p>
        </div>
        <Button asChild variant="ghost" size="sm" className="gap-1">
          <Link href={ROUTES.products}>
            View all
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      <ProductGrid products={products} />
    </section>
  );
}
