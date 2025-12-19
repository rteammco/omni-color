import { type CaseInsensitive, clampValue } from '../utils';
import { Color } from './color';
import type { ColorHSLA } from './formats';

// TODO: consider using LCH or OKLCH space mode for more human perceptual accuracy

export type ColorHarmony =
  | 'COMPLEMENTARY'
  | 'SPLIT_COMPLEMENTARY'
  | 'TRIADIC'
  | 'SQUARE'
  | 'TETRADIC'
  | 'ANALOGOUS'
  | 'MONOCHROMATIC';

export type GrayscaleHandlingMode = 'SPIN_LIGHTNESS' | 'IGNORE';

export interface ColorHarmonyOptions {
  grayscaleHandlingMode?: CaseInsensitive<GrayscaleHandlingMode>;
}

// "spins" lightness around grayscale degrees, where 0 is black and 180 is white, and
// everything in between is grayish. 180-360 loop back in the opposite direction.
// This is meant to handle grayscale colors with 0 saturation where spinning on hue does nothing.
function spinLightness(hsla: ColorHSLA, degrees: number): Color {
  const normalized = ((degrees % 360) + 360) % 360;
  const distance = normalized > 180 ? 360 - normalized : normalized;
  const ratio = distance / 180;
  const complementL = 100 - hsla.l;
  const newL = clampValue(Math.round(hsla.l + (complementL - hsla.l) * ratio), 0, 100);
  return new Color({ ...hsla, l: newL });
}

function spinColorOnHueOrLightness(
  color: Color,
  degrees: number,
  grayscaleHandlingMode: GrayscaleHandlingMode
): Color {
  const hsla = color.toHSLA();
  if (hsla.s === 0) {
    // If the color is grayscale (saturation 0), handle it based on the mode
    if (grayscaleHandlingMode === 'SPIN_LIGHTNESS') {
      return spinLightness(hsla, degrees);
    }
    return color.clone(); // No change for grayscale in IGNORE mode (treating the operation as undefined)
  }
  return color.spin(degrees);
}

function resolveGrayscaleHandlingMode({
  grayscaleHandlingMode,
}: ColorHarmonyOptions = {}): GrayscaleHandlingMode {
  if (!grayscaleHandlingMode) {
    return 'SPIN_LIGHTNESS';
  }
  return grayscaleHandlingMode.toUpperCase() as GrayscaleHandlingMode;
}

export function getComplementaryColors(
  color: Color,
  options?: ColorHarmonyOptions
): [Color, Color] {
  const grayscaleHandlingMode = resolveGrayscaleHandlingMode(options);
  return [color.clone(), spinColorOnHueOrLightness(color, 180, grayscaleHandlingMode)];
}

export function getSplitComplementaryColors(
  color: Color,
  options?: ColorHarmonyOptions
): [Color, Color, Color] {
  const grayscaleHandlingMode = resolveGrayscaleHandlingMode(options);
  return [
    color.clone(),
    spinColorOnHueOrLightness(color, -150, grayscaleHandlingMode),
    spinColorOnHueOrLightness(color, 150, grayscaleHandlingMode),
  ];
}

export function getTriadicHarmonyColors(
  color: Color,
  options?: ColorHarmonyOptions
): [Color, Color, Color] {
  const grayscaleHandlingMode = resolveGrayscaleHandlingMode(options);
  return [
    color.clone(),
    spinColorOnHueOrLightness(color, -120, grayscaleHandlingMode),
    spinColorOnHueOrLightness(color, 120, grayscaleHandlingMode),
  ];
}

export function getSquareHarmonyColors(
  color: Color,
  options?: ColorHarmonyOptions
): [Color, Color, Color, Color] {
  const grayscaleHandlingMode = resolveGrayscaleHandlingMode(options);
  return [
    color.clone(),
    spinColorOnHueOrLightness(color, 90, grayscaleHandlingMode),
    spinColorOnHueOrLightness(color, 180, grayscaleHandlingMode),
    spinColorOnHueOrLightness(color, 270, grayscaleHandlingMode),
  ];
}

export function getTetradicHarmonyColors(
  color: Color,
  options?: ColorHarmonyOptions
): [Color, Color, Color, Color] {
  const grayscaleHandlingMode = resolveGrayscaleHandlingMode(options);
  // TODO: tetradic harmonies can also be "wide" (120, 180, 300) or go in the other direction, or potentially any rectangle
  // e.g. #0000ff => #0000ff, #ff00ff, #ffff00, #00ff00
  // vs.  #0000ff => #0000ff, #00ffff, #ffff00, #ff0000
  return [
    color.clone(),
    spinColorOnHueOrLightness(color, 60, grayscaleHandlingMode),
    spinColorOnHueOrLightness(color, 180, grayscaleHandlingMode),
    spinColorOnHueOrLightness(color, 240, grayscaleHandlingMode),
  ];
}

export function getAnalogousHarmonyColors(
  color: Color,
  options?: ColorHarmonyOptions
): [Color, Color, Color, Color, Color] {
  const grayscaleHandlingMode = resolveGrayscaleHandlingMode(options);
  // TODO: verify, because other libraries seem to have a slightly narrower angle
  return [
    color.clone(),
    spinColorOnHueOrLightness(color, -30, grayscaleHandlingMode),
    spinColorOnHueOrLightness(color, 30, grayscaleHandlingMode),
    spinColorOnHueOrLightness(color, -60, grayscaleHandlingMode),
    spinColorOnHueOrLightness(color, 60, grayscaleHandlingMode),
  ];
}

export function getMonochromaticHarmonyColors(color: Color): [Color, Color, Color, Color, Color] {
  const hsla = color.toHSLA();
  const lighter = new Color({ ...hsla, l: clampValue(hsla.l + 20, 0, 100) });
  const darker = new Color({ ...hsla, l: clampValue(hsla.l - 20, 0, 100) });
  const saturated = new Color({ ...hsla, s: clampValue(hsla.s + 20, 0, 100) });
  const desaturated = new Color({ ...hsla, s: clampValue(hsla.s - 20, 0, 100) });
  return [color.clone(), lighter, darker, saturated, desaturated];
}

export function getHarmonyColors(
  color: Color,
  harmony: CaseInsensitive<ColorHarmony>,
  options?: ColorHarmonyOptions
): Color[] {
  switch (harmony.toUpperCase() as ColorHarmony) {
    case 'COMPLEMENTARY':
      return getComplementaryColors(color, options);
    case 'SPLIT_COMPLEMENTARY':
      return getSplitComplementaryColors(color, options);
    case 'TRIADIC':
      return getTriadicHarmonyColors(color, options);
    case 'SQUARE':
      return getSquareHarmonyColors(color, options);
    case 'TETRADIC':
      return getTetradicHarmonyColors(color, options);
    case 'ANALOGOUS':
      return getAnalogousHarmonyColors(color, options);
    case 'MONOCHROMATIC':
      return getMonochromaticHarmonyColors(color);
    default:
      throw new Error(`unknown color harmony: ${harmony}`);
  }
}
