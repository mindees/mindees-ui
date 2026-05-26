import { getComponentTag } from '../../../layout-intelligence/tagged-component';
import { ActionSheet } from '../ActionSheet';
import { Alert } from '../Alert';
import { BottomSheet } from '../BottomSheet';
import { Drawer } from '../Drawer';
import { Modal } from '../Modal';
import { Popover } from '../Popover';
import { Toast } from '../Toast';
import { Tooltip } from '../Tooltip';

// Stable noop avoids eslint's empty-function rule firing for inline arrows.
const noop = (): void => undefined;

describe('Phase 4 overlays — tag identity', () => {
  it('every overlay primitive carries its tag', () => {
    expect(getComponentTag(<Modal visible={false} onClose={noop} />)).toBe('Modal');
    expect(getComponentTag(<BottomSheet visible={false} onClose={noop} />)).toBe('BottomSheet');
    expect(getComponentTag(<Toast visible={false} message="x" />)).toBe('Toast');
    expect(
      getComponentTag(
        <Tooltip label="x">
          <></>
        </Tooltip>,
      ),
    ).toBe('Tooltip');
    expect(getComponentTag(<Popover visible={false} onClose={noop} trigger={<></>} />)).toBe(
      'Popover',
    );
    expect(getComponentTag(<Drawer visible={false} onClose={noop} />)).toBe('Drawer');
    expect(getComponentTag(<Alert visible={false} onClose={noop} title="x" />)).toBe('Alert');
    expect(getComponentTag(<ActionSheet visible={false} onClose={noop} items={[]} />)).toBe(
      'ActionSheet',
    );
  });
});
