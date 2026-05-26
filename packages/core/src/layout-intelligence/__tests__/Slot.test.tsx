import { render, fireEvent } from '@testing-library/react-native';
import * as React from 'react';
import { Pressable, Text, View } from 'react-native';

import { Slot } from '../Slot';

describe('Slot', () => {
  it('renders its single child and merges props onto it', () => {
    const { getByText } = render(
      <Slot accessibilityLabel="parent-label" accessibilityRole="button">
        <Text accessibilityLabel="child-label">hi</Text>
      </Slot>,
    );
    const t = getByText('hi');
    // child explicit prop wins over parent default
    expect(t.props.accessibilityLabel).toBe('child-label');
    // parent prop survives where child doesn't set it
    expect(t.props.accessibilityRole).toBe('button');
  });

  it('chains event handlers (child first, then parent)', () => {
    const order: string[] = [];
    const onPressParent = jest.fn(() => order.push('parent'));
    const onPressChild = jest.fn(() => order.push('child'));
    const { getByTestId } = render(
      <Slot onPress={onPressParent}>
        <Pressable testID="p" onPress={onPressChild}>
          <Text>tap</Text>
        </Pressable>
      </Slot>,
    );
    fireEvent.press(getByTestId('p'));
    expect(onPressChild).toHaveBeenCalledTimes(1);
    expect(onPressParent).toHaveBeenCalledTimes(1);
    expect(order).toEqual(['child', 'parent']);
  });

  it('respects defaultPrevented from the child handler', () => {
    const onPressParent = jest.fn();
    const onPressChild = jest.fn((evt: { defaultPrevented?: boolean }) => {
      evt.defaultPrevented = true;
    });
    const { getByTestId } = render(
      <Slot onPress={onPressParent}>
        <Pressable testID="p" onPress={onPressChild}>
          <Text>tap</Text>
        </Pressable>
      </Slot>,
    );
    // RN's fireEvent.press dispatches handlers without an event arg by default;
    // pass an explicit event-like object so the child's `defaultPrevented`
    // signal has somewhere to land. Documented as a web-DOM-style escape
    // hatch — RN press handlers don't get a preventDefault by default.
    fireEvent.press(getByTestId('p'), { defaultPrevented: false });
    expect(onPressChild).toHaveBeenCalledTimes(1);
    expect(onPressParent).not.toHaveBeenCalled();
  });

  it('forwards refs to the child element', () => {
    const ref = React.createRef<View>();
    render(
      <Slot>
        <View ref={ref} testID="v" />
      </Slot>,
    );
    expect(ref.current).not.toBeNull();
  });

  it('merges styles into an array (RN flattens later)', () => {
    const { getByTestId } = render(
      <Slot style={{ padding: 8 }}>
        <View testID="v" style={{ backgroundColor: 'red' }} />
      </Slot>,
    );
    const v = getByTestId('v');
    const styles = v.props.style as readonly unknown[];
    expect(Array.isArray(styles)).toBe(true);
    expect(styles).toContainEqual({ padding: 8 });
    expect(styles).toContainEqual({ backgroundColor: 'red' });
  });

  it('throws in development on a non-element child', () => {
    const orig = console.error;
    console.error = jest.fn();
    expect(() => render(<Slot>{'plain text' as unknown as React.ReactElement}</Slot>)).toThrow();
    console.error = orig;
  });
});
