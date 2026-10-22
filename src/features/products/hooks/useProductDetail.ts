"use client";

import { useQuery } from "@tanstack/react-query";
import { productService } from "../services/productService";
import { productKeys } from "./useProducts";

/** Single product detail by id. */
export function useProductDetail(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.getProduct(id),
    enabled: Boolean(id),
  });
}
