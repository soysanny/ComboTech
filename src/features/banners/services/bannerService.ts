import { apiClient } from "@/services/api/axiosInstance";
import { ENDPOINTS } from "@/services/api/endpoints";
import type { Banner } from "@/features/admin/types";

/** Banner service — reads active banners from the API. */
export const bannerService = {
  getBanners: (type?: Banner["type"]) =>
    apiClient.get<{ data: Banner[] }>(
      ENDPOINTS.banners.list,
      type ? { type } : undefined,
    ),
};
