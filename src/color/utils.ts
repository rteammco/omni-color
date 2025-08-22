import { Color } from './color';
import { CSS_COLOR_NAME_TO_HEX_MAP } from './color.constants';
import { toRGBA } from './conversions';
import type { ColorFormat, ColorHex, ColorRGBA } from './formats';
import { parseCSSColorFormatString } from './parse';
import { getRandomColorRGBA } from './random';

export function getColorRGBAFromInput(color?: ColorFormat | Color | string | null): ColorRGBA {
  if (color instanceof Color) {
    return color.toRGBA();
  }

  if (typeof color === 'string') {
    const trimmed = color.trim();

    // Hex string (e.g. "#ff0000"):
    if (trimmed.startsWith('#')) {
      return toRGBA(trimmed as ColorHex);
    }

    // Named color (e.g. "red"):
    const namedColorHex = CSS_COLOR_NAME_TO_HEX_MAP[trimmed
      .toLowerCase()
      .replace(/ /g, '')];
    if (namedColorHex) {
      return toRGBA(namedColorHex);
    }

    // Other CSS color format string (e.g. "rgb(255, 0, 0)"):
    const parsedColor = parseCSSColorFormatString(trimmed.toLowerCase());
    if (parsedColor) {
      return parsedColor.toRGBA();
    }

    throw new Error(`[getColorRGBAFromInput] unknown color name or format: "${color}"`);
  }

  return color ? toRGBA(color) : getRandomColorRGBA();
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
