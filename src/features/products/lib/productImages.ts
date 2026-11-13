import type { Product } from "../types";

/** The shared catalog placeholder is treated as "no image available". */
export function isPlaceholderImage(src?: string): boolean {
  return !src || /(^|\/)placeholder\.(svg|png|jpe?g|webp)$/i.test(src);
}

/**
 * Pick the first usable image for a product. A real image in the gallery is
 * preferred over the shared placeholder, and no unrelated image is invented.
 */
export function getProductImageSrc(
  product: Pick<Product, "thumbnail" | "images">,
): string | null {
  const candidates = [product.thumbnail, ...(product.images ?? [])];
  return candidates.find((src) => src && !isPlaceholderImage(src)) ?? null;
}
