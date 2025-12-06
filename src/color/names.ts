import type { Color } from './color';

export const BASE_COLOR_NAME_OPTIONS = {
  RED: 'Red',
  ORANGE: 'Orange',
  YELLOW: 'Yellow',
  GREEN: 'Green',
  BLUE: 'Blue',
  PURPLE: 'Purple',
  PINK: 'Pink',
  BLACK: 'Black',
  GRAY: 'Gray',
  WHITE: 'White',
} as const;

export type BaseColorName = (typeof BASE_COLOR_NAME_OPTIONS)[keyof typeof BASE_COLOR_NAME_OPTIONS];

const COLOR_LIGHTNESS_MODIFIER_OPTIONS = {
  LIGHT: 'Light',
  NORMAL: 'Normal',
  DARK: 'Dark',
} as const;

export type ColorLightnessModifier =
  (typeof COLOR_LIGHTNESS_MODIFIER_OPTIONS)[keyof typeof COLOR_LIGHTNESS_MODIFIER_OPTIONS];

export interface ColorNameAndLightness {
  name: BaseColorName;
  lightness: ColorLightnessModifier;
}

interface HueRangeInclusive {
  start: number; // 0-360
  end: number; // 0-360
}

export const BASE_COLOR_HUE_RANGES: { [key in BaseColorName]: HueRangeInclusive[] } = {
  [BASE_COLOR_NAME_OPTIONS.RED]: [
    { start: 345, end: 360 },
    { start: 0, end: 14 },
  ],
  [BASE_COLOR_NAME_OPTIONS.ORANGE]: [{ start: 15, end: 44 }],
  [BASE_COLOR_NAME_OPTIONS.YELLOW]: [{ start: 45, end: 74 }],
  [BASE_COLOR_NAME_OPTIONS.GREEN]: [{ start: 75, end: 164 }],
  [BASE_COLOR_NAME_OPTIONS.BLUE]: [{ start: 165, end: 254 }],
  [BASE_COLOR_NAME_OPTIONS.PURPLE]: [{ start: 255, end: 284 }],
  [BASE_COLOR_NAME_OPTIONS.PINK]: [{ start: 285, end: 344 }],
  // Hue doesn't matter for neutrals, but keep a default full range:
  [BASE_COLOR_NAME_OPTIONS.BLACK]: [{ start: 0, end: 360 }],
  [BASE_COLOR_NAME_OPTIONS.GRAY]: [{ start: 0, end: 360 }],
  [BASE_COLOR_NAME_OPTIONS.WHITE]: [{ start: 0, end: 360 }],
};

export const BLACK_MIN_LIGHTNESS_THRESHOLD = 5; // colors below this lightness will alway be considered black
export const WHITE_MAX_LIGHTNESS_THRESHOLD = 99; // colors above this lightness will alway be considered white
export const GRAYSCALE_MIN_SATURATION_THRESHOLD = 10; // colors below this saturation will always be considered gray, black, or white
export const BLACK_MIN_LIGHTNESS_THRESHOLD_LOW_SATURATION = 10; // colors below this lightness will be considered black if saturation < GRAYSCALE_MIN_SATURATION_THRESHOLD
export const WHITE_MAX_LIGHTNESS_THRESHOLD_LOW_SATURATION = 90; // colors above this lightness will be considered white if saturation < GRAYSCALE_MIN_SATURATION_THRESHOLD

function isWithinHueRange(name: BaseColorName, hue: number): boolean {
  return BASE_COLOR_HUE_RANGES[name].some((range) => hue >= range.start && hue <= range.end);
}

function getColorNameByHue(hue: number): BaseColorName {
  if (isWithinHueRange(BASE_COLOR_NAME_OPTIONS.RED, hue)) {
    return BASE_COLOR_NAME_OPTIONS.RED;
  }
  if (isWithinHueRange(BASE_COLOR_NAME_OPTIONS.ORANGE, hue)) {
    return BASE_COLOR_NAME_OPTIONS.ORANGE;
  }
  if (isWithinHueRange(BASE_COLOR_NAME_OPTIONS.YELLOW, hue)) {
    return BASE_COLOR_NAME_OPTIONS.YELLOW;
  }
  if (isWithinHueRange(BASE_COLOR_NAME_OPTIONS.GREEN, hue)) {
    return BASE_COLOR_NAME_OPTIONS.GREEN;
  }
  if (isWithinHueRange(BASE_COLOR_NAME_OPTIONS.BLUE, hue)) {
    return BASE_COLOR_NAME_OPTIONS.BLUE;
  }
  if (isWithinHueRange(BASE_COLOR_NAME_OPTIONS.PURPLE, hue)) {
    return BASE_COLOR_NAME_OPTIONS.PURPLE;
  }
  // else, hue < 345:
  return BASE_COLOR_NAME_OPTIONS.PINK;
}

function getLightnessModifier(l: number): ColorLightnessModifier {
  if (l <= 30) {
    return COLOR_LIGHTNESS_MODIFIER_OPTIONS.DARK;
  }
  if (l >= 70) {
    return COLOR_LIGHTNESS_MODIFIER_OPTIONS.LIGHT;
  }
  return COLOR_LIGHTNESS_MODIFIER_OPTIONS.NORMAL;
}

export function getBaseColorName(color: Color): ColorNameAndLightness {
  const { h, s, l } = color.toHSL();

  if (l < BLACK_MIN_LIGHTNESS_THRESHOLD) {
    return {
      name: BASE_COLOR_NAME_OPTIONS.BLACK,
      lightness: COLOR_LIGHTNESS_MODIFIER_OPTIONS.NORMAL,
    };
  }

  if (l > WHITE_MAX_LIGHTNESS_THRESHOLD) {
    return {
      name: BASE_COLOR_NAME_OPTIONS.WHITE,
      lightness: COLOR_LIGHTNESS_MODIFIER_OPTIONS.NORMAL,
    };
  }

  if (s < GRAYSCALE_MIN_SATURATION_THRESHOLD) {
    if (l < BLACK_MIN_LIGHTNESS_THRESHOLD_LOW_SATURATION) {
      return {
        name: BASE_COLOR_NAME_OPTIONS.BLACK,
        lightness: COLOR_LIGHTNESS_MODIFIER_OPTIONS.NORMAL,
      };
    }
    if (l > WHITE_MAX_LIGHTNESS_THRESHOLD_LOW_SATURATION) {
      return {
        name: BASE_COLOR_NAME_OPTIONS.WHITE,
        lightness: COLOR_LIGHTNESS_MODIFIER_OPTIONS.NORMAL,
      };
    }
    return { name: BASE_COLOR_NAME_OPTIONS.GRAY, lightness: getLightnessModifier(l) };
  }

  const name = getColorNameByHue(h);
  const lightness = getLightnessModifier(l);
  return { name, lightness };
}
