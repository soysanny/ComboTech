import type { HomepageBrandSection } from "./types";

export const HOMEPAGE_BRAND_SECTIONS_COLLECTION = "homepageBrandSections";

export const DEFAULT_HOMEPAGE_BRANDS = [
  "ASUS",
  "MSI",
  "ACER",
  "APPLE",
  "DELL",
  "LENOVO",
  "RAZER",
  "HP",
] as const;

export const DEFAULT_PRODUCT_LIMIT = 4;
export const MIN_PRODUCT_LIMIT = 1;
export const MAX_PRODUCT_LIMIT = 12;

/** Sections used until an administrator saves a custom configuration. */
export const DEFAULT_HOMEPAGE_BRAND_SECTIONS: HomepageBrandSection[] =
  DEFAULT_HOMEPAGE_BRANDS.map((brand, index) => ({
    id: `brand-${brand.toLowerCase()}`,
    brand,
    enabled: true,
    order: index,
    productLimit: DEFAULT_PRODUCT_LIMIT,
    selectionMode: "auto",
    productIds: [],
  }));
