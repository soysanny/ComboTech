import type { Metadata } from "next";
import { AdminLogsContent } from "@/features/admin/components/AdminLogsContent";

export const metadata: Metadata = { title: "Admin — Activity Logs" };

export default function AdminLogsPage() {
  return <AdminLogsContent />;
}
