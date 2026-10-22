import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";

/** Admin shell — sidebar navigation + content area. */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <main className="bg-muted/30 flex-1 pt-16 lg:pt-0">{children}</main>
    </div>
  );
}
