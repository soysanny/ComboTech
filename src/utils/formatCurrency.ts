const DEFAULT_CURRENCY = "USD";
const DEFAULT_LOCALE = "en-US";

/**
 * Format a numeric amount as a localized currency string.
 * Defaults to USD, which is used for CAMBOTECH pricing.
 */
export function formatCurrency(
  amount: number,
  currency: string = DEFAULT_CURRENCY,
  locale: string = DEFAULT_LOCALE,
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
