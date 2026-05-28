// Phase 1: Layout Intelligence Layer + Theme + Providers + styling + a11y.
// Phase 2: layout + typography primitives.
// Phase 3+: forms, buttons, overlays, navigation, display, specialised.

// Re-export the design tokens so consumers can build override themes and read
// raw scales from a single dependency (`@mindees/ui`) without also having to
// install `@mindees/tokens` directly.
export * from '@mindees/tokens';

export * from './theme';
export * from './layout-intelligence';
export * from './providers';
export * from './styling';
export * from './a11y';
export * from './components';
