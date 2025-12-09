import { type CaseInsensitive, clampValue } from '../utils';
import { Color } from './color';
import { CSS_COLOR_NAME_TO_HEX_MAP } from './color.constants';
import { toRGBA } from './conversions';
import type { ColorFormat, ColorHex, ColorRGBA } from './formats';
import type { ColorSwatch } from './swatch';

export type ValidColorInputFormat = Color | ColorFormat | string;
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

interface IsColorDarkWCAGOptions {
  /**
   * The algorithm to use for calculating darkness.
   * - 'WCAG': Uses WCAG 2.x Relative Luminance (linearized RGB). More accurate to human perception.
   * - 'YIQ': Uses the legacy Rec. 601 YIQ formula.
   * @default 'WCAG'
   */
  colorDarknessMode?: CaseInsensitive<'WCAG'>;
  /**
   * The threshold for considering a color "dark" when using the WCAG algorithm.
   * Range is [0, 1].
   * @default 0.179
   */
  wcagThreshold?: number;
  yiqThreshold?: never;
}

interface IsColorDarkYIQOptions {
  /**
   * The algorithm to use for calculating darkness.
   * - 'WCAG': Uses WCAG 2.x Relative Luminance (linearized RGB). More accurate to human perception.
   * - 'YIQ': Uses the legacy Rec. 601 YIQ formula.
   * @default 'WCAG'
   */
  colorDarknessMode: CaseInsensitive<'YIQ'>;
  wcagThreshold?: never;
  /**
   * The threshold for considering a color "dark" when using the YIQ algorithm.
   * Range is [0, 255].
   * @default 128
   */
  yiqThreshold?: number;
}

export type IsColorDarkOptions = IsColorDarkWCAGOptions | IsColorDarkYIQOptions;

function isColorDarkWCAG(color: Color, threshold: number): boolean {
  return getRelativeLuminance(color.toRGBA()) < threshold;
}

function isColorDarkYIQ(color: Color, threshold: number): boolean {
  // Weighted RGB luminance calculation:
  const { r, g, b } = color.toRGB();
  const brightness = (299 * r + 587 * g + 114 * b) / 1000;
  return brightness < threshold;
}

/**
 * Checks if a color is dark based on the specified algorithm and threshold.
 *
 * @param color - The color to check.
 * @param options - Optional {@link IsColorDarkOptions} to control the algorithm and threshold.
 * @returns `true` if the color is considered dark, `false` otherwise.
 */
export function isColorDark(color: Color, options: IsColorDarkOptions = {}): boolean {
  if (options.colorDarknessMode?.toUpperCase() === 'YIQ') {
    return isColorDarkYIQ(color, options.yiqThreshold ?? 128);
  }

  return isColorDarkWCAG(color, options.wcagThreshold ?? 0.179);
}

export function isColorOffWhite(color: Color): boolean {
  const { r, g, b } = color.toRGB();
  const brightness = (299 * r + 587 * g + 114 * b) / 1000;
  const maxChannel = Math.max(r, g, b);
  const minChannel = Math.min(r, g, b);
  return brightness >= 240 && maxChannel - minChannel <= 30;
}

const RGB_CHANNEL_EPSILON = 1e-6; // only allow near‑zero floating‑point drift
const ALPHA_EPSILON = 1e-6; // alpha values should match unless the difference is imperceptible floating‑point noise

function normalizeChannel(value: number): number {
  const rounded = Math.round(value);
  return Math.abs(value - rounded) <= RGB_CHANNEL_EPSILON ? rounded : value;
}

function normalizeAlpha(value: number): number {
  const rounded = Math.round(value * 1000) / 1000;
  return Math.abs(value - rounded) <= ALPHA_EPSILON ? rounded : value;
}

export function areColorsEqual(color1: Color, color2: Color): boolean {
  const c1 = color1.toRGBA();
  const c2 = color2.toRGBA();

  const r1 = normalizeChannel(c1.r);
  const g1 = normalizeChannel(c1.g);
  const b1 = normalizeChannel(c1.b);
  const r2 = normalizeChannel(c2.r);
  const g2 = normalizeChannel(c2.g);
  const b2 = normalizeChannel(c2.b);

  const a1 = normalizeAlpha(c1.a ?? 1);
  const a2 = normalizeAlpha(c2.a ?? 1);

  return r1 === r2 && g1 === g2 && b1 === b2 && Math.abs(a1 - a2) <= ALPHA_EPSILON;
}

function isColor(value: unknown): value is Color {
  return value instanceof Color;
}

export function getColorList(candidates: readonly ValidColorInputFormat[] | ColorSwatch): Color[] {
  if (Array.isArray(candidates)) {
    return candidates.map((candidate) => (isColor(candidate) ? candidate : new Color(candidate)));
  }

  return Object.values(candidates).filter(isColor);
}
