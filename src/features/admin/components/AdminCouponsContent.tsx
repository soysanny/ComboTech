"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { AdminPageShell } from "@/components/layout/AdminPageShell";
import { DataTable } from "@/components/tables/DataTable";
import { DataTablePagination } from "@/components/tables/DataTablePagination";
import { DataTableToolbar } from "@/components/tables/DataTableToolbar";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
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
  useAdminCoupons,
  useCreateCoupon,
  useUpdateCoupon,
  useDeleteCoupon,
} from "../hooks/useAdmin";
import { CouponForm, type CouponFormData } from "./CouponForm";
import type { Coupon } from "../types";
import type { DataTableColumn } from "@/components/tables/DataTable";
import { formatDate } from "@/utils/formatDate";

export function AdminCouponsContent() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useAdminCoupons(page, pageSize);
  const create = useCreateCoupon();
  const update = useUpdateCoupon();
  const remove = useDeleteCoupon();

  const filtered = useMemo(() => {
    const list = data?.data ?? [];
    if (!search) return list;
    const term = search.toLowerCase();
    return list.filter(
      (coupon) =>
        coupon.code.toLowerCase().includes(term) ||
        (coupon.description?.toLowerCase().includes(term) ?? false),
    );
  }, [data, search]);

  const total = data?.total ?? 0;

  const columns: DataTableColumn<Coupon>[] = [
    {
      key: "code",
      header: "Code",
      render: (row) => <span className="font-semibold">{row.code}</span>,
    },
    { key: "discount", header: "Discount", render: (row) =>
      row.discountType === "percentage" ? `${row.discountValue}%` : `$${row.discountValue}`
    },
    {
      key: "usage",
      header: "Usage",
      render: (row) => `${row.usedCount} / ${row.usageLimit}`,
    },
    {
      key: "expiry",
      header: "Expires",
      render: (row) => formatDate(row.expiryDate),
    },
    {
      key: "active",
      header: "Status",
      render: (row) =>
        row.active ? <Badge variant="default">Active</Badge> : <Badge variant="secondary">Inactive</Badge>,
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (row) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              setEditing(row);
              setDialogOpen(true);
            }}
            aria-label="Edit"
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setDeleteId(row.id)}
            aria-label="Delete"
          >
            <Trash2 className="text-destructive size-4" />
          </Button>
        </div>
      ),
    },
  ];

  const handleSubmit = (formData: CouponFormData) => {
    if (editing) {
      update.mutate({ id: editing.id, input: formData }, { onSuccess: () => setDialogOpen(false) });
    } else {
      create.mutate(formData, { onSuccess: () => setDialogOpen(false) });
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      remove.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
    }
  };

  return (
    <AdminPageShell
      title="Coupon Management"
      description="Create discount codes and promotional offers."
    >
      <DataTableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search coupons..."
        actions={
          <Button
            onClick={() => {
              setEditing(undefined);
              setDialogOpen(true);
            }}
          >
            <Plus className="mr-1.5 size-4" />
            Add coupon
          </Button>
        }
      />

      {isLoading ? (
        <Skeleton className="h-80 w-full" />
      ) : isError ? (
        <EmptyState
          title="Failed to load coupons"
          description={error?.message ?? "Something went wrong."}
          action={<Button onClick={() => window.location.reload()}>Try again</Button>}
        />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={filtered}
            getRowId={(row) => row.id}
            emptyMessage="No coupons found."
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit coupon" : "Add coupon"}</DialogTitle>
          </DialogHeader>
          <CouponForm
            initialValue={editing}
            onSubmit={handleSubmit}
            loading={create.isPending || update.isPending}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete coupon?"
        description="This coupon will be permanently removed."
        confirmLabel="Delete"
        destructive
        loading={remove.isPending}
        onConfirm={handleDelete}
      />
    </AdminPageShell>
  );
}
