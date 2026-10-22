import { apiClient } from "@/services/api/axiosInstance";
import { ENDPOINTS } from "@/services/api/endpoints";
import { registerMock } from "@/services/api/mockAdapter";
import type { PaginatedResponse } from "@/types/common";
import type { Product, Category, CreateProductInput } from "@/features/products/types";
import { ORDER_STATUS } from "@/constants/orderStatus";
import type { Order } from "@/features/orders/types";
import productsData from "@data/products.json";
import categoriesData from "@data/categories.json";
import usersData from "@data/users.json";
import couponsData from "@data/coupons.json";
import bannersData from "@data/banners.json";
import logsData from "@data/logs.json";
import ordersData from "@data/orders.json";
import type {
  ActivityLog,
  AdminStats,
  Banner,
  Coupon,
  CreateCouponInput,
  Customer,
} from "../types";

const products = productsData as unknown as Product[];
const categories = categoriesData as unknown as Category[];
const users = usersData as unknown as Customer[];
const coupons = couponsData as unknown as Coupon[];
const banners = bannersData as unknown as Banner[];
const logs = logsData as unknown as ActivityLog[];
const orders = ordersData as unknown as Order[];

const mockStats: AdminStats = {
  totalRevenue: 128450,
  totalOrders: 842,
  totalCustomers: 1560,
  totalProducts: products.length,
  monthlySales: [
    { month: "Jan", revenue: 8200, orders: 48 },
    { month: "Feb", revenue: 9400, orders: 56 },
    { month: "Mar", revenue: 11200, orders: 68 },
    { month: "Apr", revenue: 10800, orders: 62 },
    { month: "May", revenue: 14500, orders: 84 },
    { month: "Jun", revenue: 16800, orders: 98 },
    { month: "Jul", revenue: 19200, orders: 112 },
    { month: "Aug", revenue: 18500, orders: 106 },
    { month: "Sep", revenue: 15600, orders: 92 },
    { month: "Oct", revenue: 17100, orders: 104 },
    { month: "Nov", revenue: 21000, orders: 128 },
    { month: "Dec", revenue: 24500, orders: 146 },
  ],
  bestSellers: products
    .sort((a, b) => b.soldCount - a.soldCount)
    .slice(0, 5)
    .map((product) => ({
      productId: product.id,
      name: product.name,
      soldCount: product.soldCount,
      revenue: product.soldCount * product.price,
    })),
};

