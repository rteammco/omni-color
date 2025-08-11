import { Color } from './color';

function clampLightness(l: number): number {
  return Math.min(100, Math.max(0, l));
}

export function brighten(color: Color, percentage = 10): Color {
  const hsla = color.toHSLA();
  hsla.l = clampLightness(hsla.l + percentage);
  return new Color(hsla);
}

export function darken(color: Color, percentage = 10): Color {
  return brighten(color, -percentage);
}
