import { type CaseInsensitive, clampValue } from '../utils';
import { resolveCaseInsensitiveOption, resolveRequiredCaseInsensitiveOption } from '../utils';
import { toHSLA, toRGBA } from './conversions';
import type { ColorHSLA, ColorRGBA } from './formats.types';
import { spinColorHue } from './manipulations';

// TODO: consider using LCH or OKLCH space mode for more human perceptual accuracy

const GRAYSCALE_HANDLING_MODES = ['SPIN_LIGHTNESS', 'IGNORE'] as const;
export type GrayscaleHandlingMode = (typeof GRAYSCALE_HANDLING_MODES)[number];

const COLOR_HARMONIES = [
  'COMPLEMENTARY',
  'SPLIT_COMPLEMENTARY',
  'TRIADIC',
  'SQUARE',
  'TETRADIC',
  'ANALOGOUS',
  'MONOCHROMATIC',
] as const;
export type ColorHarmony = (typeof COLOR_HARMONIES)[number];

export interface ColorHarmonyOptions {
  grayscaleHandlingMode?: CaseInsensitive<GrayscaleHandlingMode>;
}

// "spins" lightness around grayscale degrees, where 0 is black and 180 is white, and
// everything in between is grayish. 180-360 loop back in the opposite direction.
// This is meant to handle grayscale colors with 0 saturation where spinning on hue does nothing.
function spinLightness(hsla: ColorHSLA, degrees: number): ColorRGBA {
  const normalized = ((degrees % 360) + 360) % 360;
  const distance = normalized > 180 ? 360 - normalized : normalized;
  const ratio = distance / 180;
  const complementL = 100 - hsla.l;
  const newL = clampValue(Math.round(hsla.l + (complementL - hsla.l) * ratio), 0, 100);
  return toRGBA({ ...hsla, l: newL });
}

function spinColorOnHueOrLightness(
  rgba: Readonly<ColorRGBA>,
  degrees: number,
  grayscaleHandlingMode: GrayscaleHandlingMode,
): ColorRGBA {
  const hsla = toHSLA(rgba);
  if (hsla.s === 0) {
    // If the color is grayscale (saturation 0), handle it based on the mode
    if (grayscaleHandlingMode === 'SPIN_LIGHTNESS') {
      return spinLightness(hsla, degrees);
    }
    return { ...rgba }; // No change for grayscale in IGNORE mode (treating the operation as undefined)
  }
  return spinColorHue(rgba, degrees);
}

function resolveGrayscaleHandlingMode(options: ColorHarmonyOptions): GrayscaleHandlingMode {
  return resolveCaseInsensitiveOption({
    allowedValues: GRAYSCALE_HANDLING_MODES,
    defaultValue: 'SPIN_LIGHTNESS',
    key: 'grayscaleHandlingMode',
    options,
  });
}

export function getComplementaryColors(
  rgba: Readonly<ColorRGBA>,
  options: ColorHarmonyOptions = {},
): [ColorRGBA, ColorRGBA] {
  const grayscaleHandlingMode = resolveGrayscaleHandlingMode(options);
  return [{ ...rgba }, spinColorOnHueOrLightness(rgba, 180, grayscaleHandlingMode)];
}

export function getSplitComplementaryColors(
  rgba: Readonly<ColorRGBA>,
  options: ColorHarmonyOptions = {},
): [ColorRGBA, ColorRGBA, ColorRGBA] {
  const grayscaleHandlingMode = resolveGrayscaleHandlingMode(options);
  return [
    { ...rgba },
    spinColorOnHueOrLightness(rgba, -150, grayscaleHandlingMode),
    spinColorOnHueOrLightness(rgba, 150, grayscaleHandlingMode),
  ];
}

export function getTriadicHarmonyColors(
  rgba: Readonly<ColorRGBA>,
  options: ColorHarmonyOptions = {},
): [ColorRGBA, ColorRGBA, ColorRGBA] {
  const grayscaleHandlingMode = resolveGrayscaleHandlingMode(options);
  return [
    { ...rgba },
    spinColorOnHueOrLightness(rgba, -120, grayscaleHandlingMode),
    spinColorOnHueOrLightness(rgba, 120, grayscaleHandlingMode),
  ];
}

