import {
  createTheme,
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
});
