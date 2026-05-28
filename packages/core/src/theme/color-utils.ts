// Tiny, dependency-free color math used by the brand-theme generator. Just
// enough to derive hover/active shades and a readable on-accent text color
// from a single brand hex — no full color library needed.

interface Rgb {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

function clamp(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)));
}

/** Parse `#rgb` or `#rrggbb` (with or without leading `#`). Falls back to black on bad input. */
export function parseHex(hex: string): Rgb {
  let h = hex.trim().replace(/^#/, '');
  if (h.length === 3) {
    h = h.charAt(0).repeat(2) + h.charAt(1).repeat(2) + h.charAt(2).repeat(2);
  }
  if (h.length !== 6 || /[^0-9a-fA-F]/.test(h)) {
    return { r: 0, g: 0, b: 0 };
  }
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function toHex({ r, g, b }: Rgb): string {
  const h = (n: number) => clamp(n).toString(16).padStart(2, '0');
  return `#${h(r)}${h(g)}${h(b)}`;
}

/** Linearly mix `color` toward `target` by `amount` (0 = color, 1 = target). */
export function mix(color: string, target: string, amount: number): string {
  const a = parseHex(color);
  const b = parseHex(target);
  const t = Math.max(0, Math.min(1, amount));
  return toHex({
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
  });
}

/** Darken toward black. */
export const darken = (color: string, amount: number): string => mix(color, '#000000', amount);
/** Lighten toward white. */
export const lighten = (color: string, amount: number): string => mix(color, '#ffffff', amount);

/** WCAG relative luminance (0 = black, 1 = white). */
export function luminance(hex: string): number {
  const { r, g, b } = parseHex(hex);
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** Returns a near-black or white text color that reads legibly on `bg`. */
export function readableTextOn(bg: string): string {
  return luminance(bg) > 0.45 ? '#1a1a1a' : '#ffffff';
}
