import {
  createTheme,
  createThemes,
  darkTheme,
  highContrastDarkTheme,
  highContrastLightTheme,
  lightTheme,
} from '../createTheme';

describe('createTheme', () => {
  it('exposes the light theme with light semantic colors', () => {
    expect(lightTheme.colorScheme).toBe('light');
    expect(lightTheme.contrast).toBe('normal');
    expect(lightTheme.density).toBe('comfortable');
    expect(lightTheme.tokens.colors.background.canvas).toMatch(/^#/);
  });

  it('exposes the dark theme with dark semantic colors', () => {
    expect(darkTheme.colorScheme).toBe('dark');
    expect(darkTheme.tokens.colors.background.canvas).not.toBe(
      lightTheme.tokens.colors.background.canvas,
    );
  });

  it('returns high-contrast variants with stronger text contrast', () => {
    expect(highContrastLightTheme.tokens.colors.text.primary).toBe('#000000');
    expect(highContrastDarkTheme.tokens.colors.text.primary).toBe('#ffffff');
  });

  it('merges user color overrides without mutating the base', () => {
    const before = lightTheme.tokens.colors.action.primary;
    const t = createTheme({
      name: 'brand',
      colorScheme: 'light',
      colors: { action: { primary: '#ff00aa' } as never },
    });
    expect(t.tokens.colors.action.primary).toBe('#ff00aa');
    expect(t.tokens.colors.action.primaryHover).toBe(lightTheme.tokens.colors.action.primaryHover);
    // base theme unchanged
    expect(lightTheme.tokens.colors.action.primary).toBe(before);
  });

  it('exposes the full token surface', () => {
    expect(lightTheme.tokens.space.md).toBe(16);
    expect(lightTheme.tokens.radii.md).toBe(8);
    expect(lightTheme.tokens.shadows.md.elevation).toBeGreaterThan(0);
    expect(lightTheme.tokens.textStyles.h1.weight).toBe('700');
    expect(lightTheme.tokens.duration.base).toBe(220);
    expect(lightTheme.tokens.breakpoints.md).toBeGreaterThan(0);
    expect(lightTheme.tokens.zIndex.modal).toBeGreaterThan(lightTheme.tokens.zIndex.dropdown);
  });

  it('scales the spacing rhythm by density', () => {
    const compact = createTheme({ name: 'c', colorScheme: 'light', density: 'compact' });
    const spacious = createTheme({ name: 's', colorScheme: 'light', density: 'spacious' });
    expect(compact.tokens.space.md).toBeLessThan(lightTheme.tokens.space.md);
    expect(spacious.tokens.space.md).toBeGreaterThan(lightTheme.tokens.space.md);
    expect(compact.tokens.space.none).toBe(0);
  });

  it('merges non-color token overrides too', () => {
    const t = createTheme({ name: 'r', colorScheme: 'light', radii: { md: 99 } });
    expect(t.tokens.radii.md).toBe(99);
    expect(t.tokens.radii.sm).toBe(lightTheme.tokens.radii.sm);
  });
});

describe('createThemes (brand generator)', () => {
  const { light, dark } = createThemes({
    name: 'acme',
    light: { brand: '#6d28d9' },
    dark: { brand: '#a78bfa' },
  });

  it('returns a matched light + dark pair', () => {
    expect(light.colorScheme).toBe('light');
    expect(dark.colorScheme).toBe('dark');
  });

  it('drives the accent slots from the brand color', () => {
    expect(light.tokens.colors.action.primary).toBe('#6d28d9');
    expect(dark.tokens.colors.action.primary).toBe('#a78bfa');
    expect(light.tokens.colors.text.link).toBe('#6d28d9');
    expect(light.tokens.colors.border.focus).toBe('#6d28d9');
  });

  it('derives a readable on-accent text color', () => {
    expect(['#1a1a1a', '#ffffff']).toContain(light.tokens.colors.text.onAccent);
  });

  it('derives distinct hover/active shades from the brand', () => {
    const { primary, primaryHover, primaryActive } = light.tokens.colors.action;
    expect(primaryHover).not.toBe(primary);
    expect(primaryActive).not.toBe(primaryHover);
  });
});
