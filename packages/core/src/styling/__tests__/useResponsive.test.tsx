import { resolveResponsive } from '../useResponsive';

// `resolveResponsive` is a pure function — no RN render needed, no jest mocks
// of `react-native` (which would trip the TurboModuleRegistry / NativeDevMenu
// chain on RN 0.85). The hook variant just calls `useWindowDimensions()`
// and forwards to this, so the function tests are the load-bearing ones.

describe('resolveResponsive', () => {
  it('returns a scalar string unchanged at any width', () => {
    expect(resolveResponsive('sm', 1000)).toBe('sm');
    expect(resolveResponsive('sm', 100)).toBe('sm');
  });

  it('returns a scalar number unchanged', () => {
    expect(resolveResponsive(16, 1000)).toBe(16);
  });

  it('returns the value at the largest matching breakpoint', () => {
    // breakpoints: xs=0, sm=360, md=600, lg=900, xl=1200, 2xl=1536
    expect(resolveResponsive({ xs: 'sm', md: 'lg', xl: '2xl' }, 700)).toBe('lg');
    expect(resolveResponsive({ xs: 'sm', md: 'lg', xl: '2xl' }, 1300)).toBe('2xl');
  });

  it('falls back to the xs value below all breakpoints', () => {
    expect(resolveResponsive({ xs: 'sm', md: 'lg' }, 200)).toBe('sm');
  });

  it('returns undefined when no breakpoint matches', () => {
    expect(resolveResponsive({ md: 'lg', xl: '2xl' }, 100)).toBeUndefined();
  });

  it('treats arrays as scalar values (returns them unchanged)', () => {
    expect(resolveResponsive([1, 2, 3] as never, 1000)).toEqual([1, 2, 3]);
  });

  it('treats objects without breakpoint keys as scalar values', () => {
    const obj = { width: 100 };
    expect(resolveResponsive(obj as never, 1000)).toBe(obj);
  });

  it('handles every named breakpoint correctly', () => {
    const map = { xs: 'XS', sm: 'SM', md: 'MD', lg: 'LG', xl: 'XL', '2xl': '2XL' };
    expect(resolveResponsive(map, 0)).toBe('XS');
    expect(resolveResponsive(map, 360)).toBe('SM');
    expect(resolveResponsive(map, 600)).toBe('MD');
    expect(resolveResponsive(map, 900)).toBe('LG');
    expect(resolveResponsive(map, 1200)).toBe('XL');
    expect(resolveResponsive(map, 1536)).toBe('2XL');
  });
});
