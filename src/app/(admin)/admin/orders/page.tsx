import type { Metadata } from "next";
import { AdminOrdersContent } from "@/features/admin/components/AdminOrdersContent";

export const metadata: Metadata = { title: "Admin — Orders" };

export default function AdminOrdersPage() {
  return <AdminOrdersContent />;
}
