import { type CaseInsensitive, clampValue } from '../utils';
import { resolveCaseInsensitiveOption, resolveRequiredCaseInsensitiveOption } from '../utils';
import type { Color, CreateColorInstance } from './color';
import type { ColorHSLA } from './formats';

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
function spinLightness(hsla: ColorHSLA, degrees: number, createColor: CreateColorInstance): Color {
  const normalized = ((degrees % 360) + 360) % 360;
  const distance = normalized > 180 ? 360 - normalized : normalized;
  const ratio = distance / 180;
  const complementL = 100 - hsla.l;
  const newL = clampValue(Math.round(hsla.l + (complementL - hsla.l) * ratio), 0, 100);
  return createColor({ ...hsla, l: newL });
}

function spinColorOnHueOrLightness(
  color: Color,
  degrees: number,
  grayscaleHandlingMode: GrayscaleHandlingMode,
  createColor: CreateColorInstance,
): Color {
  const hsla = color.toHSLA();
  if (hsla.s === 0) {
    // If the color is grayscale (saturation 0), handle it based on the mode
    if (grayscaleHandlingMode === 'SPIN_LIGHTNESS') {
      return spinLightness(hsla, degrees, createColor);
    }
    return color.clone(); // No change for grayscale in IGNORE mode (treating the operation as undefined)
  }
  return color.spin(degrees);
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
  color: Color,
  options: ColorHarmonyOptions = {},
  createColor: CreateColorInstance,
): [Color, Color] {
  const grayscaleHandlingMode = resolveGrayscaleHandlingMode(options);
  return [color.clone(), spinColorOnHueOrLightness(color, 180, grayscaleHandlingMode, createColor)];
}

export function getSplitComplementaryColors(
  color: Color,
  options: ColorHarmonyOptions = {},
  createColor: CreateColorInstance,
): [Color, Color, Color] {
  const grayscaleHandlingMode = resolveGrayscaleHandlingMode(options);
  return [
    color.clone(),
    spinColorOnHueOrLightness(color, -150, grayscaleHandlingMode, createColor),
    spinColorOnHueOrLightness(color, 150, grayscaleHandlingMode, createColor),
  ];
}

export function getTriadicHarmonyColors(
  color: Color,
  options: ColorHarmonyOptions = {},
  createColor: CreateColorInstance,
): [Color, Color, Color] {
  const grayscaleHandlingMode = resolveGrayscaleHandlingMode(options);
  return [
    color.clone(),
    spinColorOnHueOrLightness(color, -120, grayscaleHandlingMode, createColor),
    spinColorOnHueOrLightness(color, 120, grayscaleHandlingMode, createColor),
  ];
}

export function getSquareHarmonyColors(
  color: Color,
  options: ColorHarmonyOptions = {},
  createColor: CreateColorInstance,
): [Color, Color, Color, Color] {
  const grayscaleHandlingMode = resolveGrayscaleHandlingMode(options);
  return [
    color.clone(),
    spinColorOnHueOrLightness(color, 90, grayscaleHandlingMode, createColor),
    spinColorOnHueOrLightness(color, 180, grayscaleHandlingMode, createColor),
    spinColorOnHueOrLightness(color, 270, grayscaleHandlingMode, createColor),
  ];
}

export function getTetradicHarmonyColors(
  color: Color,
  options: ColorHarmonyOptions = {},
  createColor: CreateColorInstance,
): [Color, Color, Color, Color] {
  const grayscaleHandlingMode = resolveGrayscaleHandlingMode(options);
  // TODO: tetradic harmonies can also be "wide" (120, 180, 300) or go in the other direction, or potentially any rectangle
  // e.g. #0000ff => #0000ff, #ff00ff, #ffff00, #00ff00
  // vs.  #0000ff => #0000ff, #00ffff, #ffff00, #ff0000
  return [
    color.clone(),
    spinColorOnHueOrLightness(color, 60, grayscaleHandlingMode, createColor),
    spinColorOnHueOrLightness(color, 180, grayscaleHandlingMode, createColor),
    spinColorOnHueOrLightness(color, 240, grayscaleHandlingMode, createColor),
  ];
}

export function getAnalogousHarmonyColors(
  color: Color,
  options: ColorHarmonyOptions = {},
  createColor: CreateColorInstance,
): [Color, Color, Color, Color, Color] {
  const grayscaleHandlingMode = resolveGrayscaleHandlingMode(options);
  // TODO: verify, because other libraries seem to have a slightly narrower angle
  return [
    color.clone(),
    spinColorOnHueOrLightness(color, -30, grayscaleHandlingMode, createColor),
    spinColorOnHueOrLightness(color, 30, grayscaleHandlingMode, createColor),
    spinColorOnHueOrLightness(color, -60, grayscaleHandlingMode, createColor),
    spinColorOnHueOrLightness(color, 60, grayscaleHandlingMode, createColor),
  ];
}

export function getMonochromaticHarmonyColors(
  color: Color,
  createColor: CreateColorInstance,
): [Color, Color, Color, Color, Color] {
  const hsla = color.toHSLA();
  const lighter = createColor({ ...hsla, l: clampValue(hsla.l + 20, 0, 100) });
  const darker = createColor({ ...hsla, l: clampValue(hsla.l - 20, 0, 100) });
  const saturated = createColor({ ...hsla, s: clampValue(hsla.s + 20, 0, 100) });
  const desaturated = createColor({ ...hsla, s: clampValue(hsla.s - 20, 0, 100) });
  return [color.clone(), lighter, darker, saturated, desaturated];
}

export function getHarmonyColors(
  color: Color,
  harmony: CaseInsensitive<ColorHarmony>,
  options: ColorHarmonyOptions = {},
  createColor: CreateColorInstance,
): Color[] {
  const resolvedHarmony = resolveRequiredCaseInsensitiveOption({
    allowedValues: COLOR_HARMONIES,
    key: 'harmony',
    options: { harmony },
  });

  switch (resolvedHarmony) {
    case 'COMPLEMENTARY':
      return getComplementaryColors(color, options, createColor);
    case 'SPLIT_COMPLEMENTARY':
      return getSplitComplementaryColors(color, options, createColor);
    case 'TRIADIC':
      return getTriadicHarmonyColors(color, options, createColor);
    case 'SQUARE':
      return getSquareHarmonyColors(color, options, createColor);
    case 'TETRADIC':
      return getTetradicHarmonyColors(color, options, createColor);
    case 'ANALOGOUS':
      return getAnalogousHarmonyColors(color, options, createColor);
    case 'MONOCHROMATIC':
      return getMonochromaticHarmonyColors(color, createColor);
    default:
      throw new Error(`unknown color harmony: ${harmony}`);
  }
}
