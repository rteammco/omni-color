import { Color } from './color';

export function brightenColor(color: Color, percentage = 10): Color {
  const hsla = color.toHSLA();
  hsla.l = Math.min(100, Math.max(0, hsla.l + percentage));
  return new Color(hsla);
}

export function darkenColor(color: Color, percentage = 10): Color {
  return brightenColor(color, -percentage);
}
