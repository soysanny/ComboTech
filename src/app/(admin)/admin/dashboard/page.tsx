import type { Metadata } from "next";
import { AdminDashboardContent } from "@/features/admin/components/AdminDashboardContent";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default function AdminDashboardPage() {
  return <AdminDashboardContent />;
}
