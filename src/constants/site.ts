import { ROUTES } from "./routes";
import type { ProductCategorySlug } from "@/features/products/types";

/** Store-wide contact and identity details (CC Computer style). */
export const SITE = {
  name: "CamboTech",
  tagline: "Laptop & PC Store, Phnom Penh",
  description:
    "Laptops, desktops, PC parts, storage, and peripherals from ASUS, Dell, Acer, Lenovo, Apple and more — new, used, and built to order.",
  phoneDisplay: "060 670 968",
  phoneHref: "tel:060670968",
  email: "cambotexkh@gmail.com",
  address:
    "No. 88, St. 468 (near Toul Tom Poung Market), Chamkarmon, Phnom Penh",
  ticker:
    "CAMBOTECH — Premium laptops, desktops, PC parts & accessories | Trusted technology partner, high quality products, after-sales support : 060 670 968",
} as const;

export interface SocialLink {
  key: "facebook" | "telegram" | "whatsapp" | "tiktok";
  label: string;
  href: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  { key: "facebook", label: "Facebook", href: "https://www.facebook.com/share/1J9WsCgayN/" },
  { key: "telegram", label: "Telegram", href: "https://t.me/cambotech_kh" },
  { key: "whatsapp", label: "WhatsApp: +855 60 670 968", href: "https://wa.me/85560670968" },
  { key: "tiktok", label: "TikTok", href: "https://www.tiktok.com/@cccomputer" },
];

export interface CategoryNavItem {
  slug: ProductCategorySlug;
  label: string;
}

/** Primary category navigation, mirroring CC Computer's storefront menu. */
export const CATEGORY_NAV: CategoryNavItem[] = [
  { slug: "laptops", label: "Laptops" },
  { slug: "desktops", label: "Desktops" },
  { slug: "pc-components", label: "PC Parts" },
  { slug: "used", label: "Used Computers" },
  { slug: "peripherals", label: "Peripherals" },
  { slug: "storage", label: "Storage" },
  { slug: "network", label: "Network" },
  { slug: "speakers", label: "Speakers" },
  { slug: "printers", label: "Printers" },
  { slug: "accessories", label: "Accessories" },
];

export interface BrandNavItem {
  label: string;
  /** Brand filter value. */
  brand?: string;
  /** Series filter value (for sub-brand lines like ROG / Legion). */
  series?: string;
}

/** Brand / series shortcut bar, mirroring CC Computer's brand navigation. */
export const BRAND_NAV: BrandNavItem[] = [
  { label: "ASUS", brand: "ASUS" },
  { label: "TUF", series: "TUF" },
  { label: "ROG", series: "ROG" },
  { label: "MSI", brand: "MSI" },
  { label: "ACER", brand: "ACER" },
  { label: "APPLE", brand: "APPLE" },
  { label: "DELL", brand: "DELL" },
  { label: "ALIENWARE", series: "Alienware" },
  { label: "LENOVO", brand: "LENOVO" },
  { label: "LEGION", series: "Legion" },
  { label: "PREDATOR", series: "Predator" },
  { label: "RAZER", brand: "RAZER" },
  { label: "HP", brand: "HP" },
];

/** Build a catalog URL for a brand / series shortcut. */
export function brandNavHref(item: BrandNavItem): string {
  const params = new URLSearchParams();
  if (item.brand) params.set("brands", item.brand);
  if (item.series) params.set("series", item.series);
  const query = params.toString();
  return query ? `${ROUTES.products}?${query}` : ROUTES.products;
}

export const PAYMENT_METHODS = [
  { label: "ABA", title: "ABA PAY" },
  { label: "ACLEDA", title: "ACLEDA Bank" },
  { label: "KHQR", title: "KHQR" },
  { label: "VISA", title: "VISA" },
] as const;
