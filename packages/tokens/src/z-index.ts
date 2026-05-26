// Named layers in stacking order. Components must use these — never raw
// numbers — so PortalProvider/BottomSheet/Modal can never collide.

export const zIndex = {
  base: 0,
  raised: 1,
  dropdown: 1000,
  sticky: 1100,
  drawer: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  toast: 1600,
  tooltip: 1700,
  debug: 9999,
} as const;

export type ZIndexToken = keyof typeof zIndex;
