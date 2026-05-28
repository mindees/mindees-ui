import { render } from '@testing-library/react-native';
import * as React from 'react';
import { Text as RNText } from 'react-native';

import { getComponentTag } from '../../../layout-intelligence/tagged-component';
import { ThemeProvider } from '../../../theme/ThemeProvider';
import { InfiniteScroll } from '../InfiniteScroll';
import { PullToRefresh } from '../PullToRefresh';
import { SwipeableCard } from '../SwipeableCard';
import { SwipeActions } from '../SwipeActions';

// Stable noop avoids the empty-function lint rule firing on inline arrows.
const noop = (): void => undefined;

const wrap = (ui: React.ReactElement): React.ReactElement => <ThemeProvider>{ui}</ThemeProvider>;

describe('mobile primitives — tag identity', () => {
  it('carries the right tag for each new primitive', () => {
    expect(
      getComponentTag(
        <SwipeActions rightActions={[{ label: 'Delete', onPress: noop, tone: 'danger' }]}>
          <RNText>Row</RNText>
        </SwipeActions>,
      ),
    ).toBe('SwipeActions');
    expect(
      getComponentTag(
        <SwipeableCard onDismiss={noop}>
          <RNText>Card</RNText>
        </SwipeableCard>,
      ),
    ).toBe('SwipeableCard');
    expect(
      getComponentTag(
        <PullToRefresh refreshing={false} onRefresh={noop}>
          <RNText>Body</RNText>
        </PullToRefresh>,
      ),
    ).toBe('PullToRefresh');
    expect(
      getComponentTag(
        <InfiniteScroll
          data={[1, 2]}
          renderItem={({ item }) => <RNText>{String(item)}</RNText>}
          onLoadMore={noop}
        />,
      ),
    ).toBe('InfiniteScroll');
  });
});

describe('mobile primitives — renders without throwing', () => {
  it('SwipeActions (left + right actions)', () => {
    expect(() =>
      render(
        wrap(
          <SwipeActions
            leftActions={[{ label: 'Archive', onPress: noop, tone: 'primary' }]}
            rightActions={[
              { label: 'Pin', onPress: noop },
              { label: 'Delete', onPress: noop, tone: 'danger' },
            ]}
          >
            <RNText>Swipe me</RNText>
          </SwipeActions>,
        ),
      ),
    ).not.toThrow();
  });

  it('SwipeableCard (dismissible)', () => {
    expect(() =>
      render(
        wrap(
          <SwipeableCard onDismiss={noop} direction="left">
            <RNText>Dismiss me</RNText>
          </SwipeableCard>,
        ),
      ),
    ).not.toThrow();
  });

  it('PullToRefresh (refreshing)', () => {
    expect(() =>
      render(
        wrap(
          <PullToRefresh refreshing onRefresh={noop}>
            <RNText>Pull me</RNText>
          </PullToRefresh>,
        ),
      ),
    ).not.toThrow();
  });

  it('InfiniteScroll (loading footer)', () => {
    expect(() =>
      render(
        wrap(
          <InfiniteScroll
            data={[1, 2, 3]}
            renderItem={({ item }) => <RNText>{String(item)}</RNText>}
            onLoadMore={noop}
            loading
          />,
        ),
      ),
    ).not.toThrow();
  });
});
