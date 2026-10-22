import { useQuery } from "@tanstack/react-query";
import { bannerService } from "../services/bannerService";
import type { Banner } from "@/features/admin/types";

export const bannerKeys = {
  all: ["banners"] as const,
  list: (type?: Banner["type"]) => [...bannerKeys.all, "list", type] as const,
};

export function useBanners(type?: Banner["type"]) {
  return useQuery({
    queryKey: bannerKeys.list(type),
    queryFn: () => bannerService.getBanners(type),
    select: (res) => res.data,
  });
}
