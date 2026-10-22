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
import { useAdminPayments } from "../hooks/useAdmin";
import type { PaymentRow } from "../services/adminService";
import type { DataTableColumn } from "@/components/tables/DataTable";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { downloadCsv } from "@/utils/csvExport";

export function AdminPaymentsContent() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isError, error } = useAdminPayments(page, pageSize);
  const payments = data?.data ?? [];
  const total = data?.total ?? 0;

  const statusBadgeVariant = (status: string) => {
    switch (status) {
      case "paid":
        return "default";
      case "refunded":
        return "secondary";
      case "failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  const columns: DataTableColumn<PaymentRow>[] = [
    { key: "id", header: "Payment ID", render: (row) => row.id.toUpperCase() },
    { key: "orderId", header: "Order ID", render: (row) => row.orderId.toUpperCase() },
    { key: "method", header: "Method", render: (row) => row.method },
    {
      key: "amount",
      header: "Amount",
      render: (row) => formatCurrency(row.amount, row.currency),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <Badge variant={statusBadgeVariant(row.status)}>{row.status}</Badge>,
    },
    {
      key: "createdAt",
      header: "Date",
      render: (row) => formatDate(row.createdAt),
    },
  ];

  const handleExport = () => {
    downloadCsv(payments, "payments.csv", [
      { key: "id", label: "Payment ID" },
      { key: "orderId", label: "Order ID" },
      { key: "method", label: "Method" },
      { key: "amount", label: "Amount" },
      { key: "status", label: "Status" },
      { key: "createdAt", label: "Date" },
    ]);
  };

  return (
    <AdminPageShell
      title="Payment Management"
      description="Monitor transactions and payment statuses."
    >
      <div className="flex justify-end">
        <Button variant="outline" onClick={handleExport} disabled={payments.length === 0}>
          <Download className="mr-1.5 size-4" />
          Export CSV
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-80 w-full" />
      ) : isError ? (
        <EmptyState
          title="Failed to load payments"
          description={error?.message ?? "Something went wrong."}
          action={<Button onClick={() => window.location.reload()}>Try again</Button>}
        />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={payments}
            getRowId={(row) => row.id}
            emptyMessage="No payments found."
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
