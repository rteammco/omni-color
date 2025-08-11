import { Color } from './color';
import { CSS_COLOR_NAME_TO_HEX_MAP } from './color.constants';
import { toRGBA } from './conversions';
import type { ColorFormat, ColorHex, ColorRGBA } from './formats';

export function getRandomColorRGBA(): ColorRGBA {
  return {
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256),
    a: 1,
  };
}

export function getColorRGBAFromInput(color?: ColorFormat | string): ColorRGBA {
  if (typeof color === 'string') {
    if (color.startsWith('#')) {
      return toRGBA(color as ColorHex);
    }
    const namedColorHex = CSS_COLOR_NAME_TO_HEX_MAP[color.toLowerCase()];
    if (!namedColorHex) {
      throw new Error(`[getColorRGBAFromInput] unknown color name: "${color}"`);
    }
    return toRGBA(namedColorHex);
  }
  return color ? toRGBA(color) : getRandomColorRGBA();
}

export function spinColorHue(color: Color, degrees: number): Color {
  const hsl = color.toHSL();
  hsl.h = Math.floor((hsl.h + degrees) % 360);
  return new Color(hsl);
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
