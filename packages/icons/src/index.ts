import { createIcon } from './createIcon';

export * from './createIcon';

// A minimal starter set. Each icon is a tree-shakeable named export so apps
// only pay for what they import. The full set lands in Phase 6.

export const ChevronDownIcon = createIcon({
  name: 'ChevronDown',
  viewBox: '0 0 24 24',
  path: 'M6 9l6 6 6-6',
});

export const ChevronUpIcon = createIcon({
  name: 'ChevronUp',
  viewBox: '0 0 24 24',
  path: 'M18 15l-6-6-6 6',
});

export const ChevronLeftIcon = createIcon({
  name: 'ChevronLeft',
  viewBox: '0 0 24 24',
  path: 'M15 18l-6-6 6-6',
});

export const ChevronRightIcon = createIcon({
  name: 'ChevronRight',
  viewBox: '0 0 24 24',
  path: 'M9 18l6-6-6-6',
});

export const CheckIcon = createIcon({
  name: 'Check',
  viewBox: '0 0 24 24',
  path: 'M20 6L9 17l-5-5',
});

export const CloseIcon = createIcon({
  name: 'Close',
  viewBox: '0 0 24 24',
  path: 'M18 6L6 18M6 6l12 12',
});

export const SearchIcon = createIcon({
  name: 'Search',
  viewBox: '0 0 24 24',
  path: 'M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z',
});
