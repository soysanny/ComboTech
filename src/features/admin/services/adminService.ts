import { apiClient } from "@/services/api/axiosInstance";
import { ENDPOINTS } from "@/services/api/endpoints";
import type { PaginatedResponse } from "@/types/common";
import type {
  Category,
  CreateProductInput,
  Product,
} from "@/features/products/types";
import type { Order } from "@/features/orders/types";
import type {
  ActivityLog,
  AdminStats,
  Banner,
  Coupon,
  CreateCouponInput,
  Customer,
} from "../types";
import type { ContactMessage } from "@/features/contact/types";

interface PaymentRow {
  id: string;
  orderId: string;
  method: string;
  amount: number;
  currency: string;
  status: "pending" | "paid" | "failed" | "refunded";
  createdAt: string;
}

export type { PaymentRow };

/** Admin service — analytics and management CRUD across the admin portal. */
export const adminService = {
  getStats: () => apiClient.get<AdminStats>(ENDPOINTS.admin.stats),

  // Products
  getProducts: (page = 1, pageSize = 10, search?: string) =>
    apiClient.get<PaginatedResponse<Product>>(ENDPOINTS.admin.products, {
      params: { page, pageSize, search },
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

  // Contact messages
  getMessages: () =>
    apiClient.get<{ data: ContactMessage[] }>(ENDPOINTS.contact.submit),
};
