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

function getColorNameByHue(hue: number): BaseColorName {
  if (hue < 15 || hue >= 345) {
    return BaseColorName.RED;
  }
  if (hue < 45) {
    return BaseColorName.ORANGE;
  }
  if (hue < 75) {
    return BaseColorName.YELLOW;
  }
  if (hue < 165) {
    return BaseColorName.GREEN;
  }
  if (hue < 255) {
    return BaseColorName.BLUE;
  }
  if (hue < 285) {
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

export function getBaseColorName(color: Color): {
  name: BaseColorName;
  lightness: ColorLightnessModifier;
} {
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
