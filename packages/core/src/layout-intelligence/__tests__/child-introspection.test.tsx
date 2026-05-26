import * as React from 'react';
import { View } from 'react-native';

import {
  countByTag,
  describeChildren,
  findFirstByTag,
  flattenChildren,
} from '../child-introspection';
import { tagComponent } from '../tagged-component';

const Btn = tagComponent(function Btn(): React.ReactElement {
  return <View />;
}, 'Button');
const Hdr = tagComponent(function Hdr(): React.ReactElement {
  return <View />;
}, 'Heading');
const Txt = tagComponent(function Txt(): React.ReactElement {
  return <View />;
}, 'Text');

describe('flattenChildren', () => {
  it('drops null / undefined / boolean / strings / numbers', () => {
    const out = flattenChildren([null, undefined, false, true, 'hi', 42, <View key="v" />]);
    expect(out).toHaveLength(1);
  });

  it('flattens fragments', () => {
    const out = flattenChildren(
      <>
        <Btn />
        <>
          <Hdr />
          <Txt />
        </>
      </>,
    );
    expect(out).toHaveLength(3);
  });

  it('flattens nested arrays', () => {
    const out = flattenChildren([[<Btn key="a" />, [<Hdr key="b" />, <Txt key="c" />]]]);
    expect(out).toHaveLength(3);
  });
});

describe('describeChildren', () => {
  it('marks isFirst and isLast correctly', () => {
    const slots = describeChildren([<Btn key="a" />, <Btn key="b" />, <Btn key="c" />]);
    expect(slots.map((s) => s.isFirst)).toEqual([true, false, false]);
    expect(slots.map((s) => s.isLast)).toEqual([false, false, true]);
  });

  it("attaches each child's tag", () => {
    const slots = describeChildren([<Btn key="a" />, <Hdr key="b" />, <View key="c" />]);
    expect(slots.map((s) => s.tag)).toEqual(['Button', 'Heading', undefined]);
  });
});

describe('findFirstByTag / countByTag', () => {
  it('finds first by tag', () => {
    const found = findFirstByTag([<View key="v" />, <Btn key="a" />, <Btn key="b" />], 'Button');
    expect(found).toBeDefined();
  });

  it('returns undefined when no match', () => {
    expect(findFirstByTag([<View key="v" />], 'Button')).toBeUndefined();
  });

  it('counts by tag', () => {
    const counts = countByTag([
      <Btn key="a" />,
      <Btn key="b" />,
      <Hdr key="c" />,
      <View key="d" />,
    ]);
    expect(counts['Button']).toBe(2);
    expect(counts['Heading']).toBe(1);
    expect(counts['__untagged__']).toBe(1);
  });
});
