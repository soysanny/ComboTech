import type { Metadata } from "next";
import { ProductCatalog } from "@/features/products/components/ProductCatalog";

export const metadata: Metadata = { title: "Products" };

export default function ProductsPage() {
  return <ProductCatalog />;
}
