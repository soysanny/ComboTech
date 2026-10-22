import type { Metadata } from "next";
import { AdminProductsContent } from "@/features/admin/components/AdminProductsContent";

export const metadata: Metadata = { title: "Admin — Products" };

export default function AdminProductsPage() {
  return <AdminProductsContent />;
}
