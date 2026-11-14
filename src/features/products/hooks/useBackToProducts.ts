"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { readCatalogReturnTarget } from "../lib/catalogNavigation";

/**
 * Navigates back to the list a product was opened from so the browser history
 * entry (and therefore filters, search, sort and scroll) is preserved. Falls
 * back to the catalog when the detail page was opened directly.
 */
export function useBackToProducts(productId: string) {
  const router = useRouter();

  return useCallback(() => {
    const target = readCatalogReturnTarget();
    if (target?.productId === productId) {
      router.back();
      return;
    }
    router.push(ROUTES.products);
  }, [productId, router]);
}
