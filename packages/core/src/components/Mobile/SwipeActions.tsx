import * as React from 'react';
import {
  Animated,
  type GestureResponderEvent,
  PanResponder,
  type PanResponderGestureState,
  Pressable,
  type StyleProp,
  StyleSheet,
  View,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Text } from '../Text/Text';

export type SwipeActionTone = 'default' | 'primary' | 'danger';

export interface SwipeAction {
  readonly label: string;
  readonly onPress: () => void;
  readonly tone?: SwipeActionTone;
}

export interface SwipeActionsProps extends Omit<ViewProps, 'style' | 'children'> {
  /** Actions revealed when swiping the row to the right (anchored at the left edge). */
  readonly leftActions?: readonly SwipeAction[];
  /** Actions revealed when swiping the row to the left (anchored at the right edge). */
  readonly rightActions?: readonly SwipeAction[];
  /** Width of each action button. Defaults to 80. */
  readonly actionWidth?: number;
  readonly children: React.ReactNode;
  /** Style applied to the moving row surface. */
  readonly style?: StyleProp<ViewStyle>;
}

const staticStyles = StyleSheet.create({
  root: {
    overflow: 'hidden',
    position: 'relative',
  },
  actionsRow: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  actionsRowLeft: { left: 0 },
  actionsRowRight: { right: 0 },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const DEFAULT_ACTION_WIDTH = 80;
// Drag past this fraction of the panel width to settle open; otherwise snap shut.
const OPEN_THRESHOLD = 0.5;

function toneColor(tone: SwipeActionTone, tokens: ReturnType<typeof useTokens>): string {
  if (tone === 'danger') return tokens.colors.status.danger;
  if (tone === 'primary') return tokens.colors.action.primary;
  return tokens.colors.action.secondary;
}

const SwipeActionsImpl = React.forwardRef<View, SwipeActionsProps>(
  function SwipeActions(props, ref) {
    const {
      leftActions,
      rightActions,
      actionWidth = DEFAULT_ACTION_WIDTH,
      children,
      style,
      ...rest
    } = props;
    const tokens = useTokens();

    const left = leftActions ?? EMPTY_ACTIONS;
    const right = rightActions ?? EMPTY_ACTIONS;
    const leftWidth = left.length * actionWidth;
    const rightWidth = right.length * actionWidth;

    const translateX = React.useRef(new Animated.Value(0)).current;
    // `offset` tracks the settled position so a new drag continues from rest.
    const latest = React.useRef({ offset: 0, leftWidth, rightWidth });
    latest.current.leftWidth = leftWidth;
    latest.current.rightWidth = rightWidth;

    const settle = React.useCallback(
      (to: number) => {
        latest.current.offset = to;
        Animated.spring(translateX, {
          toValue: to,
          useNativeDriver: true,
          bounciness: 0,
        }).start();
      },
      [translateX],
    );

    const panResponder = React.useMemo(
      () =>
        PanResponder.create({
          onMoveShouldSetPanResponder: (_e: GestureResponderEvent, g: PanResponderGestureState) =>
            Math.abs(g.dx) > Math.abs(g.dy) && Math.abs(g.dx) > 6,
          onPanResponderMove: (_e: GestureResponderEvent, g: PanResponderGestureState) => {
            const next = latest.current.offset + g.dx;
            const max = latest.current.leftWidth;
            const min = -latest.current.rightWidth;
            const clamped = next > max ? max : next < min ? min : next;
            translateX.setValue(clamped);
          },
          onPanResponderRelease: (_e: GestureResponderEvent, g: PanResponderGestureState) => {
            const next = latest.current.offset + g.dx;
            const { leftWidth: lw, rightWidth: rw } = latest.current;
            if (next > lw * OPEN_THRESHOLD && lw > 0) {
              settle(lw);
            } else if (next < -rw * OPEN_THRESHOLD && rw > 0) {
              settle(-rw);
            } else {
              settle(0);
            }
          },
          onPanResponderTerminate: () => settle(latest.current.offset),
        }),
      [translateX, settle],
    );

    const close = React.useCallback(() => settle(0), [settle]);

    const renderActions = (actions: readonly SwipeAction[]): React.ReactNode =>
      actions.map((action) => {
        const tone = action.tone ?? 'default';
        return (
          <Pressable
            key={action.label}
            accessibilityRole="button"
            accessibilityLabel={action.label}
            onPress={() => {
              action.onPress();
              close();
            }}
            style={[
              staticStyles.actionButton,
              { width: actionWidth, backgroundColor: toneColor(tone, tokens) },
            ]}
          >
            <Text
              variant="caption"
              weight="semibold"
              style={{
                color:
                  tone === 'default' ? tokens.colors.text.primary : tokens.colors.text.onAccent,
              }}
              numberOfLines={1}
            >
              {action.label}
            </Text>
          </Pressable>
        );
      });

    return (
      <View ref={ref} accessibilityRole="none" style={staticStyles.root}>
        {left.length > 0 ? (
          <View
            style={[staticStyles.actionsRow, staticStyles.actionsRowLeft]}
            pointerEvents="box-none"
          >
            {renderActions(left)}
          </View>
        ) : null}
        {right.length > 0 ? (
          <View
            style={[staticStyles.actionsRow, staticStyles.actionsRowRight]}
            pointerEvents="box-none"
          >
            {renderActions(right)}
          </View>
        ) : null}
        <Animated.View
          style={[
            { backgroundColor: tokens.colors.background.elevated, transform: [{ translateX }] },
            style,
          ]}
          {...panResponder.panHandlers}
          {...rest}
        >
          {children}
        </Animated.View>
      </View>
    );
  },
);

// Hoisted: stable empty fallback so render never allocates a fresh array.
const EMPTY_ACTIONS: readonly SwipeAction[] = [];

SwipeActionsImpl.displayName = 'SwipeActions';

export const SwipeActions = tagComponent(React.memo(SwipeActionsImpl), 'SwipeActions');
