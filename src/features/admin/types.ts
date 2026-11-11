import type { UserRole } from "@/types/common";

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  monthlySales: MonthlySalesPoint[];
  bestSellers: BestSellerRow[];
}

export interface MonthlySalesPoint {
  month: string;
  revenue: number;
  orders: number;
}

export interface BestSellerRow {
  productId: string;
  name: string;
  soldCount: number;
  revenue: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: UserRole;
  blocked: boolean;
  createdAt: string;
}

export type DiscountType = "percentage" | "amount";

export interface Coupon {
  id: string;
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  minSpend?: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  active: boolean;
}

export type CreateCouponInput = Omit<Coupon, "id" | "usedCount">;

export type BannerType = "homepage" | "promotion";

export interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl?: string;
  type: BannerType;
  active: boolean;
  order: number;
  /** Promotional homepage carousel the banner belongs to (1 or 2). */
  row?: 1 | 2;
}

export type ActivityLogType =
  "login" | "logout" | "product_change" | "order_change";

export interface ActivityLog {
  id: string;
  type: ActivityLogType;
  actor: string;
  description: string;
  createdAt: string;
}
