"use client";

import Link from "next/link";
import { useProductComparison } from "../hooks/useProductComparison";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/shared/Skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatCurrency } from "@/utils/formatCurrency";
import { ROUTES } from "@/constants/routes";
import type { Product } from "../types";

export interface ComparisonTableProps {
  productIds: string[];
}

const specLabels: { key: keyof Product["specs"]; label: string }[] = [
  { key: "cpu", label: "Processor" },
  { key: "gpu", label: "Graphics" },
  { key: "ram", label: "Memory" },
  { key: "storage", label: "Storage" },
  { key: "ssd", label: "SSD" },
  { key: "hdd", label: "HDD" },
  { key: "display", label: "Display" },
  { key: "screenSize", label: "Screen size" },
  { key: "os", label: "Operating system" },
  { key: "ports", label: "Ports" },
  { key: "weight", label: "Weight" },
];

/** Side-by-side comparison table for up to 4 products. */
export function ComparisonTable({ productIds }: ComparisonTableProps) {
  const { data, isLoading, isError } = useProductComparison(productIds);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <EmptyState
        title="Failed to load comparison"
        description="Could not load product details for comparison."
      />
    );
  }

  const products = data;

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Compare products</h3>
        <Badge variant="secondary">{products.length} selected</Badge>
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="bg-muted/50 w-40 min-w-[10rem] p-4 text-left font-medium">
                Feature
              </th>
              {products.map((product) => (
                <th
                  key={product.id}
                  className="bg-muted/50 min-w-[12rem] p-4 text-left"
                >
                  <Link
                    href={ROUTES.productDetail(product.id)}
                    className="hover:text-primary font-semibold"
                  >
                    {product.name}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="bg-muted/30 p-4 font-medium">Brand</td>
              {products.map((product) => (
                <td key={product.id} className="p-4">
                  {product.brand}
                </td>
              ))}
            </tr>
            <tr>
              <td className="bg-muted/30 p-4 font-medium">Price</td>
              {products.map((product) => (
                <td key={product.id} className="p-4">
                  <span className="font-semibold">
                    {formatCurrency(product.price, product.currency)}
                  </span>
                  {product.originalPrice &&
                    product.originalPrice > product.price && (
                      <span className="text-muted-foreground ml-2 line-through">
                        {formatCurrency(
                          product.originalPrice,
                          product.currency,
                        )}
                      </span>
                    )}
                </td>
              ))}
            </tr>
            <tr>
              <td className="bg-muted/30 p-4 font-medium">Stock</td>
              {products.map((product) => (
                <td key={product.id} className="p-4">
                  {product.stock > 0 ? (
                    <span className="text-emerald-600">In stock</span>
                  ) : (
                    <span className="text-destructive">Out of stock</span>
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td className="bg-muted/30 p-4 font-medium">Rating</td>
              {products.map((product) => (
                <td key={product.id} className="p-4">
                  {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                </td>
              ))}
            </tr>
            {specLabels.map(({ key, label }) => {
              const hasValue = products.some(
                (product) => product.specs[key] !== undefined,
              );
              if (!hasValue) return null;
              return (
                <tr key={key}>
                  <td className="bg-muted/30 p-4 font-medium">{label}</td>
                  {products.map((product) => (
                    <td key={product.id} className="p-4">
                      {formatSpecValue(product.specs[key])}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatSpecValue(
  value: string | number | string[] | undefined,
): string {
  if (value === undefined || value === "") return "—";
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}
