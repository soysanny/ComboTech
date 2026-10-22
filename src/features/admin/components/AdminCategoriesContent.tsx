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
import { Skeleton } from "@/components/shared/Skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  useAdminCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "../hooks/useAdmin";
import { CategoryForm, type CategoryFormData } from "./CategoryForm";
import type { Category, ProductCategorySlug } from "@/features/products/types";
import type { DataTableColumn } from "@/components/tables/DataTable";

export function AdminCategoriesContent() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useAdminCategories(page, pageSize);
  const create = useCreateCategory();
  const update = useUpdateCategory();
  const remove = useDeleteCategory();

  const filtered = useMemo(() => {
    const list = data?.data ?? [];
    if (!search) return list;
    const term = search.toLowerCase();
    return list.filter(
      (category) =>
        category.name.toLowerCase().includes(term) ||
        category.slug.toLowerCase().includes(term),
    );
  }, [data, search]);

  const total = data?.total ?? 0;

  const columns: DataTableColumn<Category>[] = [
    { key: "name", header: "Name", render: (row) => row.name },
    { key: "slug", header: "Slug", render: (row) => row.slug },
    {
      key: "productCount",
      header: "Products",
      render: (row) => row.productCount ?? 0,
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

  const handleSubmit = (formData: CategoryFormData) => {
    const payload: Omit<Category, "id"> = {
      ...formData,
      slug: formData.slug as ProductCategorySlug,
    };
    if (editing) {
      update.mutate({ id: editing.id, input: payload }, { onSuccess: () => setDialogOpen(false) });
    } else {
      create.mutate(payload, { onSuccess: () => setDialogOpen(false) });
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      remove.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
    }
  };

  return (
    <AdminPageShell
      title="Category Management"
      description="Organize products into categories and subcategories."
    >
      <DataTableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search categories..."
        actions={
          <Button
            onClick={() => {
              setEditing(undefined);
              setDialogOpen(true);
            }}
          >
            <Plus className="mr-1.5 size-4" />
            Add category
          </Button>
        }
      />

      {isLoading ? (
        <Skeleton className="h-80 w-full" />
      ) : isError ? (
        <EmptyState
          title="Failed to load categories"
          description={error?.message ?? "Something went wrong."}
          action={<Button onClick={() => window.location.reload()}>Try again</Button>}
        />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={filtered}
            getRowId={(row) => row.id}
            emptyMessage="No categories found."
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
            <DialogTitle>{editing ? "Edit category" : "Add category"}</DialogTitle>
          </DialogHeader>
          <CategoryForm
            initialValue={editing}
            onSubmit={handleSubmit}
            loading={create.isPending || update.isPending}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete category?"
        description="This category will be permanently removed."
        confirmLabel="Delete"
        destructive
        loading={remove.isPending}
        onConfirm={handleDelete}
      />
    </AdminPageShell>
  );
}
