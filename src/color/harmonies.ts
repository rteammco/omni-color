import { clampValue } from '../utils';
import { Color } from './color';
import { ColorHSL } from './formats';

// TODO: consider using LCH or OKLCH space mode for more human perceptual accuracy

export enum ColorHarmony {
  COMPLEMENTARY = 'Complementary',
  SPLIT_COMPLEMENTARY = 'Split Complementary',
  TRIADIC = 'Triadic',
  SQUARE = 'Square',
  TETRADIC = 'Tetradic',
  ANALOGOUS = 'Analogous',
  MONOCHROMATIC = 'Monochromatic',
}

function spinLightness(hsl: ColorHSL, degrees: number): Color {
  const normalized = ((degrees % 360) + 360) % 360;
  const distance = normalized > 180 ? 360 - normalized : normalized;
  const ratio = distance / 180;
  const complementL = 100 - hsl.l;
  const newL = clampValue(
    Math.round(hsl.l + (complementL - hsl.l) * ratio),
    0,
    100,
  );
  return new Color({ ...hsl, l: newL });
}

function spinHarmonyColor(color: Color, hsl: ColorHSL, degrees: number): Color {
  return hsl.s === 0 ? spinLightness(hsl, degrees) : color.spin(degrees);
}

export function getComplementaryColors(color: Color): [Color, Color] {
  const hsl = color.toHSL();
  return [color.clone(), spinHarmonyColor(color, hsl, 180)];
}

export function getSplitComplementaryColors(color: Color): [Color, Color, Color] {
  const hsl = color.toHSL();
  return [
    color.clone(),
    spinHarmonyColor(color, hsl, -150),
    spinHarmonyColor(color, hsl, 150),
  ];
}

export function getTriadicHarmonyColors(color: Color): [Color, Color, Color] {
  const hsl = color.toHSL();
  return [
    color.clone(),
    spinHarmonyColor(color, hsl, -120),
    spinHarmonyColor(color, hsl, 120),
  ];
}

export function getSquareHarmonyColors(color: Color): [Color, Color, Color, Color] {
  const hsl = color.toHSL();
  return [
    color.clone(),
    spinHarmonyColor(color, hsl, 90),
    spinHarmonyColor(color, hsl, 180),
    spinHarmonyColor(color, hsl, 270),
  ];
}

export function getTetradicHarmonyColors(color: Color): [Color, Color, Color, Color] {
  // TODO: tetradic harmonies can also be "wide" (120, 180, 300) or go in the other direction, or potentially any rectangle
  // e.g. #0000ff => #0000ff, #ff00ff, #ffff00, #00ff00
  // vs.  #0000ff => #0000ff, #00ffff, #ffff00, #ff0000
  const hsl = color.toHSL();
  return [
    color.clone(),
    spinHarmonyColor(color, hsl, 60),
    spinHarmonyColor(color, hsl, 180),
    spinHarmonyColor(color, hsl, 240),
  ];
}

export function getAnalogousHarmonyColors(color: Color): [Color, Color, Color, Color, Color] {
  // TODO: verify, because other libraries seem to have a slightly narrower angle
  const hsl = color.toHSL();
  return [
    color.clone(),
    spinHarmonyColor(color, hsl, -30),
    spinHarmonyColor(color, hsl, 30),
    spinHarmonyColor(color, hsl, -60),
    spinHarmonyColor(color, hsl, 60),
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

export function getHarmonyColors(color: Color, harmony: ColorHarmony): Color[] {
  switch (harmony) {
    case ColorHarmony.COMPLEMENTARY:
      return getComplementaryColors(color);
    case ColorHarmony.SPLIT_COMPLEMENTARY:
      return getSplitComplementaryColors(color);
    case ColorHarmony.TRIADIC:
      return getTriadicHarmonyColors(color);
    case ColorHarmony.SQUARE:
      return getSquareHarmonyColors(color);
    case ColorHarmony.TETRADIC:
      return getTetradicHarmonyColors(color);
    case ColorHarmony.ANALOGOUS:
      return getAnalogousHarmonyColors(color);
    case ColorHarmony.MONOCHROMATIC:
      return getMonochromaticHarmonyColors(color);
    default:
      throw new Error(`[getHarmonyColors] unknown color harmony: ${harmony}`);
  }
}
