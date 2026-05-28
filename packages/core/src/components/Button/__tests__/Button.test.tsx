import { fireEvent, render } from '@testing-library/react-native';

import { getComponentTag } from '../../../layout-intelligence/tagged-component';
import { BackButton } from '../BackButton';
import { Button } from '../Button';
import { ButtonGroup } from '../ButtonGroup';
import { CloseButton } from '../CloseButton';
import { CopyButton } from '../CopyButton';
import { DownloadButton } from '../DownloadButton';
import { FAB } from '../FAB';
import { IconButton } from '../IconButton';
import { RetryButton } from '../RetryButton';
import { ShareButton } from '../ShareButton';
import { SplitButton } from '../SplitButton';
import { ToggleButton } from '../ToggleButton';
import { UploadButton } from '../UploadButton';

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

describe('buttons-extra (1.1.0) — tags + smoke', () => {
  const SAMPLE_ITEMS = [{ label: 'Duplicate', onPress: () => undefined }];

  it('every buttons-extra primitive carries its tag', () => {
    expect(getComponentTag(<SplitButton items={SAMPLE_ITEMS}>Save</SplitButton>)).toBe(
      'SplitButton',
    );
    expect(getComponentTag(<ToggleButton>Bold</ToggleButton>)).toBe('ToggleButton');
    expect(getComponentTag(<CloseButton />)).toBe('CloseButton');
    expect(getComponentTag(<CopyButton value="abc" />)).toBe('CopyButton');
    expect(getComponentTag(<ShareButton message="hi" />)).toBe('ShareButton');
    expect(getComponentTag(<DownloadButton />)).toBe('DownloadButton');
    expect(getComponentTag(<UploadButton />)).toBe('UploadButton');
    expect(getComponentTag(<RetryButton />)).toBe('RetryButton');
    expect(getComponentTag(<BackButton />)).toBe('BackButton');
  });

  it('renders every buttons-extra primitive without throwing', () => {
    expect(() => render(<SplitButton items={SAMPLE_ITEMS}>Save</SplitButton>)).not.toThrow();
    expect(() => render(<ToggleButton selected>Bold</ToggleButton>)).not.toThrow();
    expect(() => render(<CloseButton />)).not.toThrow();
    expect(() => render(<CopyButton value="abc" />)).not.toThrow();
    expect(() => render(<ShareButton message="hi" />)).not.toThrow();
    expect(() => render(<DownloadButton>Get</DownloadButton>)).not.toThrow();
    expect(() => render(<UploadButton>Send</UploadButton>)).not.toThrow();
    expect(() => render(<RetryButton />)).not.toThrow();
    expect(() => render(<BackButton />)).not.toThrow();
  });

  it('ToggleButton reports selected state and toggles on press', () => {
    const onChange = jest.fn();
    const { getByRole } = render(
      <ToggleButton selected onChange={onChange}>
        Bold
      </ToggleButton>,
    );
    const node = getByRole('button');
    expect(node.props.accessibilityState).toMatchObject({ selected: true });
    fireEvent.press(node);
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('CloseButton defaults its accessibilityLabel to "Close"', () => {
    const { getByLabelText } = render(<CloseButton />);
    expect(getByLabelText('Close')).toBeTruthy();
  });

  it('BackButton defaults its accessibilityLabel to "Back"', () => {
    const { getByLabelText } = render(<BackButton />);
    expect(getByLabelText('Back')).toBeTruthy();
  });

  it('CopyButton swaps to the copied label after press', () => {
    const { getByText, queryByText } = render(<CopyButton value="abc" />);
    expect(getByText('Copy')).toBeTruthy();
    fireEvent.press(getByText('Copy'));
    expect(getByText('Copied')).toBeTruthy();
    expect(queryByText('Copy')).toBeNull();
  });
});
