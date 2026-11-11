"use client";

import Link from "next/link";
import { Share2, Check, ArrowLeft, Gift, Phone } from "lucide-react";
import { useProductDetail } from "@/features/products";
import { ProductGallery } from "./ProductGallery";
import { ProductGridSkeleton } from "./ProductGrid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/shared/Skeleton";
import { formatCurrency } from "@/utils/formatCurrency";
import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import { toast } from "@/lib/toast";
import type { Product } from "../types";

function SpecRow({
  label,
  value,
}: {
  label: string;
  value?: string | number | string[];
}) {
  if (
    value === undefined ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  )
    return null;
  return (
    <div className="flex justify-between gap-4 py-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">
        {Array.isArray(value) ? value.join(", ") : value}
      </span>
    </div>
  );
}

function ProductDetailContent({ product }: { product: Product }) {
  const hasDiscount =
    typeof product.originalPrice === "number" &&
    product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.originalPrice! - product.price) / product.originalPrice!) *
          100,
      )
    : 0;

  const isOutOfStock = product.stock <= 0;

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success("Link copied", {
        description: "Product link copied to your clipboard.",
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      toast.error("Could not share this product", {
        description: "Please copy the address from your browser instead.",
      });
    }
  };

  return (
    <div className="space-y-10">
      <Button asChild variant="ghost" size="sm" className="gap-1 pl-0">
        <Link href={ROUTES.products}>
          <ArrowLeft className="size-4" />
          Back to products
        </Link>
      </Button>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} alt={product.name} />

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{product.brand}</Badge>
              {product.series && (
                <Badge variant="outline">{product.series}</Badge>
              )}
              {product.badge && (
                <Badge
                  variant={/vip/i.test(product.badge) ? "default" : "secondary"}
                  className="uppercase"
                >
                  {product.badge}
                </Badge>
              )}
              {product.isNewArrival && <Badge>New</Badge>}
              {product.isBestSeller && (
                <Badge variant="outline">Best seller</Badge>
              )}
              {isOutOfStock && (
                <Badge variant="destructive">Out of stock</Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
              {product.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="text-muted-foreground">
                {product.soldCount.toLocaleString()} sold
              </span>
              <Separator orientation="vertical" className="h-4" />
              <span
                className={
                  isOutOfStock ? "text-destructive" : "text-emerald-600"
                }
              >
                {isOutOfStock ? "Out of stock" : "In stock"}
              </span>
            </div>
          </div>

          {product.productCode && (
            <p className="text-muted-foreground text-sm">
              Product code:{" "}
              <span className="text-foreground font-medium">
                {product.productCode}
              </span>
            </p>
          )}

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-rose-700 dark:text-rose-400">
              {formatCurrency(product.price, product.currency)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-muted-foreground text-xl line-through">
                  {formatCurrency(product.originalPrice!, product.currency)}
                </span>
                <Badge variant="destructive" className="text-xs">
                  Save {discountPercent}%
                </Badge>
              </>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="flex-1">
              <Link href={ROUTES.contact}>
                <Phone className="mr-2 size-4" />
                Contact us to order
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <a href={SITE.phoneHref}>
                <Phone className="size-4" />
                {SITE.phoneDisplay}
              </a>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon-lg"
              aria-label="Share product"
              onClick={handleShare}
            >
              <Share2 className="size-5" />
            </Button>
          </div>

          <div className="bg-muted/50 space-y-2 rounded-xl p-4 text-sm">
            <div className="text-muted-foreground flex items-center gap-2">
              <Check className="size-4 text-emerald-600" />
              <span>{product.warrantyMonths}-month warranty</span>
            </div>
            {(product.freeGifts?.length ?? 0) > 0 && (
              <ul className="space-y-1">
                {product.freeGifts!.map((gift, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 font-medium text-emerald-600 dark:text-emerald-400"
                  >
                    <Gift className="mt-0.5 size-4 shrink-0" />
                    <span>Free: {gift}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="specs" className="w-full">
        <TabsList className="bg-muted/50 w-full justify-start rounded-xl p-1 sm:w-auto">
          <TabsTrigger value="specs" className="rounded-lg">
            Specifications
          </TabsTrigger>
          <TabsTrigger value="description" className="rounded-lg">
            Description
          </TabsTrigger>
          <TabsTrigger value="shipping" className="rounded-lg">
            Shipping & Returns
          </TabsTrigger>
        </TabsList>
        <TabsContent value="specs" className="mt-4">
          <div className="surface-glass divide-y divide-[var(--surface-border)] rounded-2xl p-6">
            <SpecRow label="Brand" value={product.brand} />
            <SpecRow label="Series" value={product.series} />
            <SpecRow label="Product code" value={product.productCode} />
            <SpecRow label="Category" value={product.category} />
            <SpecRow label="Processor" value={product.specs.cpu} />
            <SpecRow label="Graphics" value={product.specs.gpu} />
            <SpecRow label="Memory" value={product.specs.ram} />
            <SpecRow label="Storage" value={product.specs.storage} />
            <SpecRow label="SSD" value={product.specs.ssd} />
            <SpecRow label="HDD" value={product.specs.hdd} />
            <SpecRow label="Display" value={product.specs.display} />
            <SpecRow label="Screen size" value={product.specs.screenSize} />
            <SpecRow label="Operating system" value={product.specs.os} />
            <SpecRow label="Ports" value={product.specs.ports} />
            <SpecRow label="Weight" value={product.specs.weight} />
            <SpecRow label="Color" value={product.specs.color} />
            <SpecRow label="Features" value={product.specs.features} />
            <SpecRow label="Battery" value={product.specs.battery} />
          </div>
        </TabsContent>
        <TabsContent value="description" className="mt-4">
          <div className="surface-glass rounded-2xl p-6">
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>
        </TabsContent>
        <TabsContent value="shipping" className="mt-4">
          <div className="surface-glass rounded-2xl p-6">
            <ul className="text-muted-foreground list-inside list-disc space-y-2 leading-relaxed">
              <li>Free shipping on orders over $50 in Phnom Penh.</li>
              <li>Orders ship within 1–2 business days.</li>
              <li>
                30-day return policy for unused items in original packaging.
              </li>
              <li>
                Warranty claims handled directly through CAMBOTECH support.
              </li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/** Full product detail view with gallery, specs, and actions. */
export function ProductDetailView({ id }: { id: string }) {
  const { data: product, isLoading, isError, error } = useProductDetail(id);

  if (isLoading) {
    return (
      <div className="space-y-10 py-8">
        <Skeleton className="h-8 w-40" />
        <div className="grid gap-10 lg:grid-cols-2">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-5">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
        <ProductGridSkeleton count={4} />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="py-8">
        <EmptyState
          title="Product not found"
          description={
            error?.message ??
            "The product you are looking for does not exist or has been removed."
          }
          action={
            <Button asChild>
              <Link href={ROUTES.products}>Browse products</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return <ProductDetailContent product={product} />;
}
