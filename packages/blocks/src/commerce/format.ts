// Internal currency formatting helpers shared across commerce blocks.
// Pure, allocation-light, and deterministic so blocks can format prices
// consistently without each pulling in its own `Intl.NumberFormat` config.

/**
 * Formats a numeric amount as a localized currency string.
 *
 * Uses `Intl.NumberFormat` when available (React Native 0.83+ ships the full
 * ECMA-402 surface on Hermes). Falls back to a fixed-2 decimal string with the
 * currency code prefixed so a missing Intl polyfill never throws.
 */
export function formatCurrency(amount: number, currency = 'USD', locale?: string): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

/**
 * Computes the integer discount percentage between an original (compare-at)
 * price and the current price. Returns `0` when there is no positive discount
 * or the inputs are invalid, so callers can hide the badge with a falsy check.
 */
export function discountPercent(price: number, compareAt: number): number {
  if (!Number.isFinite(price) || !Number.isFinite(compareAt)) return 0;
  if (compareAt <= 0 || price >= compareAt) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}
