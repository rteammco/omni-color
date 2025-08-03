import { ColorFormat, ColorRGBA } from './formats';
import { isValidHexColor } from './validations';

function hexToRGBA(hex: string): ColorRGBA {
  if (!isValidHexColor(hex)) {
    throw new Error(`Invalid hex color: "${hex}"`);
  }

  const raw = hex.replace(/^#/, '');

  let r = 0;
  let g = 0;
  let b = 0;
  let a = 255; // conversion to 0-1 below

  if (raw.length === 3) {
    r = parseInt(raw[0] + raw[0], 16);
    g = parseInt(raw[1] + raw[1], 16);
    b = parseInt(raw[2] + raw[2], 16);
  } else if (raw.length === 6) {
    r = parseInt(raw.slice(0, 2), 16);
    g = parseInt(raw.slice(2, 4), 16);
    b = parseInt(raw.slice(4, 6), 16);
  } else if (raw.length === 8) {
    r = parseInt(raw.slice(0, 2), 16);
    g = parseInt(raw.slice(2, 4), 16);
    b = parseInt(raw.slice(4, 6), 16);
    a = parseInt(raw.slice(6, 8), 16);
  }

  return { r, g, b, a: +(a / 255).toFixed(3) };
}

export function toRGBA(color: ColorFormat): ColorRGBA {
  if (typeof color === 'string') {
    return hexToRGBA(color);
  }
  return color;
}
