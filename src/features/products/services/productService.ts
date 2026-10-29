import { apiClient } from "@/services/api/axiosInstance";
import { ENDPOINTS } from "@/services/api/endpoints";
import type { PaginatedResponse } from "@/types/common";
import type {
  CreateProductInput,
  Product,
  ProductQueryParams,
  UpdateProductInput,
} from "../types";

function buildQuery(params: ProductQueryParams = {}): Record<string, unknown> {
  const query: Record<string, unknown> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    query[key] = Array.isArray(value) ? value.join(",") : value;
  });
  return query;
}

/**
 * Product service — the only place that talks to the products API. UI/hooks
 * consume these methods; they never call Axios directly.
 */
export const productService = {
  getProducts: (params?: ProductQueryParams) =>
    apiClient.get<PaginatedResponse<Product>>(
      ENDPOINTS.products.list,
      buildQuery(params),
    ),
  getProduct: (id: string) =>
    apiClient
      .get<{ data: Product }>(ENDPOINTS.products.detail(id))
      .then((res) => res.data),
  searchProducts: (params: ProductQueryParams) =>
    apiClient.get<PaginatedResponse<Product>>(
      ENDPOINTS.products.search,
      buildQuery(params),
    ),
  filterProducts: (params: ProductQueryParams) =>
    apiClient.get<PaginatedResponse<Product>>(
      ENDPOINTS.products.filter,
      buildQuery(params),
    ),
  compareProducts: (ids: string[]) =>
    apiClient
      .post<{ data: Product[] }>(ENDPOINTS.products.compare, { ids })
      .then((res) => res.data),
  createProduct: (input: CreateProductInput) =>
    apiClient.post<{ data: Product }>(ENDPOINTS.admin.products, input),
  updateProduct: (input: UpdateProductInput) =>
    apiClient.put<{ data: Product }>(ENDPOINTS.admin.product(input.id), input),
  deleteProduct: (id: string) =>
    apiClient.delete<{ success: boolean }>(ENDPOINTS.admin.product(id)),
};
