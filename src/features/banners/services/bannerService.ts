import { apiClient } from "@/services/api/axiosInstance";
import { ENDPOINTS } from "@/services/api/endpoints";
import {
  registerMock,
} from "@/services/api/mockAdapter";
import bannersData from "@data/banners.json";
import type { Banner } from "@/features/admin/types";

const banners = bannersData as unknown as Banner[];

registerMock("GET", ENDPOINTS.banners.list, (ctx) => {
  const type = ctx.query.get("type") as Banner["type"] | null;
  const active = banners
    .filter((b) => b.active)
    .sort((a, b) => a.order - b.order);
  const filtered = type ? active.filter((b) => b.type === type) : active;
  return { data: { data: filtered } };
});

export const bannerService = {
  getBanners: (type?: Banner["type"]) =>
    apiClient.get<{ data: Banner[] }>(ENDPOINTS.banners.list, type ? { type } : undefined),
};
