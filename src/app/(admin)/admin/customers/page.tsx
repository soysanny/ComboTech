import type { Metadata } from "next";
import { AdminCustomersContent } from "@/features/admin/components/AdminCustomersContent";

export const metadata: Metadata = { title: "Admin — Customers" };

export default function AdminCustomersPage() {
  return <AdminCustomersContent />;
}
