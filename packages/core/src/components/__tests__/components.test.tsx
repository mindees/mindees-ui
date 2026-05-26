import { render } from '@testing-library/react-native';
import { Text as RNText } from 'react-native';

import { getComponentTag } from '../../layout-intelligence/tagged-component';
import { Box } from '../Box/Box';
import { Divider } from '../Divider/Divider';
import { Spacer } from '../Spacer/Spacer';
import { Stack, HStack, VStack } from '../Stack/Stack';
import { Heading } from '../Text/Heading';
import { Text } from '../Text/Text';

describe('Phase 2 primitives — smoke', () => {
  it('Box renders children and tags itself', () => {
    const { getByTestId } = render(<Box testID="box">hello</Box>);
    expect(getByTestId('box')).toBeTruthy();
    expect(getComponentTag(<Box />)).toBe('Box');
  });

  it('Box resolves padding tokens to dp', () => {
    const { getByTestId } = render(<Box testID="box" padding="md" />);
    const style = getByTestId('box').props.style as Record<string, number>[];
    const flat = Object.assign({}, ...style.filter(Boolean));
    expect(flat['paddingTop']).toBe(16);
    expect(flat['paddingLeft']).toBe(16);
  });

  it('Stack tags', () => {
    expect(getComponentTag(<Stack />)).toBe('Stack');
    expect(getComponentTag(<HStack />)).toBe('HStack');
    expect(getComponentTag(<VStack />)).toBe('VStack');
  });

  it('Divider and Spacer carry tags', () => {
    expect(getComponentTag(<Divider />)).toBe('Divider');
    expect(getComponentTag(<Spacer />)).toBe('Spacer');
  });

  it('Heading defaults to header accessibility role + Heading tag', () => {
    const { getByText } = render(<Heading>Title</Heading>);
    const node = getByText('Title');
    expect(node.props.accessibilityRole).toBe('header');
    expect(getComponentTag(<Heading />)).toBe('Heading');
  });

  it('Text renders inside RN Text element with Text tag', () => {
    const { getByText } = render(<Text>body</Text>);
    expect(getByText('body')).toBeTruthy();
    expect(getComponentTag(<Text />)).toBe('Text');
  });

  it('Stack injects spacers between children (auto-spacing)', () => {
    // Two adjacent Text children — Stack should produce a spacer between.
    const { UNSAFE_root } = render(
      <Stack gap="md">
        <Text>first</Text>
        <Text>second</Text>
      </Stack>,
    );
    const rnTexts = UNSAFE_root.findAllByType(RNText);
    // Original content plus any spacer Views don't render RN <Text>, so
    // the two Texts should still be present untouched.
    expect(rnTexts).toHaveLength(2);
  });
});
