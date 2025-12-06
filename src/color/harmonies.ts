import { type CaseInsensitive, clampValue } from '../utils';
import { Color } from './color';
import type { ColorHSL } from './formats';

// TODO: consider using LCH or OKLCH space mode for more human perceptual accuracy

export type ColorHarmony =
  | 'COMPLEMENTARY'
  | 'SPLIT_COMPLEMENTARY'
  | 'TRIADIC'
  | 'SQUARE'
  | 'TETRADIC'
  | 'ANALOGOUS'
  | 'MONOCHROMATIC';

type GrayscaleHandlingMode = 'SPIN_LIGHTNESS' | 'IGNORE';

// "spins" lightness around grayscale degrees, where 0 is black and 180 is white, and
// everything in between is grayish. 180-360 loop back in the opposite direction.
// This is meant to handle grayscale colors with 0 saturation where spinning on hue does nothing.
function spinLightness(hsl: ColorHSL, degrees: number): Color {
  const normalized = ((degrees % 360) + 360) % 360;
  const distance = normalized > 180 ? 360 - normalized : normalized;
  const ratio = distance / 180;
  const complementL = 100 - hsl.l;
  const newL = clampValue(Math.round(hsl.l + (complementL - hsl.l) * ratio), 0, 100);
  return new Color({ ...hsl, l: newL });
}

function spinColorOnHueOrLightness(
  color: Color,
  degrees: number,
  grayscaleHandlingMode: GrayscaleHandlingMode
): Color {
  const hsl = color.toHSL();
  if (hsl.s === 0) {
    // If the color is grayscale (saturation 0), handle it based on the mode
    if (grayscaleHandlingMode === 'SPIN_LIGHTNESS') {
      return spinLightness(hsl, degrees);
    }
    return color.clone(); // No change for grayscale in IGNORE mode (treating the operation as undefined)
  }
  return color.spin(degrees);
}

export function getComplementaryColors(
  color: Color,
  grayscaleHandlingMode: GrayscaleHandlingMode = 'SPIN_LIGHTNESS'
): [Color, Color] {
  return [color.clone(), spinColorOnHueOrLightness(color, 180, grayscaleHandlingMode)];
}

export function getSplitComplementaryColors(
  color: Color,
  grayscaleHandlingMode: GrayscaleHandlingMode = 'SPIN_LIGHTNESS'
): [Color, Color, Color] {
  return [
    color.clone(),
    spinColorOnHueOrLightness(color, -150, grayscaleHandlingMode),
    spinColorOnHueOrLightness(color, 150, grayscaleHandlingMode),
  ];
}

export function getTriadicHarmonyColors(
  color: Color,
  grayscaleHandlingMode: GrayscaleHandlingMode = 'SPIN_LIGHTNESS'
): [Color, Color, Color] {
  return [
    color.clone(),
    spinColorOnHueOrLightness(color, -120, grayscaleHandlingMode),
    spinColorOnHueOrLightness(color, 120, grayscaleHandlingMode),
  ];
}

export function getSquareHarmonyColors(
  color: Color,
  grayscaleHandlingMode: GrayscaleHandlingMode = 'SPIN_LIGHTNESS'
): [Color, Color, Color, Color] {
  return [
    color.clone(),
    spinColorOnHueOrLightness(color, 90, grayscaleHandlingMode),
    spinColorOnHueOrLightness(color, 180, grayscaleHandlingMode),
    spinColorOnHueOrLightness(color, 270, grayscaleHandlingMode),
  ];
}

export function getTetradicHarmonyColors(
  color: Color,
  grayscaleHandlingMode: GrayscaleHandlingMode = 'SPIN_LIGHTNESS'
): [Color, Color, Color, Color] {
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
  grayscaleHandlingMode: GrayscaleHandlingMode = 'SPIN_LIGHTNESS'
): [Color, Color, Color, Color, Color] {
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
  const hsl = color.toHSL();
  const lighter = new Color({ ...hsl, l: clampValue(hsl.l + 20, 0, 100) });
  const darker = new Color({ ...hsl, l: clampValue(hsl.l - 20, 0, 100) });
  const saturated = new Color({ ...hsl, s: clampValue(hsl.s + 20, 0, 100) });
  const desaturated = new Color({ ...hsl, s: clampValue(hsl.s - 20, 0, 100) });
  return [color.clone(), lighter, darker, saturated, desaturated];
}

export function getHarmonyColors(
  color: Color,
  harmony: CaseInsensitive<ColorHarmony>,
  grayscaleHandlingMode: CaseInsensitive<GrayscaleHandlingMode> = 'SPIN_LIGHTNESS'
): Color[] {
  const mode = grayscaleHandlingMode.toUpperCase() as GrayscaleHandlingMode;

  switch (harmony.toUpperCase()) {
    case 'COMPLEMENTARY':
      return getComplementaryColors(color, mode);
    case 'SPLIT_COMPLEMENTARY':
      return getSplitComplementaryColors(color, mode);
    case 'TRIADIC':
      return getTriadicHarmonyColors(color, mode);
    case 'SQUARE':
      return getSquareHarmonyColors(color, mode);
    case 'TETRADIC':
      return getTetradicHarmonyColors(color, mode);
    case 'ANALOGOUS':
      return getAnalogousHarmonyColors(color, mode);
    case 'MONOCHROMATIC':
      return getMonochromaticHarmonyColors(color);
    default:
      throw new Error(`unknown color harmony: ${harmony}`);
  }
}
