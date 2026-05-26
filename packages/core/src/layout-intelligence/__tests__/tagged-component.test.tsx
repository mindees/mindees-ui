import * as React from 'react';
import { Text, View } from 'react-native';

import {
  COMPONENT_TAG,
  getComponentTag,
  isTaggedAs,
  tagComponent,
} from '../tagged-component';

const Btn = tagComponent(function Btn(): React.ReactElement {
  return <View />;
}, 'Button');

const Hdr = tagComponent(function Hdr(): React.ReactElement {
  return <Text />;
}, 'Heading');

describe('tagged-component', () => {
  it('stamps the COMPONENT_TAG symbol on the component', () => {
    expect((Btn as unknown as Record<symbol, unknown>)[COMPONENT_TAG]).toBe('Button');
  });

  it('reads the tag back from an element', () => {
    expect(getComponentTag(<Btn />)).toBe('Button');
    expect(getComponentTag(<Hdr />)).toBe('Heading');
  });

  it('returns undefined for untagged or non-element values', () => {
    expect(getComponentTag(<View />)).toBeUndefined();
    expect(getComponentTag(null)).toBeUndefined();
    expect(getComponentTag(undefined)).toBeUndefined();
  });

  it('matches across tag list with isTaggedAs', () => {
    expect(isTaggedAs(<Btn />, 'Button')).toBe(true);
    expect(isTaggedAs(<Btn />, 'Heading', 'Text')).toBe(false);
    expect(isTaggedAs(<Btn />, 'Heading', 'Button')).toBe(true);
    expect(isTaggedAs(<View />, 'Button')).toBe(false);
  });

  it('uses Symbol.for so tags survive across realms', () => {
    expect(COMPONENT_TAG).toBe(Symbol.for('@mindees/ui:component-tag'));
  });
});
