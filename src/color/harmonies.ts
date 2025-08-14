import { getConstrainedValue } from '../utils';
import { Color } from './color';

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

export function getComplementaryColors(color: Color): [Color, Color] {
  return [color.clone(), color.spin(180)];
}

export function getSplitComplementaryColors(color: Color): [Color, Color, Color] {
  return [color.clone(), color.spin(-150), color.spin(150)];
}

export function getTriadicHarmonyColors(color: Color): [Color, Color, Color] {
  return [color.clone(), color.spin(-120), color.spin(120)];
}

export function getSquareHarmonyColors(color: Color): [Color, Color, Color, Color] {
  return [color.clone(), color.spin(90), color.spin(180), color.spin(270)];
}

export function getTetradicHarmonyColors(color: Color): [Color, Color, Color, Color] {
  // TODO: tetradic harmonies can also be "wide" (120, 180, 300) or go in the other direction, or potentially any rectangle
  // e.g. #0000ff => #0000ff, #ff00ff, #ffff00, #00ff00
  // vs.  #0000ff => #0000ff, #00ffff, #ffff00, #ff0000
  return [color.clone(), color.spin(60), color.spin(180), color.spin(240)];
}

export function getAnalogousHarmonyColors(color: Color): [Color, Color, Color, Color, Color] {
  // TODO: verify, because other libraries seem to have a slightly narrower angle
  return [color.clone(), color.spin(-30), color.spin(30), color.spin(-60), color.spin(60)];
}

export function getMonochromaticHarmonyColors(color: Color): [Color, Color, Color, Color, Color] {
  const hsl = color.toHSL();
  const lighter = new Color({ ...hsl, l: getConstrainedValue(hsl.l + 20, 0, 100) });
  const darker = new Color({ ...hsl, l: getConstrainedValue(hsl.l - 20, 0, 100) });
  const saturated = new Color({ ...hsl, s: getConstrainedValue(hsl.s + 20, 0, 100) });
  const desaturated = new Color({ ...hsl, s: getConstrainedValue(hsl.s - 20, 0, 100) });
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
