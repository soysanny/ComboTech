import type { Metadata } from "next";
import { AdminHomepageContent } from "@/features/admin/components/AdminHomepageContent";

export const metadata: Metadata = { title: "Admin — Homepage" };

export default function AdminHomepagePage() {
  return <AdminHomepageContent />;
}
