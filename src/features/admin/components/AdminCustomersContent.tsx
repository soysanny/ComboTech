"use client";

import { useMemo, useState } from "react";
import { Shield, ShieldOff } from "lucide-react";
import { AdminPageShell } from "@/components/layout/AdminPageShell";
import { DataTable } from "@/components/tables/DataTable";
import { DataTablePagination } from "@/components/tables/DataTablePagination";
import { DataTableToolbar } from "@/components/tables/DataTableToolbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/shared/Skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { useAdminCustomers, useSetCustomerBlocked } from "../hooks/useAdmin";
import type { Customer } from "../types";
import type { DataTableColumn } from "@/components/tables/DataTable";
import { formatDate } from "@/utils/formatDate";

export function AdminCustomersContent() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, error } = useAdminCustomers(page, pageSize);
  const setBlocked = useSetCustomerBlocked();

  const filtered = useMemo(() => {
    const list = data?.data ?? [];
    if (!search) return list;
    const term = search.toLowerCase();
    return list.filter(
      (customer) =>
        customer.name.toLowerCase().includes(term) ||
        customer.email.toLowerCase().includes(term),
    );
  }, [data, search]);

  const total = data?.total ?? 0;

  const columns: DataTableColumn<Customer>[] = [
    { key: "name", header: "Name", render: (row) => row.name },
    { key: "email", header: "Email", render: (row) => row.email },
    {
      key: "role",
      header: "Role",
      render: (row) => <Badge variant="outline">{row.role}</Badge>,
    },
    {
      key: "status",
      header: "Status",
      render: (row) =>
        row.blocked ? (
          <Badge variant="destructive">Blocked</Badge>
        ) : (
          <Badge variant="default">Active</Badge>
        ),
    },
    {
      key: "createdAt",
      header: "Joined",
      render: (row) => formatDate(row.createdAt),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setBlocked.mutate({ id: row.id, blocked: !row.blocked })}
          disabled={setBlocked.isPending}
        >
          {row.blocked ? (
            <>
              <Shield className="mr-1.5 size-4" />
              Unblock
            </>
          ) : (
            <>
              <ShieldOff className="text-destructive mr-1.5 size-4" />
              Block
            </>
          )}
        </Button>
      ),
    },
  ];

  return (
    <AdminPageShell
      title="Customer Management"
      description="View and manage registered customer accounts."
    >
      <DataTableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search customers..."
      />

      {isLoading ? (
        <Skeleton className="h-80 w-full" />
      ) : isError ? (
        <EmptyState
          title="Failed to load customers"
          description={error?.message ?? "Something went wrong."}
          action={<Button onClick={() => window.location.reload()}>Try again</Button>}
        />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={filtered}
            getRowId={(row) => row.id}
            emptyMessage="No customers found."
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
