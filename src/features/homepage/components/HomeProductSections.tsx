"use client";

import { useProducts } from "@/features/products";
import { ROUTES } from "@/constants/routes";
import type { Product } from "@/features/products/types";
import { HomepageBrandSections } from "./HomepageBrandSections";
import { ProductSection } from "./ProductSection";

function productNameKey(product: Product): string {
  return product.name.trim().toLowerCase();
}

function takeUnique(
  products: Product[] | undefined,
  seenIds: Set<string>,
  seenNames: Set<string>,
  limit: number,
): Product[] {
  const result: Product[] = [];
  for (const product of products ?? []) {
    const nameKey = productNameKey(product);
    if (seenIds.has(product.id) || seenNames.has(nameKey)) continue;
    seenIds.add(product.id);
    seenNames.add(nameKey);
    result.push(product);
    if (result.length >= limit) break;
  }
  return result;
}

/** The product-first homepage: featured, latest, category, and brand sections. */
export function HomeProductSections() {
  const featuredQuery = useProducts({
    isFeatured: true,
    pageSize: 18,
    sort: "best_selling",
  });
  const latestQuery = useProducts({
    isNewArrival: true,
    pageSize: 18,
    sort: "newest",
  });
  const laptopsQuery = useProducts({
    category: "laptops",
    pageSize: 18,
    sort: "best_selling",
  });
  const componentsQuery = useProducts({
    category: "pc-components",
    pageSize: 18,
    sort: "best_selling",
  });
  const accessoriesQuery = useProducts({
    category: "accessories",
    pageSize: 18,
    sort: "best_selling",
  });

  const seenIds = new Set<string>();
  const seenNames = new Set<string>();
  const featured = takeUnique(featuredQuery.data?.data, seenIds, seenNames, 12);
  const latest = takeUnique(latestQuery.data?.data, seenIds, seenNames, 12);
  const laptops = takeUnique(laptopsQuery.data?.data, seenIds, seenNames, 12);
  const components = takeUnique(
    componentsQuery.data?.data,
    seenIds,
    seenNames,
    12,
  );
  const accessories = takeUnique(
    accessoriesQuery.data?.data,
    seenIds,
    seenNames,
    12,
  );

  return (
    <div className="space-y-8">
      <ProductSection
        title="Featured Products"
        description="Popular picks from our catalog"
        href={ROUTES.products}
        products={featured}
        isLoading={featuredQuery.isLoading}
        isError={featuredQuery.isError}
        onRetry={() => featuredQuery.refetch()}
        skeletonCount={12}
      />

      <ProductSection
        title="Latest Arrivals"
        description="Fresh stock and new models"
        href={`${ROUTES.products}?sort=newest`}
        products={latest}
        isLoading={latestQuery.isLoading}
        isError={latestQuery.isError}
        onRetry={() => latestQuery.refetch()}
        skeletonCount={12}
      />

      <ProductSection
        title="Laptops"
        description="Portable machines for work, study and gaming"
        href={`${ROUTES.products}?category=laptops`}
        products={laptops}
        isLoading={laptopsQuery.isLoading}
        isError={laptopsQuery.isError}
        onRetry={() => laptopsQuery.refetch()}
      />

      <ProductSection
        title="PC Components"
        description="Processors, graphics, memory and more"
        href={`${ROUTES.products}?category=pc-components`}
        products={components}
        isLoading={componentsQuery.isLoading}
        isError={componentsQuery.isError}
        onRetry={() => componentsQuery.refetch()}
      />

      <ProductSection
        title="Accessories"
        description="Everyday add-ons and essentials"
        href={`${ROUTES.products}?category=accessories`}
        products={accessories}
        isLoading={accessoriesQuery.isLoading}
        isError={accessoriesQuery.isError}
        onRetry={() => accessoriesQuery.refetch()}
      />

      <HomepageBrandSections
        excludeIds={seenIds}
        excludeNames={seenNames}
        limit={4}
      />
    </div>
  );
}
