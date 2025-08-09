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
  const { h, l } = color.toHSL();
  let lightnessThreshold = 0.5;
  if (h >= 215 && h <= 280) {
    // blueish hues tend to feel a bit darker
    lightnessThreshold = 0.65;
  } else if (h >= 40 && h <= 190) {
    // yellowish hues tend to feel a bit brighter
    lightnessThreshold = 0.4;
  }

  return l <= lightnessThreshold;
}
