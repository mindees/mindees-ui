import { resolveSizeProps, resolveSizeToStyle } from '../sizing';

describe('resolveSizeToStyle', () => {
  it('maps `fill` to flex-1', () => {
    expect(resolveSizeToStyle('fill', 'width')).toEqual({
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0,
    });
    expect(resolveSizeToStyle('fill', 'height')).toEqual({
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0,
    });
  });

  it('maps `hug` to flexShrink: 0 with no dimension', () => {
    expect(resolveSizeToStyle('hug', 'width')).toEqual({ flexShrink: 0 });
    expect(resolveSizeToStyle('hug', 'height')).toEqual({ flexShrink: 0 });
  });

  it('maps numeric size onto the requested axis only', () => {
    expect(resolveSizeToStyle(120, 'width')).toEqual({ width: 120 });
    expect(resolveSizeToStyle(120, 'height')).toEqual({ height: 120 });
  });

  it('maps percentage size onto the requested axis only', () => {
    expect(resolveSizeToStyle('50%', 'width')).toEqual({ width: '50%' });
    expect(resolveSizeToStyle('50%', 'height')).toEqual({ height: '50%' });
  });

  it('returns an empty object for undefined size', () => {
    expect(resolveSizeToStyle(undefined, 'width')).toEqual({});
  });
});

describe('resolveSizeProps', () => {
  it('combines width and height resolutions', () => {
    const out = resolveSizeProps({ width: 'fill', height: 100 });
    expect(out).toMatchObject({ flexGrow: 1, flexShrink: 1, flexBasis: 0, height: 100 });
  });

  it('passes through min/max constraints', () => {
    const out = resolveSizeProps({
      minWidth: 10,
      maxWidth: '100%',
      minHeight: 20,
      maxHeight: 300,
    });
    expect(out).toMatchObject({
      minWidth: 10,
      maxWidth: '100%',
      minHeight: 20,
      maxHeight: 300,
    });
  });
});
