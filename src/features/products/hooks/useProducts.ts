"use client";

import {
  keepPreviousData,
  useQuery,
  type UseQueryResult,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { productService } from "../services/productService";
import type { PaginatedResponse } from "@/types/common";
import type { Product, ProductQueryParams } from "../types";

export const productKeys = {
  all: ["products"] as const,
  list: (params?: ProductQueryParams) =>
    [...productKeys.all, "list", params ?? {}] as const,
  detail: (id: string) => [...productKeys.all, "detail", id] as const,
  compare: (ids: string[]) => [...productKeys.all, "compare", ids] as const,
};

/** Paginated / filtered product list. Server state owned by TanStack Query. */
export function useProducts(
  params?: ProductQueryParams,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Product>, Error>,
    "queryKey" | "queryFn" | "placeholderData"
  >,
): UseQueryResult<PaginatedResponse<Product>, Error> {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productService.getProducts(params),
    placeholderData: keepPreviousData,
    ...options,
  });
}
