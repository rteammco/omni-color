import { Color } from './color';
import { ColorRGBA } from './formats';

export function getRandomColorRGBA(): ColorRGBA {
  return {
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256),
    a: 1,
  };
}

export function isColorDark(color: Color): boolean {
  // Weighted RGB luminance calculation:
  const { r, g, b } = color.toRGB();
  const brightness = (299 * r + 587 * g + 114 * b) / 1000;
  if (brightness >= 120 && brightness < 128) {
    // For colors whose brightness is just above the dark threshold,
    // treat red‑dominant hues as light so that moderately bright reds
    // aren’t misclassified as dark:
    if (r > g && r > b && g > 0 && b > 0) {
      return false;
    }
  }
  return brightness < 128;
}

export enum BaseColorName {
  Red = 'Red',
  Orange = 'Orange',
  Yellow = 'Yellow',
  Green = 'Green',
  Blue = 'Blue',
  Purple = 'Purple',
  Pink = 'Pink',
  Black = 'Black',
  Gray = 'Gray',
  White = 'White',
}

export enum ColorLightnessModifier {
  Light = 'Light',
  Normal = 'Normal',
  Dark = 'Dark',
}

export function getBaseColorName(
  color: Color,
): { name: BaseColorName; lightness: ColorLightnessModifier } {
  const { h, s, l } = color.toHSL();

  if (s <= 10) {
    if (l <= 10) {
      return { name: BaseColorName.Black, lightness: ColorLightnessModifier.Normal };
    }
    if (l >= 90) {
      return { name: BaseColorName.White, lightness: ColorLightnessModifier.Normal };
    }
    return { name: BaseColorName.Gray, lightness: getLightnessModifier(l) };
  }

  const name = getHueName(h);
  const lightness = getLightnessModifier(l);
  return { name, lightness };
}

function getLightnessModifier(l: number): ColorLightnessModifier {
  if (l <= 30) {
    return ColorLightnessModifier.Dark;
  }
  if (l >= 70) {
    return ColorLightnessModifier.Light;
  }
  return ColorLightnessModifier.Normal;
}

function getHueName(h: number): BaseColorName {
  if (h < 15 || h >= 345) {
    return BaseColorName.Red;
  }
  if (h < 45) {
    return BaseColorName.Orange;
  }
  if (h < 75) {
    return BaseColorName.Yellow;
  }
  if (h < 165) {
    return BaseColorName.Green;
  }
  if (h < 255) {
    return BaseColorName.Blue;
  }
  if (h < 285) {
    return BaseColorName.Purple;
  }
  return BaseColorName.Pink;
}
