import { ThemeProvider } from '@mindees/ui';
import { render } from '@testing-library/react-native';
import * as React from 'react';

import {
  AddToCartButton,
  AddressForm,
  CartItem,
  CartSummary,
  CheckoutForm,
  CouponInput,
  DiscountBadge,
  OrderStatus,
  OrderSummary,
  PriceDisplay,
  ProductCard,
  ProductDetails,
  ProductGrid,
  QuantityStepper,
  ReviewsList,
  type CartLineItem,
  type OrderLineItem,
  type Product,
  type Review,
  type SummaryLine,
} from '../index';

// Stable noop avoids eslint's empty-function rule firing for inline arrows.
const noop = (): void => undefined;

function renderWithTheme(ui: React.ReactElement): ReturnType<typeof render> {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const product: Product = {
  id: 'p1',
  title: 'Aurora Wireless Headphones',
  price: 199.99,
  compareAt: 249.99,
  image: 'https://example.com/headphones.jpg',
  images: ['https://example.com/a.jpg', 'https://example.com/b.jpg'],
  description: 'Over-ear headphones with adaptive noise cancellation.',
  rating: 4,
  ratingCount: 128,
  badge: 'Bestseller',
  currency: 'USD',
};

const products: Product[] = [
  product,
  { id: 'p2', title: 'Mini Speaker', price: 49, rating: 5, ratingCount: 12 },
  { id: 'p3', title: 'USB-C Cable', price: 9.99 },
];

const reviews: Review[] = [
  { id: 'r1', author: 'Jordan P.', rating: 5, text: 'Fantastic sound.', date: 'May 2026' },
  { id: 'r2', author: 'Sam K.', rating: 4 },
];

const cartItem: CartLineItem = {
  id: 'c1',
  title: 'Aurora Wireless Headphones',
  price: 199.99,
  quantity: 2,
  image: 'https://example.com/headphones.jpg',
  variant: 'Black',
  currency: 'USD',
};

const summaryLines: SummaryLine[] = [
  { label: 'Subtotal', value: 399.98 },
  { label: 'Shipping', value: 'Free' },
  { label: 'Tax', value: 32.0 },
  { label: 'Savings', value: -50, emphasis: true },
];

const orderItems: OrderLineItem[] = [
  { id: 'o1', title: 'Aurora Wireless Headphones', price: 199.99, quantity: 2 },
  { id: 'o2', title: 'USB-C Cable', price: 9.99, quantity: 1 },
];

describe('commerce blocks — render without throwing', () => {
  it('renders PriceDisplay (with discount)', () => {
    expect(() =>
      renderWithTheme(<PriceDisplay price={199.99} compareAt={249.99} currency="USD" />),
    ).not.toThrow();
  });

  it('renders PriceDisplay (no compare-at)', () => {
    expect(() => renderWithTheme(<PriceDisplay price={9.99} />)).not.toThrow();
  });

  it('renders DiscountBadge (percent and label)', () => {
    expect(() => renderWithTheme(<DiscountBadge percent={20} />)).not.toThrow();
    expect(() => renderWithTheme(<DiscountBadge label="SALE" tone="warning" />)).not.toThrow();
  });

  it('renders QuantityStepper', () => {
    expect(() => renderWithTheme(<QuantityStepper value={1} onChange={noop} />)).not.toThrow();
  });

  it('renders AddToCartButton (plain, loading, in-cart, with quantity)', () => {
    expect(() => renderWithTheme(<AddToCartButton onAdd={noop} />)).not.toThrow();
    expect(() => renderWithTheme(<AddToCartButton onAdd={noop} loading />)).not.toThrow();
    expect(() => renderWithTheme(<AddToCartButton onAdd={noop} inCart />)).not.toThrow();
    expect(() => renderWithTheme(<AddToCartButton onAdd={noop} showQuantity />)).not.toThrow();
  });

  it('renders ProductCard', () => {
    expect(() =>
      renderWithTheme(<ProductCard product={product} onAddToCart={noop} onPress={noop} />),
    ).not.toThrow();
  });

  it('renders ProductCard (minimal product)', () => {
    expect(() =>
      renderWithTheme(<ProductCard product={{ title: 'Plain', price: 5 }} />),
    ).not.toThrow();
  });

  it('renders ProductGrid', () => {
    expect(() =>
      renderWithTheme(
        <ProductGrid products={products} numColumns={2} onPressProduct={noop} onAddToCart={noop} />,
      ),
    ).not.toThrow();
  });

  it('renders ProductGrid (single column)', () => {
    expect(() => renderWithTheme(<ProductGrid products={products} numColumns={1} />)).not.toThrow();
  });

  it('renders ProductDetails', () => {
    expect(() =>
      renderWithTheme(<ProductDetails product={product} onAddToCart={noop} />),
    ).not.toThrow();
  });

  it('renders ProductDetails (single image, loading)', () => {
    expect(() =>
      renderWithTheme(
        <ProductDetails product={{ title: 'Plain', price: 5, image: 'x' }} addingToCart />,
      ),
    ).not.toThrow();
  });

  it('renders ReviewsList', () => {
    expect(() => renderWithTheme(<ReviewsList reviews={reviews} title="Reviews" />)).not.toThrow();
  });

  it('renders ReviewsList (empty)', () => {
    expect(() => renderWithTheme(<ReviewsList reviews={[]} />)).not.toThrow();
  });

  it('renders CartItem', () => {
    expect(() =>
      renderWithTheme(<CartItem item={cartItem} onChangeQty={noop} onRemove={noop} />),
    ).not.toThrow();
  });

  it('renders CartItem (read-only)', () => {
    expect(() => renderWithTheme(<CartItem item={cartItem} />)).not.toThrow();
  });

  it('renders CartSummary', () => {
    expect(() =>
      renderWithTheme(<CartSummary lines={summaryLines} total={381.98} onCheckout={noop} />),
    ).not.toThrow();
  });

  it('renders CartSummary (no checkout)', () => {
    expect(() =>
      renderWithTheme(<CartSummary lines={summaryLines} total={381.98} />),
    ).not.toThrow();
  });

  it('renders CheckoutForm', () => {
    expect(() => renderWithTheme(<CheckoutForm onSubmit={noop} />)).not.toThrow();
  });

  it('renders CheckoutForm (error + loading)', () => {
    expect(() =>
      renderWithTheme(<CheckoutForm onSubmit={noop} error="Payment failed" loading />),
    ).not.toThrow();
  });

  it('renders AddressForm (controlled)', () => {
    expect(() =>
      renderWithTheme(
        <AddressForm value={{ name: 'Jane', city: 'SF' }} onChange={noop} onSubmit={noop} />,
      ),
    ).not.toThrow();
  });

  it('renders AddressForm (uncontrolled, with errors)', () => {
    expect(() => renderWithTheme(<AddressForm errors={{ zip: 'Invalid ZIP' }} />)).not.toThrow();
  });

  it('renders OrderSummary', () => {
    expect(() =>
      renderWithTheme(
        <OrderSummary items={orderItems} total={409.97} lines={summaryLines} title="Order" />,
      ),
    ).not.toThrow();
  });

  it('renders OrderStatus (each status)', () => {
    expect(() => renderWithTheme(<OrderStatus status="placed" />)).not.toThrow();
    expect(() =>
      renderWithTheme(<OrderStatus status="shipped" orientation="vertical" />),
    ).not.toThrow();
    expect(() => renderWithTheme(<OrderStatus status="delivered" />)).not.toThrow();
    expect(() => renderWithTheme(<OrderStatus status="cancelled" />)).not.toThrow();
  });

  it('renders CouponInput (empty, applied, error)', () => {
    expect(() => renderWithTheme(<CouponInput onApply={noop} />)).not.toThrow();
    expect(() =>
      renderWithTheme(<CouponInput onApply={noop} applied="SAVE20" onRemove={noop} />),
    ).not.toThrow();
    expect(() =>
      renderWithTheme(<CouponInput onApply={noop} error="Expired code" />),
    ).not.toThrow();
  });
});
