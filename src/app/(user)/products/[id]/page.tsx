import type { Metadata } from "next";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ProductDetailView } from "@/features/products/components/ProductDetailView";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = { title: "Product Detail" };

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;
  return (
    <PageWrapper>
      <ProductDetailView id={id} />
    </PageWrapper>
  );
}
