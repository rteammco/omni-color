import { Color } from './color';

// TODO: consider using LCH or OKLCH space mode for more human perceptual accuracy

function clamp(value: number, min = 0, max = 100): number {
  return Math.min(Math.max(value, min), max);
}

export function getComplementaryColors(color: Color): [Color, Color] {
  return [color.clone(), color.spin(180)];
}

export function getSplitComplementaryColors(color: Color): [Color, Color, Color] {
  return [color.clone(), color.spin(150), color.spin(-150)];
}

export function getTriadicHarmonyColors(color: Color): [Color, Color, Color] {
  return [color.clone(), color.spin(120), color.spin(-120)];
}

export function getTetradicHarmonyColors(
  color: Color,
): [Color, Color, Color, Color] {
  return [color.clone(), color.spin(60), color.spin(180), color.spin(240)];
}

export function getAnalogousHarmonyColors(color: Color): [Color, Color, Color] {
  return [color.clone(), color.spin(-30), color.spin(30)];
}

export function getMonochromaticHarmonyColors(
  color: Color,
): [Color, Color, Color, Color, Color] {
  const hsl = color.toHSL();
  const lighter = new Color({ ...hsl, l: clamp(hsl.l + 20) });
  const darker = new Color({ ...hsl, l: clamp(hsl.l - 20) });
  const saturated = new Color({ ...hsl, s: clamp(hsl.s + 20) });
  const desaturated = new Color({ ...hsl, s: clamp(hsl.s - 20) });
  return [color.clone(), lighter, darker, saturated, desaturated];
}
