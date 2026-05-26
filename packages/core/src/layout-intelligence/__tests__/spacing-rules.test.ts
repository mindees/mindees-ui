import { resolveGapRule, resolveGapToken } from '../spacing-rules';

describe('resolveGapRule', () => {
  it('returns tighter for Heading→Caption (eyebrow group)', () => {
    expect(resolveGapRule('Heading', 'Caption')).toBe('tighter');
  });

  it('returns tighter for Caption→Heading (eyebrow over heading)', () => {
    expect(resolveGapRule('Caption', 'Heading')).toBe('tighter');
  });

  it('returns loose for Heading→Text (strong hierarchy)', () => {
    expect(resolveGapRule('Heading', 'Text')).toBe('loose');
  });

  it('returns tight for Text→Text (continuous prose)', () => {
    expect(resolveGapRule('Text', 'Text')).toBe('tight');
  });

  it('returns loose for content→Button (trailing action row)', () => {
    expect(resolveGapRule('Text', 'Button')).toBe('loose');
    expect(resolveGapRule('Heading', 'Button')).toBe('loose');
  });

  it('returns base for unknown / unrelated combinations', () => {
    expect(resolveGapRule(undefined, undefined)).toBe('base');
    expect(resolveGapRule('Card', 'Card')).toBe('base');
  });
});

describe('resolveGapToken', () => {
  it('scales a token by the rule multiplier', () => {
    expect(resolveGapToken('md', 'base')).toBe(16);
    expect(resolveGapToken('md', 'tighter')).toBe(4);
    expect(resolveGapToken('md', 'tight')).toBe(8);
    expect(resolveGapToken('md', 'loose')).toBe(24);
    expect(resolveGapToken('md', 'looser')).toBe(32);
  });

  it('accepts a raw number as the base', () => {
    expect(resolveGapToken(20, 'tight')).toBe(10);
    expect(resolveGapToken(20, 'loose')).toBe(30);
  });
});
