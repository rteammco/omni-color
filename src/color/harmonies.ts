import { Color } from './color';

// TODO: consider using LCH or OKLCH space mode for more human perceptual accuracy

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

function clampValue0To100(value: number): number {
  return Math.min(Math.max(value, 0), 100);
}

export function getMonochromaticHarmonyColors(color: Color): [Color, Color, Color, Color, Color] {
  const hsl = color.toHSL();
  const lighter = new Color({ ...hsl, l: clampValue0To100(hsl.l + 20) });
  const darker = new Color({ ...hsl, l: clampValue0To100(hsl.l - 20) });
  const saturated = new Color({ ...hsl, s: clampValue0To100(hsl.s + 20) });
  const desaturated = new Color({ ...hsl, s: clampValue0To100(hsl.s - 20) });
  return [color.clone(), lighter, darker, saturated, desaturated];
}
