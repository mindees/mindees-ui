// Raw color scales: 12-step ramps inspired by the Radix Colors model.
// Step 1 = app background, 12 = highest-contrast text. Steps 9/10 are the
// brand accent. Steps 11/12 are used for body and high-emphasis text.
//
// We ship light + dark variants of each scale. Semantic theme tokens
// reference these steps so swapping themes never touches component code.

export type ColorScale = readonly [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];

export const grayLight: ColorScale = [
  '#fcfcfc',
  '#f8f8f8',
  '#f0f0f0',
  '#e8e8e8',
  '#e0e0e0',
  '#d9d9d9',
  '#cecece',
  '#bbbbbb',
  '#8d8d8d',
  '#838383',
  '#646464',
  '#202020',
] as const;

export const grayDark: ColorScale = [
  '#111111',
  '#191919',
  '#222222',
  '#2a2a2a',
  '#313131',
  '#3a3a3a',
  '#484848',
  '#606060',
  '#6e6e6e',
  '#7b7b7b',
  '#b4b4b4',
  '#eeeeee',
] as const;

export const blueLight: ColorScale = [
  '#fbfdff',
  '#f4faff',
  '#e6f4fe',
  '#d5efff',
  '#c2e5ff',
  '#acd8fc',
  '#8ec8f6',
  '#5eb1ef',
  '#0090ff',
  '#0588f0',
  '#0d74ce',
  '#113264',
] as const;

export const blueDark: ColorScale = [
  '#0d1520',
  '#111927',
  '#0d2847',
  '#003362',
  '#004074',
  '#104d87',
  '#205d9e',
  '#2870bd',
  '#0090ff',
  '#3b9eff',
  '#70b8ff',
  '#c2e6ff',
] as const;

export const greenLight: ColorScale = [
  '#fbfefc',
  '#f4fbf6',
  '#e6f6eb',
  '#d6f1df',
  '#c4e8d1',
  '#adddc0',
  '#8eceaa',
  '#5bb98c',
  '#30a46c',
  '#2b9a66',
  '#218358',
  '#193b2d',
] as const;

export const greenDark: ColorScale = [
  '#0d1912',
  '#0c1f17',
  '#0f291e',
  '#113123',
  '#133929',
  '#164430',
  '#1b543a',
  '#236e4a',
  '#30a46c',
  '#33b074',
  '#3dd68c',
  '#b1f1cb',
] as const;

export const redLight: ColorScale = [
  '#fffcfc',
  '#fff7f7',
  '#feebec',
  '#ffdbdc',
  '#ffcdce',
  '#fdbdbe',
  '#f4a9aa',
  '#eb8e90',
  '#e5484d',
  '#dc3e42',
  '#ce2c31',
  '#641723',
] as const;

export const redDark: ColorScale = [
  '#1f1315',
  '#291415',
  '#3c181a',
  '#481a1d',
  '#541b1f',
  '#671e22',
  '#822025',
  '#aa2429',
  '#e5484d',
  '#ec5d5e',
  '#ff9592',
  '#ffd1d9',
] as const;

export const yellowLight: ColorScale = [
  '#fdfdf9',
  '#fefce9',
  '#fffab8',
  '#fff394',
  '#ffe770',
  '#f3d768',
  '#e4c767',
  '#d5ae39',
  '#ffe629',
  '#ffdc00',
  '#9e6c00',
  '#473b1f',
] as const;

export const yellowDark: ColorScale = [
  '#1c1500',
  '#221a00',
  '#2c2100',
  '#352800',
  '#3e3000',
  '#493c00',
  '#594a05',
  '#705e00',
  '#ffe629',
  '#ffff57',
  '#f5e147',
  '#f6eeb4',
] as const;

export const orangeLight: ColorScale = [
  '#fefcfb',
  '#fff7ed',
  '#ffefd6',
  '#ffdfb5',
  '#ffd19a',
  '#ffc182',
  '#f5ae73',
  '#ec9455',
  '#f76b15',
  '#ef5f00',
  '#cc4e00',
  '#582d1d',
] as const;

export const orangeDark: ColorScale = [
  '#1f1206',
  '#2b1400',
  '#391a03',
  '#441f04',
  '#4f2305',
  '#5f2a06',
  '#763205',
  '#943e00',
  '#f76b15',
  '#ff801f',
  '#ffa057',
  '#ffe0c2',
] as const;

