/**
 * Central route path registry. UI code must reference these constants rather
 * than hardcoding strings so route changes stay in one place.
 */
export const ROUTES = {
  // Storefront (user)
  home: "/",
  about: "/about",
  contact: "/contact",
  products: "/products",
  productDetail: (id: string) => `/products/${id}`,

  // Staff auth
  login: "/login",

  // Admin (prefixed with /admin so route groups don't collide with storefront)
  adminDashboard: "/admin/dashboard",
  adminProducts: "/admin/products",
  adminCategories: "/admin/categories",
  adminCustomers: "/admin/customers",
  adminOrders: "/admin/orders",
  adminPayments: "/admin/payments",
  adminCoupons: "/admin/coupons",
  adminBanners: "/admin/banners",
  adminLogs: "/admin/logs",
  adminMessages: "/admin/messages",

  // Error / status
  forbidden: "/403",
  unauthorized: "/401",
} as const;

export type AppRoute = typeof ROUTES;
