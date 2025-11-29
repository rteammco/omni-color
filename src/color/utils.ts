import { clampValue } from '../utils';
import { Color } from './color';
import { CSS_COLOR_NAME_TO_HEX_MAP } from './color.constants';
import { toRGBA } from './conversions';
import type { ColorFormat, ColorHex, ColorRGBA } from './formats';
import { parseCSSColorFormatString } from './parse';
import { getRandomColorRGBA } from './random';
import { getColorFromTemperatureLabel, matchPartialColorTemperatureLabel } from './temperature';

export function getColorRGBAFromInput(color?: ColorFormat | Color | string | null): ColorRGBA {
  if (color instanceof Color) {
    return color.toRGBA();
  }

  if (typeof color === 'string') {
    const colorString = color.trim().toLowerCase();

    // Hex string (e.g. "#ff0000"):
    if (colorString.startsWith('#')) {
      return toRGBA(colorString as ColorHex);
    }

    // Named color (e.g. "red"):
    const namedColorHex = CSS_COLOR_NAME_TO_HEX_MAP[colorString.replace(/ /g, '')];
    if (namedColorHex) {
      return toRGBA(namedColorHex);
    }

    const matchedColorTemperatureLabel = matchPartialColorTemperatureLabel(colorString);
    if (matchedColorTemperatureLabel) {
      return getColorFromTemperatureLabel(matchedColorTemperatureLabel).toRGBA();
    }

    // Other CSS color format string (e.g. "rgb(255, 0, 0)"):
    const parsedColor = parseCSSColorFormatString(colorString);
    if (parsedColor) {
      return parsedColor.toRGBA();
    }

    throw new Error(`unknown color name or format: "${color}"`);
  }

  return color ? toRGBA(color) : getRandomColorRGBA();
}

const RGB_CHANNEL_MAX_VALUE = 255; // 8‑bit channel ceiling
const SRGB_LINEAR_SEGMENT_DIVISOR = 12.92; // slope for low‑intensity segment
const SRGB_GAMMA_OFFSET = 0.055; // additive term in sRGB gamma curve
const SRGB_GAMMA_SCALE = 1.055; // multiplicative term in sRGB gamma curve
const SRGB_GAMMA_EXPONENT = 2.4; // exponent in sRGB transfer function

const SRGB_GAMMA_PIVOT_OPTIONS = {
  SRGB: 0.04045,
  WCAG: 0.03928,
} as const;

type SrgbGammaPivot = keyof typeof SRGB_GAMMA_PIVOT_OPTIONS;

// Does a gamma correction by converting the given sRGB channel value (0 to 255)
// to a linear RGB channel value (0 to 1).
export function srgbChannelToLinear(srgbChannelVal: number, pivot: SrgbGammaPivot): number {
  const c = clampValue(srgbChannelVal, 0, RGB_CHANNEL_MAX_VALUE) / RGB_CHANNEL_MAX_VALUE; // normalize
  let result: number;
  if (c <= SRGB_GAMMA_PIVOT_OPTIONS[pivot]) {
    result = c / SRGB_LINEAR_SEGMENT_DIVISOR; // linear portion for dark colors
  } else {
    result = Math.pow((c + SRGB_GAMMA_OFFSET) / SRGB_GAMMA_SCALE, SRGB_GAMMA_EXPONENT); // gamma correction for brighter colors
  }
  return clampValue(result, 0, 1);
}

// Inverts `srgbChannelToLinear()`. Takes a linearized channel value (0 to 1) and returns
// the original sRGB channel value (0 to 255).
export function linearChannelToSrgb(linearChannelVal: number, pivot: SrgbGammaPivot): number {
  const c = clampValue(linearChannelVal, 0, 1);
  const threshold = SRGB_GAMMA_PIVOT_OPTIONS[pivot] / SRGB_LINEAR_SEGMENT_DIVISOR;
  let result: number;
  if (c > threshold) {
    result = SRGB_GAMMA_SCALE * Math.pow(c, 1 / SRGB_GAMMA_EXPONENT) - SRGB_GAMMA_OFFSET;
  } else {
    result = c * SRGB_LINEAR_SEGMENT_DIVISOR;
  }
  return clampValue(result * RGB_CHANNEL_MAX_VALUE, 0, RGB_CHANNEL_MAX_VALUE);
}

