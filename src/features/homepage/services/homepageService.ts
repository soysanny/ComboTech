import { apiClient } from "@/services/api/axiosInstance";
import { ENDPOINTS } from "@/services/api/endpoints";
import type { HomepageBrandSectionView } from "../types";

/** Homepage service — reads the resolved brand sections for the storefront. */
export const homepageService = {
  getBrandSections: () =>
    apiClient.get<{ data: HomepageBrandSectionView[] }>(
      ENDPOINTS.homepage.brandSections,
    ),
};
