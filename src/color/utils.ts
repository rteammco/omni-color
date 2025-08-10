import { Color } from './color';
import { ColorRGBA } from './formats';

export function getRandomColorRGBA(): ColorRGBA {
  return {
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256),
    a: 1,
  };
}

export function isColorDark(color: Color): boolean {
  const { r, g, b } = color.toRGB();
  const brightness = (299 * r + 587 * g + 114 * b) / 1000;
  if (brightness >= 120 && brightness < 128) {
    if (r > g && r > b && g > 0 && b > 0) {
      return false;
    }
  }
  return brightness < 128;
}
