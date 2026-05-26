import { fireEvent, render } from '@testing-library/react-native';

import { getComponentTag } from '../../../layout-intelligence/tagged-component';
import { Button } from '../Button';
import { ButtonGroup } from '../ButtonGroup';
import { FAB } from '../FAB';
import { IconButton } from '../IconButton';

describe('Phase 4 buttons — smoke', () => {
  it('every button primitive carries its tag', () => {
    expect(getComponentTag(<Button>Tag</Button>)).toBe('Button');
    expect(getComponentTag(<ButtonGroup />)).toBe('ButtonGroup');
    expect(
      getComponentTag(
        <IconButton accessibilityLabel="x">
          <></>
        </IconButton>,
      ),
    ).toBe('IconButton');
    expect(
      getComponentTag(
        <FAB accessibilityLabel="add">
          <></>
        </FAB>,
      ),
    ).toBe('FAB');
  });

  it('Button calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByRole } = render(<Button onPress={onPress}>Go</Button>);
    fireEvent.press(getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('Button respects disabled and skips onPress', () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <Button onPress={onPress} disabled>
        Go
      </Button>,
    );
    fireEvent.press(getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('IconButton requires accessibilityLabel and forwards it', () => {
    const { getByLabelText } = render(
      <IconButton accessibilityLabel="Close">
        <></>
      </IconButton>,
    );
    expect(getByLabelText('Close')).toBeTruthy();
  });
});
