import type { Product } from "@/features/products/types";

export type BrandSelectionMode = "auto" | "manual";

/** Admin-controlled configuration for one brand section on the homepage. */
export interface HomepageBrandSection {
  id: string;
  brand: string;
  enabled: boolean;
  order: number;
  productLimit: number;
  selectionMode: BrandSelectionMode;
  productIds: string[];
}

/** A brand section with its resolved products for storefront rendering. */
export interface HomepageBrandSectionView extends HomepageBrandSection {
  products: Product[];
}

/** Lightweight product option used by the admin manual-selection picker. */
export interface HomepageBrandProductOption {
  id: string;
  name: string;
  brand: string;
  thumbnail: string;
}

/** Payload returned by the admin brand-sections endpoint. */
export interface HomepageBrandSectionsAdminData {
  sections: HomepageBrandSection[];
  brands: string[];
  products: HomepageBrandProductOption[];
}
