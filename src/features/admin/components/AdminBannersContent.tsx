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
  useAdminBanners,
  useCreateBanner,
  useUpdateBanner,
  useDeleteBanner,
} from "../hooks/useAdmin";
import { BannerForm, type BannerFormData } from "./BannerForm";
import type { Banner } from "../types";
import type { DataTableColumn } from "@/components/tables/DataTable";

export function AdminBannersContent() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useAdminBanners(page, pageSize);
  const create = useCreateBanner();
  const update = useUpdateBanner();
  const remove = useDeleteBanner();

  const filtered = useMemo(() => {
    const list = data?.data ?? [];
    if (!search) return list;
    const term = search.toLowerCase();
    return list.filter((banner) => banner.title.toLowerCase().includes(term));
  }, [data, search]);

  const total = data?.total ?? 0;

  const columns: DataTableColumn<Banner>[] = [
    { key: "title", header: "Title", render: (row) => row.title },
    { key: "type", header: "Type", render: (row) => <Badge variant="outline">{row.type}</Badge> },
    { key: "order", header: "Order", render: (row) => row.order },
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

  const handleSubmit = (formData: BannerFormData) => {
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
      title="Banner Management"
      description="Manage homepage banners and promotional images."
    >
      <DataTableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search banners..."
        actions={
          <Button
            onClick={() => {
              setEditing(undefined);
              setDialogOpen(true);
            }}
          >
            <Plus className="mr-1.5 size-4" />
            Add banner
          </Button>
        }
      />

      {isLoading ? (
        <Skeleton className="h-80 w-full" />
      ) : isError ? (
        <EmptyState
          title="Failed to load banners"
          description={error?.message ?? "Something went wrong."}
          action={<Button onClick={() => window.location.reload()}>Try again</Button>}
        />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={filtered}
            getRowId={(row) => row.id}
            emptyMessage="No banners found."
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
            <DialogTitle>{editing ? "Edit banner" : "Add banner"}</DialogTitle>
          </DialogHeader>
          <BannerForm
            initialValue={editing}
            onSubmit={handleSubmit}
            loading={create.isPending || update.isPending}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete banner?"
        description="This banner will be permanently removed."
        confirmLabel="Delete"
        destructive
        loading={remove.isPending}
        onConfirm={handleDelete}
      />
    </AdminPageShell>
  );
}
