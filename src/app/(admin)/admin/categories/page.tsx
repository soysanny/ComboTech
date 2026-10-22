import type { Metadata } from "next";
import { AdminCategoriesContent } from "@/features/admin/components/AdminCategoriesContent";

export const metadata: Metadata = { title: "Admin — Categories" };

export default function AdminCategoriesPage() {
  return <AdminCategoriesContent />;
}
