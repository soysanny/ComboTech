import type { Metadata } from "next";
import { AdminCouponsContent } from "@/features/admin/components/AdminCouponsContent";

export const metadata: Metadata = { title: "Admin — Coupons" };

export default function AdminCouponsPage() {
  return <AdminCouponsContent />;
}
