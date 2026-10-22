import { apiClient } from "@/services/api/axiosInstance";
import { ENDPOINTS } from "@/services/api/endpoints";
import {
  registerMock,
  type MockRequestContext,
} from "@/services/api/mockAdapter";
import type { PaginatedResponse } from "@/types/common";
import productsData from "@data/products.json";
import type {
  CreateProductInput,
  Product,
  ProductQueryParams,
  UpdateProductInput,
} from "../types";

const products = productsData as unknown as Product[];

function paginate(list: Product[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize;
  return list.slice(start, start + pageSize);
}

function applyQuery(list: Product[], q: URLSearchParams): Product[] {
  let result = [...list];
  const search = q.get("search")?.toLowerCase();
  const category = q.get("category");
  const brand = q.get("brands");
  const series = q.get("series");
  const modelKey = q.get("modelKey");
  const minPrice = q.get("minPrice");
  const maxPrice = q.get("maxPrice");
  const inStockOnly = q.get("inStockOnly");
  const sort = q.get("sort");
  const cpu = q.get("cpu");
  const gpu = q.get("gpu");
  const ram = q.get("ram");
  const storage = q.get("storage");
  const ssd = q.get("ssd");
  const hdd = q.get("hdd");
  const screenSize = q.get("screenSize");

  if (search) {
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.brand.toLowerCase().includes(search) ||
        (p.series?.toLowerCase().includes(search) ?? false) ||
        (p.productCode?.toLowerCase().includes(search) ?? false) ||
        p.description.toLowerCase().includes(search),
    );
  }
  if (category) result = result.filter((p) => p.category === category);
  if (brand) {
    const brands = brand.split(",").map((b) => b.toLowerCase());
    result = result.filter((p) => brands.includes(p.brand.toLowerCase()));
  }
  if (series) {
    const seriesList = series.split(",").map((s) => s.toLowerCase());
    result = result.filter(
      (p) => p.series && seriesList.includes(p.series.toLowerCase()),
    );
  }
  if (modelKey) {
    result = result.filter((p) => p.modelKey === modelKey);
  }
  if (cpu) {
    const cpus = cpu.split(",").map((c) => c.toLowerCase());
    result = result.filter(
      (p) => p.specs.cpu && cpus.includes(p.specs.cpu.toLowerCase()),
    );
  }
  if (gpu) {
    const gpus = gpu.split(",").map((g) => g.toLowerCase());
    result = result.filter(
      (p) => p.specs.gpu && gpus.includes(p.specs.gpu.toLowerCase()),
    );
  }
  if (ram) {
    const rams = ram.split(",").map((r) => r.toLowerCase());
    result = result.filter(
      (p) => p.specs.ram && rams.includes(p.specs.ram.toLowerCase()),
    );
  }
  if (storage) {
    const storages = storage.split(",").map((s) => s.toLowerCase());
    result = result.filter(
      (p) =>
        p.specs.storage &&
        storages.includes(p.specs.storage.toLowerCase()),
    );
  }
  if (ssd === "true")
    result = result.filter((p) => p.specs.ssd && p.specs.ssd.length > 0);
  if (hdd === "true")
    result = result.filter((p) => p.specs.hdd && p.specs.hdd.length > 0);
  if (screenSize) {
    const sizes = screenSize.split(",").map(Number);
    result = result.filter(
      (p) => p.specs.screenSize && sizes.includes(p.specs.screenSize),
    );
  }
  if (minPrice) result = result.filter((p) => p.price >= Number(minPrice));
  if (maxPrice) result = result.filter((p) => p.price <= Number(maxPrice));
  if (inStockOnly === "true") result = result.filter((p) => p.stock > 0);

  switch (sort) {
    case "price_asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "best_selling":
      result.sort((a, b) => b.soldCount - a.soldCount);
      break;
    case "highest_rating":
      result.sort((a, b) => b.rating - a.rating);
      break;
    case "newest":
    default:
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }
  return result;
}

function listHandler(ctx: MockRequestContext) {
  const page = Number(ctx.query.get("page") ?? "1");
  const pageSize = Number(ctx.query.get("pageSize") ?? "12");
  const filtered = applyQuery(products, ctx.query);
  const data: PaginatedResponse<Product> = {
    data: paginate(filtered, page, pageSize),
    page,
    pageSize,
    total: filtered.length,
    totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
  };
  return { data };
}

// Register mock handlers (no-ops when hitting a real backend).
registerMock("GET", ENDPOINTS.products.list, listHandler);
registerMock("GET", ENDPOINTS.products.search, listHandler);
registerMock("GET", ENDPOINTS.products.filter, listHandler);
registerMock("GET", "/products/:id", (ctx) => {
  const product = products.find((p) => p.id === ctx.params.id);
  return product
    ? { data: { data: product } }
    : { status: 404, data: { message: "Product not found", status: 404 } };
});
registerMock("POST", ENDPOINTS.products.compare, (ctx) => {
  const body = ctx.body as { ids?: string[] } | undefined;
  const ids = body?.ids ?? [];
  const data = products.filter((p) => ids.includes(p.id));
  return { data: { data } };
});

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
