// Shared data shapes for commerce blocks. These are intentionally minimal and
// UI-focused — blocks never fetch or mutate; callers map their domain models
// onto these structures and pass everything through props.

/** A product summary as displayed in cards, grids, and detail screens. */
export interface Product {
  /** Stable identifier. Used as the list key in grids. */
  readonly id?: string;
  readonly title: string;
  /** Current selling price. */
  readonly price: number;
  /** Original / compare-at price, when on sale. */
  readonly compareAt?: number;
  /** Primary image URL. */
  readonly image?: string;
  /** Additional image URLs (e.g. a detail gallery). */
  readonly images?: readonly string[];
  /** Long-form description for detail screens. */
  readonly description?: string;
  /** Average rating, 0–5. */
  readonly rating?: number;
  /** Number of ratings, shown beside the stars. */
  readonly ratingCount?: number;
  /** Short corner badge (e.g. "New", "Bestseller"). */
  readonly badge?: string;
  /** ISO 4217 currency code. Defaults handled by the block. */
  readonly currency?: string;
}

/** A single product review. */
export interface Review {
  readonly id?: string;
  readonly author: string;
  /** Avatar image URL. Falls back to initials. */
  readonly avatar?: string;
  /** Star rating, 0–5. */
  readonly rating: number;
  readonly text?: string;
  /** Pre-formatted date string (blocks never localize dates for you). */
  readonly date?: string;
}

/** A line item in a cart. */
export interface CartLineItem {
  readonly id: string;
  readonly title: string;
  readonly price: number;
  readonly quantity: number;
  readonly image?: string;
  /** Short variant descriptor (e.g. "Size M / Blue"). */
  readonly variant?: string;
  readonly currency?: string;
}

/** A read-only summary line (label + formatted-or-numeric value). */
export interface SummaryLine {
  readonly label: string;
  /** Numeric amount (formatted by the block) or a pre-formatted string. */
  readonly value: number | string;
  /** Emphasize this line (e.g. a savings row). */
  readonly emphasis?: boolean;
}

/** A line item in an order summary. */
export interface OrderLineItem {
  readonly id?: string;
  readonly title: string;
  readonly price: number;
  readonly quantity: number;
  readonly currency?: string;
}

/** Lifecycle status of an order. */
export type OrderStatusValue = 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
