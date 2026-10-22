import type { Metadata } from "next";
import { AdminPaymentsContent } from "@/features/admin/components/AdminPaymentsContent";

export const metadata: Metadata = { title: "Admin — Payments" };

export default function AdminPaymentsPage() {
  return <AdminPaymentsContent />;
}
