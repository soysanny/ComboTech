"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { AdminPageShell } from "@/components/layout/AdminPageShell";
import { DataTable } from "@/components/tables/DataTable";
import { DataTablePagination } from "@/components/tables/DataTablePagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/shared/Skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { useAdminLogs } from "../hooks/useAdmin";
import type { ActivityLog } from "../types";
import type { DataTableColumn } from "@/components/tables/DataTable";
import { formatDateTime } from "@/utils/formatDate";
import { downloadCsv } from "@/utils/csvExport";

const logTypeVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  login: "default",
  logout: "secondary",
  product_change: "outline",
  order_change: "outline",
};

export function AdminLogsContent() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isError, error } = useAdminLogs(page, pageSize);
  const logs = data?.data ?? [];
  const total = data?.total ?? 0;

  const columns: DataTableColumn<ActivityLog>[] = [
    {
      key: "type",
      header: "Type",
      render: (row) => (
        <Badge variant={logTypeVariant[row.type] ?? "outline"}>{row.type}</Badge>
      ),
    },
    { key: "actor", header: "Actor", render: (row) => row.actor },
    { key: "description", header: "Description", render: (row) => row.description },
    {
      key: "createdAt",
      header: "Timestamp",
      render: (row) => formatDateTime(row.createdAt),
    },
  ];

  const handleExport = () => {
    downloadCsv(logs, "activity-logs.csv", [
      { key: "type", label: "Type" },
      { key: "actor", label: "Actor" },
      { key: "description", label: "Description" },
      { key: "createdAt", label: "Timestamp" },
    ]);
  };

  return (
    <AdminPageShell
      title="Activity Logs"
      description="Review admin actions and system events."
    >
      <div className="flex justify-end">
        <Button variant="outline" onClick={handleExport} disabled={logs.length === 0}>
          <Download className="mr-1.5 size-4" />
          Export CSV
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-80 w-full" />
      ) : isError ? (
        <EmptyState
          title="Failed to load logs"
          description={error?.message ?? "Something went wrong."}
          action={<Button onClick={() => window.location.reload()}>Try again</Button>}
        />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={logs}
            getRowId={(row) => row.id}
            emptyMessage="No activity logs found."
          />
          <DataTablePagination
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
            className="mt-4"
          />
        </>
      )}
    </AdminPageShell>
  );
}
