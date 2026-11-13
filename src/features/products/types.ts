import type { PaginationParams, SortDirection } from "@/types/common";

/** Top-level product categories sold by CAMBOTECH (mirrors CC Computer). */
export type ProductCategorySlug =
  | "laptops"
  | "desktops"
  | "pc-components"
  | "used"
  | "peripherals"
  | "storage"
  | "network"
  | "speakers"
  | "printers"
  | "accessories";

export interface Category {
  id: string;
  name: string;
  slug: ProductCategorySlug;
  description?: string;
  imageUrl?: string;
  productCount?: number;
}

/** Technical specification fields used by detail view and comparison table. */
export interface ProductSpecs {
  cpu?: string;
  gpu?: string;
  ram?: string;
  storage?: string;
  ssd?: string;
  hdd?: string;
  display?: string;
  screenSize?: number;
  os?: string;
  ports?: string[];
  weight?: string;
  color?: string;
  features?: string;
  battery?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  /** Stable brand relationship id, e.g. "dell". */
  brandId?: string;
  /** Sub-brand / product line, e.g. Vivobook, ZenBook, Legion, TUF. */
  series?: string;
  /** Stable series relationship id, e.g. "legion". */
  seriesId?: string;
  /** Groups configuration variants of the same base model. */
  modelKey?: string;
  /** Stable category relationship id, e.g. "cat-laptops". */
  categoryId?: string;
  category: ProductCategorySlug;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  images: string[];
  thumbnail: string;
  stock: number;
  warrantyMonths: number;
  soldCount: number;
  specs: ProductSpecs;
  /** Manufacturer / store SKU shown on the product card. */
  productCode?: string;
  /** Promotional ribbon label, e.g. "DEFAULT COMPANY" or "VIP SPECS". */
  badge?: string;
  /** Bundle items included for free with the purchase. */
  freeGifts?: string[];
  tags: string[];
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ProductSortOption =
  | "newest"
  | "price_asc"
  | "price_desc"
  | "best_selling";

export interface ProductFilters {
  search?: string;
  category?: ProductCategorySlug;
  brands?: string[];
  /** Series / product line such as TUF, ROG, Legion, MacBook. */
  series?: string[];
  /** Restrict to variants sharing the same base model. */
  modelKey?: string;
  minPrice?: number;
  maxPrice?: number;
  cpu?: string[];
  gpu?: string[];
  ram?: string[];
  storage?: string[];
  ssd?: boolean;
  hdd?: boolean;
  screenSize?: number[];
  inStockOnly?: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  sort?: ProductSortOption;
}

export interface ProductQueryParams extends PaginationParams, ProductFilters {
  direction?: SortDirection;
  /** Return every matching product without a page/pageSize slice. */
  all?: boolean;
}

/** Payloads for admin product mutations. */
export type CreateProductInput = Omit<
  Product,
  | "id"
  | "soldCount"
  | "createdAt"
  | "updatedAt"
  | "slug"
>;

export type UpdateProductInput = Partial<CreateProductInput> & { id: string };