export function getSquareHarmonyColors(
  rgba: Readonly<ColorRGBA>,
  options: ColorHarmonyOptions = {},
): [ColorRGBA, ColorRGBA, ColorRGBA, ColorRGBA] {
  const grayscaleHandlingMode = resolveGrayscaleHandlingMode(options);
  return [
    { ...rgba },
    spinColorOnHueOrLightness(rgba, 90, grayscaleHandlingMode),
    spinColorOnHueOrLightness(rgba, 180, grayscaleHandlingMode),
    spinColorOnHueOrLightness(rgba, 270, grayscaleHandlingMode),
  ];
}

export type TetradicHarmonyDirection = 'CLOCKWISE' | 'COUNTERCLOCKWISE';
export interface TetradicHarmonyOptions extends ColorHarmonyOptions {
  /**
   * Direction used for tetradic hue spins.
   *
   * - CLOCKWISE: +60, +180, +240
   * - COUNTERCLOCKWISE: -60, -180, -240
   *
   * Defaults to CLOCKWISE.
   */
  direction?: CaseInsensitive<TetradicHarmonyDirection>;
}

export function getTetradicHarmonyColors(
  rgba: Readonly<ColorRGBA>,
  options: TetradicHarmonyOptions = {},
): [ColorRGBA, ColorRGBA, ColorRGBA, ColorRGBA] {
  const grayscaleHandlingMode = resolveGrayscaleHandlingMode(options);
  const direction = resolveCaseInsensitiveOption({
    allowedValues: ['CLOCKWISE', 'COUNTERCLOCKWISE'],
    defaultValue: 'CLOCKWISE',
    key: 'direction',
    options,
  });

  const spinValues = direction === 'CLOCKWISE' ? [60, 180, 240] : [-60, -180, -240];

  return [
    { ...rgba },
    spinColorOnHueOrLightness(rgba, spinValues[0], grayscaleHandlingMode),
    spinColorOnHueOrLightness(rgba, spinValues[1], grayscaleHandlingMode),
    spinColorOnHueOrLightness(rgba, spinValues[2], grayscaleHandlingMode),
  ];
}

export function getAnalogousHarmonyColors(
  rgba: Readonly<ColorRGBA>,
  options: ColorHarmonyOptions = {},
): [ColorRGBA, ColorRGBA, ColorRGBA, ColorRGBA, ColorRGBA] {
  const grayscaleHandlingMode = resolveGrayscaleHandlingMode(options);
  // TODO: verify, because other libraries seem to have a slightly narrower angle
  return [
    { ...rgba },
    spinColorOnHueOrLightness(rgba, -30, grayscaleHandlingMode),
    spinColorOnHueOrLightness(rgba, 30, grayscaleHandlingMode),
    spinColorOnHueOrLightness(rgba, -60, grayscaleHandlingMode),
    spinColorOnHueOrLightness(rgba, 60, grayscaleHandlingMode),
  ];
}

export function getMonochromaticHarmonyColors(
  rgba: Readonly<ColorRGBA>,
): [ColorRGBA, ColorRGBA, ColorRGBA, ColorRGBA, ColorRGBA] {
  const hsla = toHSLA(rgba);
  const lighter = toRGBA({ ...hsla, l: clampValue(hsla.l + 20, 0, 100) });
  const darker = toRGBA({ ...hsla, l: clampValue(hsla.l - 20, 0, 100) });
  const saturated = toRGBA({ ...hsla, s: clampValue(hsla.s + 20, 0, 100) });
  const desaturated = toRGBA({ ...hsla, s: clampValue(hsla.s - 20, 0, 100) });
  return [{ ...rgba }, lighter, darker, saturated, desaturated];
}

export function getHarmonyColors(
  rgba: Readonly<ColorRGBA>,
  harmony: CaseInsensitive<ColorHarmony>,
  options: ColorHarmonyOptions = {},
): ColorRGBA[] {
  const resolvedHarmony = resolveRequiredCaseInsensitiveOption({
    allowedValues: COLOR_HARMONIES,
    key: 'harmony',
    options: { harmony },
  });

  switch (resolvedHarmony) {
    case 'COMPLEMENTARY':
      return getComplementaryColors(rgba, options);
    case 'SPLIT_COMPLEMENTARY':
      return getSplitComplementaryColors(rgba, options);
    case 'TRIADIC':
      return getTriadicHarmonyColors(rgba, options);
    case 'SQUARE':
      return getSquareHarmonyColors(rgba, options);
    case 'TETRADIC':
      return getTetradicHarmonyColors(rgba, options);
    case 'ANALOGOUS':
      return getAnalogousHarmonyColors(rgba, options);
    case 'MONOCHROMATIC':
      return getMonochromaticHarmonyColors(rgba);
    default:
      throw new Error(`unknown color harmony: ${harmony}`);
  }
}
