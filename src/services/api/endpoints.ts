/**
 * All backend URL path constants live here. Services reference these instead
 * of inlining strings so the mock adapter and a future real backend agree on
 * a single contract.
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

export const ENDPOINTS = {
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    me: "/auth/me",
  },
  products: {
    list: "/products",
    detail: (id: string) => `/products/${id}`,
    search: "/products/search",
    filter: "/products/filter",
    compare: "/products/compare",
  },
  categories: {
    list: "/categories",
    detail: (id: string) => `/categories/${id}`,
  },
  reviews: {
    list: (productId: string) => `/products/${productId}/reviews`,
    create: (productId: string) => `/products/${productId}/reviews`,
    detail: (id: string) => `/reviews/${id}`,
  },
  contact: {
    submit: "/contact",
  },
  banners: {
    list: "/banners",
  },
  homepage: {
    brandSections: "/homepage/brand-sections",
  },
  admin: {
    stats: "/admin/stats",
    products: "/admin/products",
    productsBulk: "/admin/products/bulk",
    product: (id: string) => `/admin/products/${id}`,
    categories: "/admin/categories",
    customers: "/admin/customers",
    customer: (id: string) => `/admin/customers/${id}`,
    orders: "/admin/orders",
    payments: "/admin/payments",
    coupons: "/admin/coupons",
    coupon: (id: string) => `/admin/coupons/${id}`,
    banners: "/admin/banners",
    homepageBrandSections: "/admin/homepage-brand-sections",
    logs: "/admin/logs",
  },
} as const;