export function getRelativeLuminance(rgb: ColorRGBA): number {
  const r = srgbChannelToLinear(rgb.r, 'WCAG');
  const g = srgbChannelToLinear(rgb.g, 'WCAG');
  const b = srgbChannelToLinear(rgb.b, 'WCAG');
  return 0.2126 * r + 0.7152 * g + 0.0722 * b; // standard luminance formula
}

/**
 * The algorithm mode to use for calculating if a color is dark.
 */
export type ColorDarknessMode = 'WCAG' | 'YIQ';

export type IsColorDarkOptions =
  | {
      /**
       * The algorithm to use for calculating darkness.
       * - 'WCAG': Uses WCAG 2.x Relative Luminance (linearized RGB). More accurate to human perception.
       * - 'YIQ': Uses the legacy Rec. 601 YIQ formula. Matches TinyColor behavior.
       * @default 'WCAG'
       */
      colorDarknessMode?: 'WCAG';
      /**
       * The threshold for considering a color "dark" when using the WCAG algorithm.
       * Range is [0, 1].
       * @default 0.179
       */
      wcagThreshold?: number;
      yiqThreshold?: never;
    }
  | {
      /**
       * The algorithm to use for calculating darkness.
       * - 'WCAG': Uses WCAG 2.x Relative Luminance (linearized RGB). More accurate to human perception.
       * - 'YIQ': Uses the legacy Rec. 601 YIQ formula. Matches TinyColor behavior.
       * @default 'WCAG'
       */
      colorDarknessMode: 'YIQ';
      wcagThreshold?: never;
      /**
       * The threshold for considering a color "dark" when using the YIQ algorithm.
       * Range is [0, 255].
       * @default 128
       */
      yiqThreshold?: number;
    };

/**
 * Checks if a color is dark based on the specified algorithm and threshold.
 *
 * @param color - The color to check.
 * @param options - Optional {@link IsColorDarkOptions} to control the algorithm and threshold.
 * @returns `true` if the color is considered dark, `false` otherwise.
 */
export function isColorDark(color: Color, options: IsColorDarkOptions = {}): boolean {
  const { colorDarknessMode = 'WCAG' } = options;

  if (colorDarknessMode === 'WCAG') {
    const { wcagThreshold = 0.179 } = options;
    return getRelativeLuminance(color.toRGBA()) < wcagThreshold;
  }

  const { yiqThreshold = 128 } = options;
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
  return brightness < yiqThreshold;
}

export function isColorOffWhite(color: Color): boolean {
  const { r, g, b } = color.toRGB();
  const brightness = (299 * r + 587 * g + 114 * b) / 1000;
  const maxChannel = Math.max(r, g, b);
  const minChannel = Math.min(r, g, b);
  return brightness >= 240 && maxChannel - minChannel <= 30;
}

const RGB_CHANNEL_EPSILON = 1; // allow off‑by‑one rounding differences
const ALPHA_EPSILON = 0.0015; // alpha values are rounded to three decimals and may have floating‑point error

export function areColorsEqual(color1: Color, color2: Color): boolean {
  const c1 = color1.toRGBA();
  const c2 = color2.toRGBA();

  return (
    Math.abs(c1.r - c2.r) <= RGB_CHANNEL_EPSILON &&
    Math.abs(c1.g - c2.g) <= RGB_CHANNEL_EPSILON &&
    Math.abs(c1.b - c2.b) <= RGB_CHANNEL_EPSILON &&
    Math.abs((c1.a ?? 1) - (c2.a ?? 1)) <= ALPHA_EPSILON
  );
}
