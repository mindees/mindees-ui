import { getComponentTag } from '../../../layout-intelligence/tagged-component';
import { SafeAreaView } from '../SafeAreaView';
import { ScreenWrapper } from '../ScreenWrapper';

describe('Screen components — layout-intelligence tags', () => {
  it('tags SafeAreaView as its own component', () => {
    // Regression: SafeAreaView was mistagged 'ScreenWrapper', so the two
    // collided and any rule keyed on either silently double-matched.
    expect(getComponentTag(<SafeAreaView />)).toBe('SafeAreaView');
  });

  it('tags ScreenWrapper distinctly from SafeAreaView', () => {
    expect(getComponentTag(<ScreenWrapper />)).toBe('ScreenWrapper');
  });
});
