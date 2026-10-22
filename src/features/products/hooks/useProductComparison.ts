"use client";

import { useQuery } from "@tanstack/react-query";
import { productService } from "../services/productService";
import { productKeys } from "./useProducts";

/** Fetch full product records for a comparison set (max 4 enforced by UI). */
export function useProductComparison(ids: string[]) {
  return useQuery({
    queryKey: productKeys.compare(ids),
    queryFn: () => productService.compareProducts(ids),
    enabled: ids.length > 0,
  });
}
