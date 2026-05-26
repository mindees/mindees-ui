import * as React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

// Radix-inspired Slot: when a parent uses `<Slot {...parentProps}><Child /></Slot>`,
// it merges parentProps onto the single Child element rather than wrapping it.
// This is how `Button` adopts a `Pressable` child without an extra View, and
// how compound components (Tooltip.Trigger, etc.) implement the `asChild` API.
//
// Merge rules (deterministic, see __tests__/Slot.test.tsx):
//   - event handlers   : both run (child's first, then parent's) unless child
//                        calls event.preventDefault()
//   - style            : merged via array, child's style wins on conflict
//   - className (web)  : concatenated
//   - ref              : forwarded via mergeRefs so both parent + child get it
//   - all other props  : child wins (an explicit child override beats the
//                        slot's defaults)

type Falsy = false | null | undefined;
type AnyRef<T> = React.Ref<T> | undefined;

type AnyProps = Record<string, unknown> & {
  style?: StyleProp<ViewStyle>;
  className?: string;
  children?: React.ReactNode;
};

function mergeRefs<T>(...refs: ReadonlyArray<AnyRef<T> | Falsy>): React.RefCallback<T> {
  return (value) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === 'function') {
        ref(value);
      } else {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    }
  };
}

function mergeProps(parent: AnyProps, child: AnyProps): AnyProps {
  const merged: AnyProps = { ...parent };
  for (const key of Object.keys(child)) {
    const parentVal = parent[key];
    const childVal = child[key];

    // event handlers: chain parent → child
    if (key.startsWith('on') && typeof parentVal === 'function' && typeof childVal === 'function') {
      merged[key] = (...args: unknown[]) => {
        (childVal as (...a: unknown[]) => unknown)(...args);
        const evt = args[0] as { defaultPrevented?: boolean } | undefined;
        if (!evt?.defaultPrevented) {
          (parentVal as (...a: unknown[]) => unknown)(...args);
        }
      };
      continue;
    }

    // style: array-merge, child wins on conflict (RN flattens later)
    if (key === 'style') {
      merged.style = [parent.style, child.style].filter(Boolean) as StyleProp<ViewStyle>;
      continue;
    }

    // className: concat (only relevant on RN-Web)
    if (key === 'className' && parentVal && childVal) {
      merged.className = `${String(parentVal)} ${String(childVal)}`.trim();
      continue;
    }

    // anything else: child wins (an explicit child prop overrides the slot)
    merged[key] = childVal;
  }
  return merged;
}

export interface SlotProps extends AnyProps {
  /** Exactly one React element child. Anything else throws in development. */
  children: React.ReactElement;
}

export const Slot = React.forwardRef<unknown, SlotProps>(function Slot(props, forwardedRef) {
  const { children, ...slotProps } = props;
  if (!React.isValidElement(children)) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error('<Slot> expects exactly one valid React element as its child.');
    }
    return null;
  }
  const childProps = children.props as AnyProps;
  const childRef = (children as React.ReactElement & { ref?: AnyRef<unknown> }).ref;
  const merged = mergeProps(slotProps, childProps);
  merged.ref = mergeRefs(forwardedRef, childRef);
  return React.cloneElement(children, merged);
});

// `Slottable` lets a compound component decide between rendering its own
// default element and forwarding via Slot, based on an `asChild` prop. The
// pattern is the same as Radix UI on the web.
//
// Usage:
//   function Trigger({ asChild, ...rest }: Props & { asChild?: boolean }) {
//     const Comp = asChild ? Slot : Pressable;
//     return <Comp {...rest} />;
//   }
export type AsChildProps<DefaultProps> =
  | ({ asChild?: false } & DefaultProps)
  | ({ asChild: true; children: React.ReactElement } & Omit<DefaultProps, 'children'>);