export interface PaletteScales {
  readonly gray: ColorScale;
  readonly blue: ColorScale;
  readonly green: ColorScale;
  readonly red: ColorScale;
  readonly yellow: ColorScale;
  readonly orange: ColorScale;
}

export const lightPalette: PaletteScales = {
  gray: grayLight,
  blue: blueLight,
  green: greenLight,
  red: redLight,
  yellow: yellowLight,
  orange: orangeLight,
} as const;

export const darkPalette: PaletteScales = {
  gray: grayDark,
  blue: blueDark,
  green: greenDark,
  red: redDark,
  yellow: yellowDark,
  orange: orangeDark,
} as const;

// Semantic mapping. Components should consume these — not raw scales — so
// theme switching is a single context swap rather than a per-component change.
export interface SemanticColors {
  readonly background: {
    readonly canvas: string;
    readonly surface: string;
    readonly subtle: string;
    readonly elevated: string;
    readonly inverse: string;
  };
  readonly text: {
    readonly primary: string;
    readonly secondary: string;
    readonly muted: string;
    readonly inverse: string;
    readonly link: string;
    readonly onAccent: string;
  };
  readonly border: {
    readonly subtle: string;
    readonly default: string;
    readonly strong: string;
    readonly focus: string;
  };
  readonly action: {
    readonly primary: string;
    readonly primaryHover: string;
    readonly primaryActive: string;
    readonly primaryDisabled: string;
    readonly secondary: string;
    readonly secondaryHover: string;
    readonly secondaryActive: string;
    readonly secondaryDisabled: string;
  };
  readonly status: {
    readonly success: string;
    readonly successSubtle: string;
    readonly danger: string;
    readonly dangerSubtle: string;
    readonly warning: string;
    readonly warningSubtle: string;
    readonly info: string;
    readonly infoSubtle: string;
  };
  readonly overlay: {
    readonly scrim: string;
    readonly scrimStrong: string;
  };
}

const buildSemantic = (p: PaletteScales): SemanticColors => ({
  background: {
    canvas: p.gray[0],
    surface: p.gray[1],
    subtle: p.gray[2],
    elevated: p.gray[1],
    inverse: p.gray[11],
  },
  text: {
    primary: p.gray[11],
    secondary: p.gray[10],
    muted: p.gray[8],
    inverse: p.gray[0],
    link: p.blue[10],
    onAccent: '#ffffff',
  },
  border: {
    subtle: p.gray[3],
    default: p.gray[5],
    strong: p.gray[7],
    focus: p.blue[8],
  },
  action: {
    primary: p.blue[8],
    primaryHover: p.blue[9],
    primaryActive: p.blue[10],
    primaryDisabled: p.gray[4],
    secondary: p.gray[2],
    secondaryHover: p.gray[3],
    secondaryActive: p.gray[4],
    secondaryDisabled: p.gray[2],
  },
  status: {
    success: p.green[8],
    successSubtle: p.green[2],
    danger: p.red[8],
    dangerSubtle: p.red[2],
    warning: p.orange[8],
    warningSubtle: p.orange[2],
    info: p.blue[8],
    infoSubtle: p.blue[2],
  },
  overlay: {
    scrim: 'rgba(0,0,0,0.42)',
    scrimStrong: 'rgba(0,0,0,0.66)',
  },
});

export const semanticLight: SemanticColors = buildSemantic(lightPalette);
export const semanticDark: SemanticColors = buildSemantic(darkPalette);

// High-contrast variants for accessibility. These push contrast ratios well
// above WCAG 2.2 AAA so users with vision-related needs (and prefers-contrast
// system settings) get a first-class experience by default.
export const semanticHighContrastLight: SemanticColors = {
  ...semanticLight,
  text: {
    ...semanticLight.text,
    primary: '#000000',
    secondary: '#1a1a1a',
    muted: '#3a3a3a',
  },
  border: {
    subtle: '#3a3a3a',
    default: '#000000',
    strong: '#000000',
    focus: '#0050b3',
  },
};

export const semanticHighContrastDark: SemanticColors = {
  ...semanticDark,
  text: {
    ...semanticDark.text,
    primary: '#ffffff',
    secondary: '#f0f0f0',
    muted: '#c8c8c8',
  },
  border: {
    subtle: '#cccccc',
    default: '#ffffff',
    strong: '#ffffff',
    focus: '#80c5ff',
  },
};
