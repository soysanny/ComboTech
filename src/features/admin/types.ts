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

export type BannerTitleFont = "sans" | "brand" | "mono";
export type BannerTextAlign = "left" | "center" | "right";
export type BannerHorizontalPosition = "left" | "center" | "right";
export type BannerVerticalPosition = "top" | "middle" | "bottom";

/** Per-banner title presentation, persisted with the banner document. */
export interface BannerTitleStyle {
  fontFamily: BannerTitleFont;
  fontSize: number;
  mobileFontSize: number;
  fontWeight: number;
  color: string;
  lineHeight: number;
  letterSpacing: number;
  textAlign: BannerTextAlign;
  maxWidth: number;
  mobileMaxWidth: number;
  horizontalPosition: BannerHorizontalPosition;
  verticalPosition: BannerVerticalPosition;
  paddingX: number;
  paddingY: number;
  mobilePaddingX: number;
  mobilePaddingY: number;
  buttonGap: number;
  mobileButtonGap: number;
  maxLinesEnabled: boolean;
  maxLines: number;
}

export interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl?: string;
  type: BannerType;
  active: boolean;
  order: number;
  /** Published title styling. Missing on legacy banners. */
  titleStyle?: BannerTitleStyle;
  /** Draft title that is only visible in the admin editor. */
  draftTitle?: string | null;
  /** Draft title styling that is only visible in the admin editor. */
  draftTitleStyle?: BannerTitleStyle | null;
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
