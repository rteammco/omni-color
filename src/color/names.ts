import { Color } from './color';

export enum BaseColorName {
  RED = 'Red',
  ORANGE = 'Orange',
  YELLOW = 'Yellow',
  GREEN = 'Green',
  BLUE = 'Blue',
  PURPLE = 'Purple',
  PINK = 'Pink',
  BLACK = 'Black',
  GRAY = 'Gray',
  WHITE = 'White',
}

export enum ColorLightnessModifier {
  LIGHT = 'Light',
  NORMAL = 'Normal',
  DARK = 'Dark',
}

export interface ColorNameAndLightness {
  name: BaseColorName;
  lightness: ColorLightnessModifier;
}

interface HueRangeInclusive {
  start: number; // 0-360
  end: number; // 0-360
}

export const BASE_COLOR_HUE_RANGES: { [key in BaseColorName]: HueRangeInclusive[] } = {
  [BaseColorName.RED]: [
    { start: 345, end: 360 },
    { start: 0, end: 14 },
  ],
  [BaseColorName.ORANGE]: [{ start: 15, end: 44 }],
  [BaseColorName.YELLOW]: [{ start: 45, end: 74 }],
  [BaseColorName.GREEN]: [{ start: 75, end: 164 }],
  [BaseColorName.BLUE]: [{ start: 165, end: 254 }],
  [BaseColorName.PURPLE]: [{ start: 255, end: 284 }],
  [BaseColorName.PINK]: [{ start: 285, end: 344 }],
  // Hue doesn't matter for neutrals, but keep a default full range:
  [BaseColorName.BLACK]: [{ start: 0, end: 360 }],
  [BaseColorName.GRAY]: [{ start: 0, end: 360 }],
  [BaseColorName.WHITE]: [{ start: 0, end: 360 }],
};

function isWithinHueRange(name: BaseColorName, hue: number): boolean {
  return BASE_COLOR_HUE_RANGES[name].some((range) => hue >= range.start && hue <= range.end);
}

function getColorNameByHue(hue: number): BaseColorName {
  if (isWithinHueRange(BaseColorName.RED, hue)) {
    return BaseColorName.RED;
  }
  if (isWithinHueRange(BaseColorName.ORANGE, hue)) {
    return BaseColorName.ORANGE;
  }
  if (isWithinHueRange(BaseColorName.YELLOW, hue)) {
    return BaseColorName.YELLOW;
  }
  if (isWithinHueRange(BaseColorName.GREEN, hue)) {
    return BaseColorName.GREEN;
  }
  if (isWithinHueRange(BaseColorName.BLUE, hue)) {
    return BaseColorName.BLUE;
  }
  if (isWithinHueRange(BaseColorName.PURPLE, hue)) {
    return BaseColorName.PURPLE;
  }
  // else, hue < 345:
  return BaseColorName.PINK;
}

function getLightnessModifier(l: number): ColorLightnessModifier {
  if (l <= 30) {
    return ColorLightnessModifier.DARK;
  }
  if (l >= 70) {
    return ColorLightnessModifier.LIGHT;
  }
  return ColorLightnessModifier.NORMAL;
}

export function getBaseColorName(color: Color): ColorNameAndLightness {
  const { h, s, l } = color.toHSL();

  if (s <= 10) {
    if (l <= 10) {
      return { name: BaseColorName.BLACK, lightness: ColorLightnessModifier.NORMAL };
    }
    if (l >= 90) {
      return { name: BaseColorName.WHITE, lightness: ColorLightnessModifier.NORMAL };
    }
    return { name: BaseColorName.GRAY, lightness: getLightnessModifier(l) };
  }

  const name = getColorNameByHue(h);
  const lightness = getLightnessModifier(l);
  return { name, lightness };
}
