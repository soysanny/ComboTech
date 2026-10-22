"use client";

import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { cn } from "@/lib/utils";
import type { SortDirection } from "@/types/common";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

export interface DataTableSort {
  key: string;
  direction: SortDirection;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowId: (row: T) => string;
  sort?: DataTableSort;
  onSortChange?: (sort: DataTableSort) => void;
  emptyMessage?: string;
  emptyAction?: React.ReactNode;
  className?: string;
}

/** Generic responsive data table with sortable headers and empty state. */
export function DataTable<T>({
  columns,
  data,
  getRowId,
  sort,
  onSortChange,
  emptyMessage = "No data available.",
  emptyAction,
  className,
}: DataTableProps<T>) {
  const handleSort = (key: string) => {
    if (!onSortChange) return;
    const direction: SortDirection =
      sort?.key === key && sort.direction === "asc" ? "desc" : "asc";
    onSortChange({ key, direction });
  };

  if (data.length === 0) {
    return (
      <EmptyState
        title="No results"
        description={emptyMessage}
        action={emptyAction}
        className="mt-4"
      />
    );
  }

  return (
    <div className={cn("rounded-xl border", className)}>
      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => {
                const isSorted = sort?.key === column.key;
                return (
                  <TableHead
                    key={column.key}
                    className={cn("whitespace-nowrap", column.className)}
                  >
                    {column.sortable ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="-ml-2 h-auto gap-1 px-2 py-1 font-medium"
                        onClick={() => handleSort(column.key)}
                      >
                        {column.header}
                        <SortIcon isSorted={isSorted} direction={sort?.direction} />
                      </Button>
                    ) : (
                      column.header
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={getRowId(row)}>
                {columns.map((column) => (
                  <TableCell
                    key={`${getRowId(row)}-${column.key}`}
                    className={cn("whitespace-nowrap", column.className)}
                  >
                    {column.render
                      ? column.render(row)
                      : (row as Record<string, unknown>)[column.key] as React.ReactNode}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function SortIcon({
  isSorted,
  direction,
}: {
  isSorted: boolean;
  direction?: SortDirection;
}) {
  if (!isSorted) return <ArrowUpDown className="size-3.5 text-muted-foreground" />;
  return direction === "asc" ? (
    <ArrowUp className="size-3.5" />
  ) : (
    <ArrowDown className="size-3.5" />
  );
}
