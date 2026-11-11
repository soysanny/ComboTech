"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import type { Category, CreateProductInput } from "@/features/products/types";
import { productKeys } from "@/features/products/hooks/useProducts";
import { bannerKeys } from "@/features/banners/hooks/useBanners";
import { adminService } from "../services/adminService";
import type { Banner, Coupon, CreateCouponInput } from "../types";

export const adminKeys = {
  all: ["admin"] as const,
  stats: () => [...adminKeys.all, "stats"] as const,
  products: () => [...adminKeys.all, "products"] as const,
  categories: () => [...adminKeys.all, "categories"] as const,
  customers: () => [...adminKeys.all, "customers"] as const,
  orders: () => [...adminKeys.all, "orders"] as const,
  payments: () => [...adminKeys.all, "payments"] as const,
  coupons: () => [...adminKeys.all, "coupons"] as const,
  banners: () => [...adminKeys.all, "banners"] as const,
  logs: () => [...adminKeys.all, "logs"] as const,
  messages: () => [...adminKeys.all, "messages"] as const,
};

// --- Stats ---

export function useAdminStats() {
  return useQuery({
    queryKey: adminKeys.stats(),
    queryFn: () => adminService.getStats(),
  });
}

// --- Products ---

export function useAdminProducts(search?: string) {
  return useQuery({
    queryKey: [...adminKeys.products(), "all", search ?? ""],
    queryFn: () => adminService.getAllProducts(search),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateProductInput) =>
      adminService.createProduct(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.products() });
      void queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
      void queryClient.invalidateQueries({ queryKey: productKeys.all });
      toast.success("Product created");
    },
    onError: (error: Error) =>
      toast.error(error.message ?? "Failed to create product"),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: Partial<CreateProductInput>;
    }) => adminService.updateProduct(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.products() });
      void queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
      void queryClient.invalidateQueries({ queryKey: productKeys.all });
      toast.success("Product updated");
    },
    onError: (error: Error) =>
      toast.error(error.message ?? "Failed to update product"),
  });
}

export function useBulkCreateProducts() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (products: CreateProductInput[]) =>
      adminService.bulkCreateProducts(products),
    onSuccess: (result) => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.products() });
      void queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
      void queryClient.invalidateQueries({ queryKey: productKeys.all });
      toast.success(
        `Imported ${result.created} product${result.created === 1 ? "" : "s"}`,
      );
    },
    onError: (error: Error) =>
      toast.error(error.message ?? "Failed to import products"),
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.deleteProduct(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.products() });
      void queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
      void queryClient.invalidateQueries({ queryKey: productKeys.all });
      toast.success("Product deleted");
    },
    onError: (error: Error) =>
      toast.error(error.message ?? "Failed to delete product"),
  });
}

// --- Categories ---

export function useAdminCategories(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: [...adminKeys.categories(), page, pageSize],
    queryFn: () => adminService.getCategories(page, pageSize),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<Category, "id">) =>
      adminService.createCategory(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.categories() });
      toast.success("Category created");
    },
    onError: (error: Error) =>
      toast.error(error.message ?? "Failed to create category"),
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<Category> }) =>
      adminService.updateCategory(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.categories() });
      toast.success("Category updated");
    },
    onError: (error: Error) =>
      toast.error(error.message ?? "Failed to update category"),
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.deleteCategory(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.categories() });
      toast.success("Category deleted");
    },
    onError: (error: Error) =>
      toast.error(error.message ?? "Failed to delete category"),
  });
}

// --- Customers ---

export function useAdminCustomers(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: [...adminKeys.customers(), page, pageSize],
    queryFn: () => adminService.getCustomers(page, pageSize),
  });
}

export function useSetCustomerBlocked() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, blocked }: { id: string; blocked: boolean }) =>
      adminService.setCustomerBlocked(id, blocked),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.customers() });
      toast.success("Customer updated");
    },
    onError: (error: Error) =>
      toast.error(error.message ?? "Failed to update customer"),
  });
}

// --- Orders ---

export function useAdminOrders(
  page = 1,
  pageSize = 10,
  status?: string,
  search?: string,
) {
  return useQuery({
    queryKey: [...adminKeys.orders(), page, pageSize, status, search],
    queryFn: () => adminService.getOrders(page, pageSize, status, search),
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminService.updateOrderStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.orders() });
      void queryClient.invalidateQueries({ queryKey: adminKeys.payments() });
      void queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
      toast.success("Order status updated");
    },
    onError: (error: Error) =>
      toast.error(error.message ?? "Failed to update order"),
  });
}

// --- Payments ---

export function useAdminPayments(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: [...adminKeys.payments(), page, pageSize],
    queryFn: () => adminService.getPayments(page, pageSize),
  });
}

// --- Coupons ---

export function useAdminCoupons(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: [...adminKeys.coupons(), page, pageSize],
    queryFn: () => adminService.getCoupons(page, pageSize),
  });
}

export function useCreateCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCouponInput) => adminService.createCoupon(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.coupons() });
      toast.success("Coupon created");
    },
    onError: (error: Error) =>
      toast.error(error.message ?? "Failed to create coupon"),
  });
}

export function useUpdateCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<Coupon> }) =>
      adminService.updateCoupon(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.coupons() });
      toast.success("Coupon updated");
    },
    onError: (error: Error) =>
      toast.error(error.message ?? "Failed to update coupon"),
  });
}

export function useDeleteCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.deleteCoupon(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.coupons() });
      toast.success("Coupon deleted");
    },
    onError: (error: Error) =>
      toast.error(error.message ?? "Failed to delete coupon"),
  });
}

// --- Banners ---

export function useAdminBanners(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: [...adminKeys.banners(), page, pageSize],
    queryFn: () => adminService.getBanners(page, pageSize),
  });
}

export function useCreateBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<Banner, "id">) => adminService.createBanner(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.banners() });
      void queryClient.invalidateQueries({ queryKey: bannerKeys.all });
      toast.success("Banner created");
    },
    onError: (error: Error) =>
      toast.error(error.message ?? "Failed to create banner"),
  });
}

export function useUpdateBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<Banner> }) =>
      adminService.updateBanner(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.banners() });
      void queryClient.invalidateQueries({ queryKey: bannerKeys.all });
      toast.success("Banner updated");
    },
    onError: (error: Error) =>
      toast.error(error.message ?? "Failed to update banner"),
  });
}

export function useDeleteBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.deleteBanner(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.banners() });
      void queryClient.invalidateQueries({ queryKey: bannerKeys.all });
      toast.success("Banner deleted");
    },
    onError: (error: Error) =>
      toast.error(error.message ?? "Failed to delete banner"),
  });
}

// --- Logs ---

export function useAdminLogs(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: [...adminKeys.logs(), page, pageSize],
    queryFn: () => adminService.getLogs(page, pageSize),
  });
}

// --- Contact messages ---

export function useAdminMessages() {
  return useQuery({
    queryKey: adminKeys.messages(),
    queryFn: () => adminService.getMessages(),
  });
}