function paginate<T>(list: T[], page: number, pageSize: number): PaginatedResponse<T> {
  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  return {
    data: list.slice(start, start + pageSize),
    page,
    pageSize,
    total,
    totalPages,
  };
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

// --- Dashboard ---

registerMock("GET", ENDPOINTS.admin.stats, () => ({ data: mockStats }));

// --- Products ---

registerMock("GET", ENDPOINTS.admin.products, (ctx) => {
  const page = Number(ctx.query.get("page") ?? "1");
  const pageSize = Number(ctx.query.get("pageSize") ?? "10");
  return { data: paginate(products, page, pageSize) };
});

registerMock("POST", ENDPOINTS.admin.products, (ctx) => {
  const body = ctx.body as Omit<Product, "id" | "createdAt" | "updatedAt">;
  const now = new Date().toISOString();
  const newProduct: Product = {
    ...body,
    id: `prod-${Date.now()}`,
    slug: slugify(body.name),
    rating: 0,
    reviewCount: 0,
    soldCount: 0,
    createdAt: now,
    updatedAt: now,
  };
  products.unshift(newProduct);
  return { data: { data: newProduct } };
});

registerMock("PUT", ENDPOINTS.admin.product(":id"), (ctx) => {
  const index = products.findIndex((p) => p.id === ctx.params.id);
  if (index === -1) {
    return {
      status: 404,
      data: { message: "Product not found", status: 404 },
    };
  }
  const body = ctx.body as Partial<Product>;
  products[index] = {
    ...products[index],
    ...body,
    id: ctx.params.id,
    slug: body.name ? slugify(body.name) : products[index].slug,
    updatedAt: new Date().toISOString(),
  };
  return { data: { data: products[index] } };
});

registerMock("DELETE", ENDPOINTS.admin.product(":id"), (ctx) => {
  const index = products.findIndex((p) => p.id === ctx.params.id);
  if (index === -1) {
    return {
      status: 404,
      data: { message: "Product not found", status: 404 },
    };
  }
  products.splice(index, 1);
  return { data: { success: true } };
});

// --- Categories ---

registerMock("GET", ENDPOINTS.admin.categories, (ctx) => {
  const page = Number(ctx.query.get("page") ?? "1");
  const pageSize = Number(ctx.query.get("pageSize") ?? "10");
  return { data: paginate(categories, page, pageSize) };
});

registerMock("POST", ENDPOINTS.admin.categories, (ctx) => {
  const body = ctx.body as Omit<Category, "id">;
  const newCategory: Category = {
    ...body,
    id: `cat-${Date.now()}`,
    productCount: 0,
  };
  categories.push(newCategory);
  return { data: { data: newCategory } };
});

registerMock("PUT", ENDPOINTS.admin.categories + "/:id", (ctx) => {
  const index = categories.findIndex((c) => c.id === ctx.params.id);
  if (index === -1) {
    return {
      status: 404,
      data: { message: "Category not found", status: 404 },
    };
  }
  const body = ctx.body as Partial<Category>;
  categories[index] = {
    ...categories[index],
    ...body,
    id: ctx.params.id,
  };
  return { data: { data: categories[index] } };
});

registerMock("DELETE", ENDPOINTS.admin.categories + "/:id", (ctx) => {
  const index = categories.findIndex((c) => c.id === ctx.params.id);
  if (index === -1) {
    return {
      status: 404,
      data: { message: "Category not found", status: 404 },
    };
  }
  categories.splice(index, 1);
  return { data: { success: true } };
});

// --- Customers ---

registerMock("GET", ENDPOINTS.admin.customers, (ctx) => {
  const page = Number(ctx.query.get("page") ?? "1");
  const pageSize = Number(ctx.query.get("pageSize") ?? "10");
  return { data: paginate(users, page, pageSize) };
});

registerMock("PATCH", ENDPOINTS.admin.customer(":id"), (ctx) => {
  const user = users.find((u) => u.id === ctx.params.id);
  if (!user) {
    return {
      status: 404,
      data: { message: "Customer not found", status: 404 },
    };
  }
  const body = ctx.body as { blocked?: boolean } | undefined;
  if (body && typeof body.blocked === "boolean") {
    user.blocked = body.blocked;
  }
  return { data: { data: user } };
});

// --- Coupons ---

registerMock("GET", ENDPOINTS.admin.coupons, (ctx) => {
  const page = Number(ctx.query.get("page") ?? "1");
  const pageSize = Number(ctx.query.get("pageSize") ?? "10");
  return { data: paginate(coupons, page, pageSize) };
});

registerMock("POST", ENDPOINTS.admin.coupons, (ctx) => {
  const body = ctx.body as CreateCouponInput;
  const newCoupon: Coupon = {
    ...body,
    id: `coupon-${Date.now()}`,
    usedCount: 0,
  };
  coupons.unshift(newCoupon);
  return { data: { data: newCoupon } };
});

registerMock("PUT", ENDPOINTS.admin.coupon(":id"), (ctx) => {
  const index = coupons.findIndex((c) => c.id === ctx.params.id);
  if (index === -1) {
    return {
      status: 404,
      data: { message: "Coupon not found", status: 404 },
    };
  }
  const body = ctx.body as Partial<Coupon>;
  coupons[index] = { ...coupons[index], ...body, id: ctx.params.id };
  return { data: { data: coupons[index] } };
});

registerMock("DELETE", ENDPOINTS.admin.coupon(":id"), (ctx) => {
  const index = coupons.findIndex((c) => c.id === ctx.params.id);
  if (index === -1) {
    return {
      status: 404,
      data: { message: "Coupon not found", status: 404 },
    };
  }
  coupons.splice(index, 1);
  return { data: { success: true } };
});

// --- Banners ---

registerMock("GET", ENDPOINTS.admin.banners, (ctx) => {
  const page = Number(ctx.query.get("page") ?? "1");
  const pageSize = Number(ctx.query.get("pageSize") ?? "10");
  return { data: paginate(banners, page, pageSize) };
});

registerMock("POST", ENDPOINTS.admin.banners, (ctx) => {
  const body = ctx.body as Omit<Banner, "id">;
  const newBanner: Banner = {
    ...body,
    id: `banner-${Date.now()}`,
  };
  banners.push(newBanner);
  return { data: { data: newBanner } };
});

registerMock("PUT", ENDPOINTS.admin.banners + "/:id", (ctx) => {
  const index = banners.findIndex((b) => b.id === ctx.params.id);
  if (index === -1) {
    return {
      status: 404,
      data: { message: "Banner not found", status: 404 },
    };
  }
  const body = ctx.body as Partial<Banner>;
  banners[index] = { ...banners[index], ...body, id: ctx.params.id };
  return { data: { data: banners[index] } };
});

registerMock("DELETE", ENDPOINTS.admin.banners + "/:id", (ctx) => {
  const index = banners.findIndex((b) => b.id === ctx.params.id);
  if (index === -1) {
    return {
      status: 404,
      data: { message: "Banner not found", status: 404 },
    };
  }
  banners.splice(index, 1);
  return { data: { success: true } };
});

// --- Orders ---

registerMock("GET", ENDPOINTS.admin.orders, (ctx) => {
  const page = Number(ctx.query.get("page") ?? "1");
  const pageSize = Number(ctx.query.get("pageSize") ?? "10");
  const status = ctx.query.get("status");
  const search = ctx.query.get("search")?.toLowerCase();
  const filtered = orders.filter((order) => {
    const matchStatus = status ? order.status === status : true;
    const matchSearch = search
      ? order.id.toLowerCase().includes(search) ||
        order.items.some((item) => item.name.toLowerCase().includes(search))
      : true;
    return matchStatus && matchSearch;
  });
  return { data: paginate(filtered, page, pageSize) };
});

registerMock("PATCH", ENDPOINTS.admin.orders + "/:id/status", (ctx) => {
  const order = orders.find((o) => o.id === ctx.params.id);
  if (!order) {
    return {
      status: 404,
      data: { message: "Order not found", status: 404 },
    };
  }
  const body = ctx.body as { status?: string } | undefined;
  if (body?.status && Object.values(ORDER_STATUS).includes(body.status as never)) {
    order.status = body.status as Order["status"];
    order.updatedAt = new Date().toISOString();
  }
  return { data: { data: order } };
});

// --- Payments ---

interface PaymentRow {
  id: string;
  orderId: string;
  method: string;
  amount: number;
  currency: string;
  status: "pending" | "paid" | "failed" | "refunded";
  createdAt: string;
}

const payments: PaymentRow[] = orders.map((order) => ({
  id: `pay-${order.id.replace("order-", "")}`,
  orderId: order.id,
  method: "Bakong KHQR",
  amount: order.grandTotal,
  currency: "USD",
  status: order.status === "cancelled" ? "failed" : "paid",
  createdAt: order.createdAt,
}));

registerMock("GET", ENDPOINTS.admin.payments, (ctx) => {
  const page = Number(ctx.query.get("page") ?? "1");
  const pageSize = Number(ctx.query.get("pageSize") ?? "10");
  return { data: paginate(payments, page, pageSize) };
});

// --- Logs ---

registerMock("GET", ENDPOINTS.admin.logs, (ctx) => {
  const page = Number(ctx.query.get("page") ?? "1");
  const pageSize = Number(ctx.query.get("pageSize") ?? "10");
  return { data: paginate(logs, page, pageSize) };
});

// --- Service exports ---

export type { PaymentRow };

/** Admin service — analytics and management CRUD across the admin portal. */
export const adminService = {
  getStats: () => apiClient.get<AdminStats>(ENDPOINTS.admin.stats),

  // Products
  getProducts: (page = 1, pageSize = 10) =>
    apiClient.get<PaginatedResponse<Product>>(ENDPOINTS.admin.products, {
      params: { page, pageSize },
    }),
  createProduct: (input: CreateProductInput) =>
    apiClient.post<{ data: Product }>(ENDPOINTS.admin.products, input),
  updateProduct: (id: string, input: Partial<CreateProductInput>) =>
    apiClient.put<{ data: Product }>(ENDPOINTS.admin.product(id), input),
  deleteProduct: (id: string) =>
    apiClient.delete<{ success: boolean }>(ENDPOINTS.admin.product(id)),

  // Categories
  getCategories: (page = 1, pageSize = 10) =>
    apiClient.get<PaginatedResponse<Category>>(ENDPOINTS.admin.categories, {
      params: { page, pageSize },
    }),
  createCategory: (input: Omit<Category, "id">) =>
    apiClient.post<{ data: Category }>(ENDPOINTS.admin.categories, input),
  updateCategory: (id: string, input: Partial<Category>) =>
    apiClient.put<{ data: Category }>(`${ENDPOINTS.admin.categories}/${id}`, input),
  deleteCategory: (id: string) =>
    apiClient.delete<{ success: boolean }>(`${ENDPOINTS.admin.categories}/${id}`),

  // Customers
  getCustomers: (page = 1, pageSize = 10) =>
    apiClient.get<PaginatedResponse<Customer>>(ENDPOINTS.admin.customers, {
      params: { page, pageSize },
    }),
  setCustomerBlocked: (id: string, blocked: boolean) =>
    apiClient.patch<{ data: Customer }>(ENDPOINTS.admin.customer(id), {
      blocked,
    }),

  // Orders
  getOrders: (page = 1, pageSize = 10, status?: string, search?: string) =>
    apiClient.get<PaginatedResponse<Order>>(ENDPOINTS.admin.orders, {
      params: { page, pageSize, status, search },
    }),
  updateOrderStatus: (id: string, status: string) =>
    apiClient.patch<{ data: Order }>(`${ENDPOINTS.admin.orders}/${id}/status`, {
      status,
    }),

  // Payments
  getPayments: (page = 1, pageSize = 10) =>
    apiClient.get<PaginatedResponse<PaymentRow>>(ENDPOINTS.admin.payments, {
      params: { page, pageSize },
    }),

  // Coupons
  getCoupons: (page = 1, pageSize = 10) =>
    apiClient.get<PaginatedResponse<Coupon>>(ENDPOINTS.admin.coupons, {
      params: { page, pageSize },
    }),
  createCoupon: (input: CreateCouponInput) =>
    apiClient.post<{ data: Coupon }>(ENDPOINTS.admin.coupons, input),
  updateCoupon: (id: string, input: Partial<Coupon>) =>
    apiClient.put<{ data: Coupon }>(ENDPOINTS.admin.coupon(id), input),
  deleteCoupon: (id: string) =>
    apiClient.delete<{ success: boolean }>(ENDPOINTS.admin.coupon(id)),

  // Banners
  getBanners: (page = 1, pageSize = 10) =>
    apiClient.get<PaginatedResponse<Banner>>(ENDPOINTS.admin.banners, {
      params: { page, pageSize },
    }),
  createBanner: (input: Omit<Banner, "id">) =>
    apiClient.post<{ data: Banner }>(ENDPOINTS.admin.banners, input),
  updateBanner: (id: string, input: Partial<Banner>) =>
    apiClient.put<{ data: Banner }>(`${ENDPOINTS.admin.banners}/${id}`, input),
  deleteBanner: (id: string) =>
    apiClient.delete<{ success: boolean }>(`${ENDPOINTS.admin.banners}/${id}`),

  // Logs
  getLogs: (page = 1, pageSize = 10) =>
    apiClient.get<PaginatedResponse<ActivityLog>>(ENDPOINTS.admin.logs, {
      params: { page, pageSize },
    }),
};
