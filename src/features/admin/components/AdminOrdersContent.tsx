"use client";

import { useMemo, useState } from "react";
import { AdminPageShell } from "@/components/layout/AdminPageShell";
import { DataTable } from "@/components/tables/DataTable";
import { DataTablePagination } from "@/components/tables/DataTablePagination";
import { DataTableToolbar } from "@/components/tables/DataTableToolbar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/shared/Skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminOrders, useUpdateOrderStatus } from "../hooks/useAdmin";
import { ORDER_STATUS_LIST } from "@/constants/orderStatus";
import type { Order } from "@/features/orders/types";
import type { DataTableColumn } from "@/components/tables/DataTable";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";

export function AdminOrdersContent() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data, isLoading, isError, error } = useAdminOrders(
    page,
    pageSize,
    statusFilter || undefined,
    search || undefined,
  );
  const updateStatus = useUpdateOrderStatus();

  const filtered = useMemo(() => data?.data ?? [], [data]);
  const total = data?.total ?? 0;

  const statusBadgeVariant = (status: string) => {
    switch (status) {
      case "delivered":
        return "default";
      case "cancelled":
        return "destructive";
      case "order_placed":
        return "secondary";
      default:
        return "outline";
    }
  };

  const columns: DataTableColumn<Order>[] = [
    { key: "id", header: "Order ID", render: (row) => row.id.toUpperCase() },
    {
      key: "customer",
      header: "Customer",
      render: (row) => row.shippingAddress?.fullName ?? "Guest",
    },
    {
      key: "total",
      header: "Total",
      render: (row) => formatCurrency(row.grandTotal, "USD"),
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
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (row) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedOrder(row)}
          >
            Update status
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminPageShell
      title="Order Management"
      description="View, process, and manage customer orders."
    >
      <DataTableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search order ID or product..."
        actions={
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All statuses</SelectItem>
              {ORDER_STATUS_LIST.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      {isLoading ? (
        <Skeleton className="h-80 w-full" />
      ) : isError ? (
        <EmptyState
          title="Failed to load orders"
          description={error?.message ?? "Something went wrong."}
          action={<Button onClick={() => window.location.reload()}>Try again</Button>}
        />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={filtered}
            getRowId={(row) => row.id}
            emptyMessage="No orders found."
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

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update order status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Select
              value={selectedOrder?.status}
              onValueChange={(status) => {
                if (selectedOrder) {
                  updateStatus.mutate(
                    { id: selectedOrder.id, status },
                    { onSuccess: () => setSelectedOrder(null) },
                  );
                }
              }}
              disabled={updateStatus.isPending}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ORDER_STATUS_LIST.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </DialogContent>
      </Dialog>
    </AdminPageShell>
  );
}
