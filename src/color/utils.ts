import { type CaseInsensitive, resolveCaseInsensitiveOption } from '../utils';
import { CSS_COLOR_NAME_TO_HEX_MAP } from './color.consts';
import { toRGBA } from './conversions';
import type { ColorFormat, ColorHex, ColorRGBA } from './formats.types';
import { parseCSSColorFormatString } from './parse';
import { getRandomColorRGBA } from './random';
import { srgbChannelToLinear } from './srgb';
import { getColorFromTemperatureLabel, matchPartialColorTemperatureLabel } from './temperature';

export function getColorRGBAFromInput(color: ColorFormat | string | null | undefined): ColorRGBA {
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
      return getColorFromTemperatureLabel(matchedColorTemperatureLabel);
    }

    // Other CSS color format string (e.g. "rgb(255, 0, 0)"):
    const parsedColor = parseCSSColorFormatString(colorString);
    if (parsedColor) {
      return parsedColor;
    }

    throw new Error(`unknown color name or format: "${color}"`);
  }

  return color ? toRGBA(color) : getRandomColorRGBA();
}

export function getRelativeLuminance(rgb: Readonly<ColorRGBA>): number {
  const r = srgbChannelToLinear(rgb.r, 'WCAG');
  const g = srgbChannelToLinear(rgb.g, 'WCAG');
  const b = srgbChannelToLinear(rgb.b, 'WCAG');
  return 0.2126 * r + 0.7152 * g + 0.0722 * b; // standard luminance formula
}

/**
 * The algorithm mode to use for calculating if a color is dark.
 */
const COLOR_DARKNESS_MODES = ['WCAG', 'YIQ'] as const;
export type ColorDarknessMode = (typeof COLOR_DARKNESS_MODES)[number];

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

function isColorDarkWCAG(rgba: Readonly<ColorRGBA>, threshold: number): boolean {
  return getRelativeLuminance(rgba) < threshold;
}

function isColorDarkYIQ(rgba: Readonly<ColorRGBA>, threshold: number): boolean {
  // Weighted RGB luminance calculation:
  const { r, g, b } = rgba;
  const brightness = (299 * r + 587 * g + 114 * b) / 1000;
  return brightness < threshold;
}

// Checks if a color is dark based on the specified algorithm and threshold.
export function isColorDark(rgba: Readonly<ColorRGBA>, options: IsColorDarkOptions = {}): boolean {
  const colorDarknessMode = resolveCaseInsensitiveOption({
    allowedValues: COLOR_DARKNESS_MODES,
    defaultValue: 'WCAG',
    key: 'colorDarknessMode',
    options,
  });

  if (colorDarknessMode === 'YIQ') {
    return isColorDarkYIQ(rgba, options.yiqThreshold ?? 128);
  }

  return isColorDarkWCAG(rgba, options.wcagThreshold ?? 0.179);
}

export function isColorOffWhite(rgba: Readonly<ColorRGBA>): boolean {
  const { r, g, b } = rgba;
  const brightness = (299 * r + 587 * g + 114 * b) / 1000;
  const maxChannel = Math.max(r, g, b);
  const minChannel = Math.min(r, g, b);
  return brightness >= 240 && maxChannel - minChannel <= 30;
}

const RGB_CHANNEL_EPSILON = 1e-2; // allow minor floating‑point drift on RGB channels
const ALPHA_EPSILON = 1e-6; // alpha values should match unless the difference is imperceptible floating‑point noise

function normalizeChannel(value: number): number {
  const rounded = Math.round(value);
  return Math.abs(value - rounded) <= RGB_CHANNEL_EPSILON ? rounded : value;
}

function normalizeAlpha(value: number): number {
  const rounded = Math.round(value * 1000) / 1000;
  return Math.abs(value - rounded) <= ALPHA_EPSILON ? rounded : value;
}

export function areColorsEqual(color1: Readonly<ColorRGBA>, color2: Readonly<ColorRGBA>): boolean {
  const r1 = normalizeChannel(color1.r);
  const g1 = normalizeChannel(color1.g);
  const b1 = normalizeChannel(color1.b);
  const r2 = normalizeChannel(color2.r);
  const g2 = normalizeChannel(color2.g);
  const b2 = normalizeChannel(color2.b);

  const a1 = normalizeAlpha(color1.a);
  const a2 = normalizeAlpha(color2.a);

  return r1 === r2 && g1 === g2 && b1 === b2 && Math.abs(a1 - a2) <= ALPHA_EPSILON;
}
