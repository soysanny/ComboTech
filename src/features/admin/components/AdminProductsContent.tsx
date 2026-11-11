"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2, Upload } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { AdminPageShell } from "@/components/layout/AdminPageShell";
import { DataTable } from "@/components/tables/DataTable";
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
  useAdminProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "../hooks/useAdmin";
import { ProductForm } from "./ProductForm";
import { BulkProductImportForm } from "./BulkProductImportForm";
import type { Product, CreateProductInput } from "@/features/products/types";
import { formatCurrency } from "@/utils/formatCurrency";
import type { DataTableColumn } from "@/components/tables/DataTable";

export function AdminProductsContent() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [editing, setEditing] = useState<Product | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useAdminProducts(
    debouncedSearch || undefined,
  );
  const create = useCreateProduct();
  const update = useUpdateProduct();
  const remove = useDeleteProduct();

  const products = data?.data ?? [];
  const total = data?.total ?? 0;

  const columns: DataTableColumn<Product>[] = [
    { key: "name", header: "Product", render: (row) => row.name },
    { key: "category", header: "Category", render: (row) => row.category },
    {
      key: "price",
      header: "Price",
      render: (row) => formatCurrency(row.price, "USD"),
    },
    {
      key: "stock",
      header: "Stock",
      render: (row) => (
        <Badge
          variant={
            row.stock === 0
              ? "destructive"
              : row.stock < 10
                ? "secondary"
                : "default"
          }
        >
          {row.stock}
        </Badge>
      ),
    },
    {
      key: "flags",
      header: "Flags",
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.isFeatured && <Badge variant="outline">Featured</Badge>}
          {row.isNewArrival && <Badge variant="outline">New</Badge>}
          {row.isBestSeller && <Badge variant="outline">Best</Badge>}
        </div>
      ),
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

  const handleSubmit = (formData: CreateProductInput) => {
    if (editing) {
      update.mutate(
        { id: editing.id, input: formData },
        { onSuccess: () => setDialogOpen(false) },
      );
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
      title="Product Management"
      description="Create, update, and organize your store catalog."
    >
      <DataTableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search products..."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setImportOpen(true)}>
              <Upload className="mr-1.5 size-4" />
              Import
            </Button>
            <Button
              onClick={() => {
                setEditing(undefined);
                setDialogOpen(true);
              }}
            >
              <Plus className="mr-1.5 size-4" />
              Add product
            </Button>
          </div>
        }
      />

      {isLoading ? (
        <Skeleton className="h-80 w-full" />
      ) : isError ? (
        <EmptyState
          title="Failed to load products"
          description={error?.message ?? "Something went wrong."}
          action={
            <Button onClick={() => window.location.reload()}>Try again</Button>
          }
        />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={products}
            getRowId={(row) => row.id}
            emptyMessage="No products found."
            maxHeight="65vh"
          />
          <p className="text-muted-foreground mt-4 text-sm" aria-live="polite">
            {total} {total === 1 ? "product" : "products"}
          </p>
        </>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit product" : "Add product"}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            initialValue={editing}
            onSubmit={handleSubmit}
            loading={create.isPending || update.isPending}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Import products</DialogTitle>
          </DialogHeader>
          <BulkProductImportForm onImported={() => setImportOpen(false)} />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete product?"
        description="This product will be permanently removed. This action cannot be undone."
        confirmLabel="Delete"
        destructive
        loading={remove.isPending}
        onConfirm={handleDelete}
      />
    </AdminPageShell>
  );
}
