import type { Metadata } from "next";
import { AdminBannersContent } from "@/features/admin/components/AdminBannersContent";

export const metadata: Metadata = { title: "Admin — Banners" };

export default function AdminBannersPage() {
  return <AdminBannersContent />;
}
