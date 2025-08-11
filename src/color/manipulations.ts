import { Color } from './color';

export function spinColorHue(color: Color, degrees: number): Color {
  const hsl = color.toHSL();
  let rotatedHue = Math.floor((hsl.h + degrees) % 360);
  if (rotatedHue < 0) {
    rotatedHue += 360; // ensure hue is always positive
  }
  hsl.h = rotatedHue;
  return new Color(hsl);
}

export function brightenColor(color: Color, percentage = 10): Color {
  const hsla = color.toHSLA();
  hsla.l = Math.min(100, Math.max(0, hsla.l + percentage));
  return new Color(hsla);
}

export function darkenColor(color: Color, percentage = 10): Color {
  return brightenColor(color, -percentage);
}
