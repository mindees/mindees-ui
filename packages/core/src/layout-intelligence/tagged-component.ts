import * as React from 'react';

// Cross-realm tag so child-introspection works even if @mindees/ui is loaded
// twice (peer/duplicate). Symbol.for guarantees identity across instances.
export const COMPONENT_TAG: unique symbol = Symbol.for('@mindees/ui:component-tag');

export type ComponentTag =
  | 'Box'
  | 'Stack'
  | 'HStack'
  | 'VStack'
  | 'ZStack'
  | 'Grid'
  | 'Row'
  | 'Column'
  | 'Divider'
  | 'Spacer'
  // typography
  | 'Text'
  | 'Heading'
  | 'Caption'
  | 'Label'
  | 'Link'
  | 'Code'
  | 'Kbd'
  // buttons
  | 'Button'
  | 'IconButton'
  | 'FAB'
  | 'ButtonGroup'
  // forms
  | 'FormField'
  | 'Input'
  | 'Textarea'
  | 'PasswordInput'
  | 'SearchInput'
  | 'Select'
  | 'Checkbox'
  | 'CheckboxGroup'
  | 'Radio'
  | 'RadioGroup'
  | 'Switch'
  | 'Slider'
  // feedback
  | 'Modal'
  | 'BottomSheet'
  | 'Alert'
  | 'AlertDialog'
  | 'ActionSheet'
  | 'Drawer'
  | 'Toast'
  | 'Tooltip'
  | 'Popover'
  // navigation
  | 'Tabs'
  | 'TopBar'
  | 'Breadcrumb'
  | 'Pagination'
  | 'Stepper'
  // display
  | 'Card'
  | 'Avatar'
  | 'AvatarGroup'
  | 'Badge'
  | 'Tag'
  | 'Chip'
  | 'Image'
  | 'Icon'
  | 'List'
  | 'ListItem'
  | 'Accordion'
  | 'Progress'
  | 'Skeleton'
  | 'Spinner'
  // specialised / utility
  | 'EmptyState'
  | 'ScreenWrapper';

interface Tagged {
  [COMPONENT_TAG]?: ComponentTag;
}

// The constraint accepts both `ComponentType<P>` (class/function components)
// and `ForwardRefExoticComponent<P>` (forwardRef'd ones) without forcing the
// caller to widen their typed props to `unknown`. The `any` is internal to
// this helper and never leaks into consumers' inferred component types —
// the return type is `T`, so the original prop typing is preserved.
export function tagComponent<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends React.ComponentType<any> | React.ForwardRefExoticComponent<any>,
>(component: T, tag: ComponentTag): T {
  (component as unknown as Tagged)[COMPONENT_TAG] = tag;
  return component;
}

export function getComponentTag(
  element: React.ReactElement | null | undefined,
): ComponentTag | undefined {
  if (!element || !React.isValidElement(element)) return undefined;
  const type = element.type as unknown;
  if (type && (typeof type === 'function' || typeof type === 'object')) {
    return (type as Tagged)[COMPONENT_TAG];
  }
  return undefined;
}

export function isTaggedAs(
  element: React.ReactElement | null | undefined,
  ...tags: readonly ComponentTag[]
): boolean {
  const got = getComponentTag(element);
  return got !== undefined && tags.includes(got);
}
