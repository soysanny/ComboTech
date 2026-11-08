"use client";

import { useQuery } from "@tanstack/react-query";
import { homepageService } from "../services/homepageService";

export const homepageKeys = {
  all: ["homepage"] as const,
  brandSections: () => [...homepageKeys.all, "brand-sections"] as const,
};

export function useHomepageBrandSections() {
  return useQuery({
    queryKey: homepageKeys.brandSections(),
    queryFn: () => homepageService.getBrandSections(),
    select: (res) => res.data,
  });
}
