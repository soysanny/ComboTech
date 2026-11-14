/**
 * Session-scoped handoff between a product list and a product detail page.
 *
 * When a product is opened from a list we remember the exact list URL and
 * scroll offset. The list can then restore that position on return, while a
 * direct visit to a detail page simply starts the catalog at the top.
 */
const RETURN_TARGET_KEY = "cambotech:catalog-return-target";
const RETURN_TARGET_TTL_MS = 30 * 60 * 1000;

export interface CatalogReturnTarget {
  productId: string;
  /** Path and query of the list the product was opened from. */
  listHref: string;
  /** Window scroll offset at the moment the product was opened. */
  scrollY: number;
  savedAt: number;
}

export function getCurrentListHref(): string {
  return `${window.location.pathname}${window.location.search}`;
}

export function recordCatalogReturnTarget(productId: string): void {
  if (typeof window === "undefined") return;
  try {
    const target: CatalogReturnTarget = {
      productId,
      listHref: getCurrentListHref(),
      scrollY: window.scrollY,
      savedAt: Date.now(),
    };
    window.sessionStorage.setItem(RETURN_TARGET_KEY, JSON.stringify(target));
  } catch {
    // Storage may be unavailable (private mode, quota); navigation still works.
  }
}

export function readCatalogReturnTarget(): CatalogReturnTarget | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(RETURN_TARGET_KEY);
    if (!raw) return null;

    const target = JSON.parse(raw) as Partial<CatalogReturnTarget>;
    const isValid =
      typeof target.productId === "string" &&
      typeof target.listHref === "string" &&
      typeof target.scrollY === "number" &&
      Number.isFinite(target.scrollY) &&
      typeof target.savedAt === "number" &&
      Number.isFinite(target.savedAt);

    if (!isValid) {
      clearCatalogReturnTarget();
      return null;
    }

    if (Date.now() - target.savedAt! > RETURN_TARGET_TTL_MS) {
      clearCatalogReturnTarget();
      return null;
    }

    return target as CatalogReturnTarget;
  } catch {
    return null;
  }
}

export function clearCatalogReturnTarget(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(RETURN_TARGET_KEY);
  } catch {
    // Ignore storage failures.
  }
}
