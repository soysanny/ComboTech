import type { Metadata } from "next";
import { AdminMessagesContent } from "@/features/admin/components/AdminMessagesContent";

export const metadata: Metadata = { title: "Admin — Messages" };

export default function AdminMessagesPage() {
  return <AdminMessagesContent />;
}
