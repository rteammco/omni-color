import { ColorFormat, ColorHex, ColorRGBA } from './formats';
import { isValidHexColor, isValidRGBAColor } from './validations';

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

function rgbaToHex(rgba: ColorRGBA): ColorHex {
  if (!isValidRGBAColor(rgba)) {
    throw new Error(`Invalid RGBA color: "${JSON.stringify(rgba)}"`);
  }

  const { r, g, b, a = 1 } = rgba;
  const toHex = (value: number) => value.toString(16).padStart(2, '0');
  const alpha = Math.round(a * 255);
  const alphaHex = alpha < 255 ? toHex(alpha) : '';

  return (`#${toHex(r)}${toHex(g)}${toHex(b)}${alphaHex}`).toLowerCase() as ColorHex;
}

export function toRGBA(color: ColorFormat): ColorRGBA {
  if (typeof color === 'string') {
    return hexToRGBA(color);
  }
  return color;
}

export function toHex(color: ColorFormat): ColorHex {
  if (typeof color === 'string') {
    if (!isValidHexColor(color)) {
      throw new Error(`Invalid hex color: "${color}"`);
    }
    return color.toLowerCase() as ColorHex;
  }
  return rgbaToHex(color);
}
