import { ColorFormat, ColorHex, ColorRGB, ColorRGBA } from './formats';
import { isValidHexColor, isValidRGBAColor } from './validations';

function parseHex(hex: string): { r: number; g: number; b: number; a?: number } {
  if (!isValidHexColor(hex)) {
    throw new Error(`Invalid hex color: "${hex}"`);
  }

  const raw = hex.replace(/^#/, '');
  let r = 0;
  let g = 0;
  let b = 0;
  let a: number | undefined;

  if (raw.length === 3) {
    r = parseInt(raw[0] + raw[0], 16);
    g = parseInt(raw[1] + raw[1], 16);
    b = parseInt(raw[2] + raw[2], 16);
  } else {
    r = parseInt(raw.slice(0, 2), 16);
    g = parseInt(raw.slice(2, 4), 16);
    b = parseInt(raw.slice(4, 6), 16);

    if (raw.length === 8) {
      a = parseInt(raw.slice(6, 8), 16) / 255;
    }
  }

  return a === undefined ? { r, g, b } : { r, g, b, a: +a.toFixed(3) };
}

export function hexToRGB(hex: ColorHex): ColorRGB {
  const { r, g, b } = parseHex(hex);
  return { r, g, b };
}

export function hexToRGBA(hex: ColorHex): ColorRGBA {
  return parseHex(hex);
}

export function rgbaToRGB(color: ColorRGBA): ColorRGB {
  const { r, g, b } = color;
  return { r, g, b };
}

export function rgbToRGBA(color: ColorRGB, alpha?: number): ColorRGBA {
  const { r, g, b } = color;
  return alpha === undefined ? { r, g, b } : { r, g, b, a: alpha };
}

function formatHex(value: number): string {
  return value.toString(16).padStart(2, '0');
}

export function rgbaToHex(color: ColorRGBA): ColorHex {
  if (!isValidRGBAColor(color)) {
    throw new Error(`Invalid RGBA color: "${JSON.stringify(color)}"`);
  }

  const { r, g, b, a } = color;
  const alphaHex = a !== undefined ? formatHex(Math.round(a * 255)) : '';

  return (`#${formatHex(r)}${formatHex(g)}${formatHex(b)}${alphaHex}`).toLowerCase() as ColorHex;
}

export function rgbToHex(color: ColorRGB): ColorHex {
  return rgbaToHex(rgbToRGBA(color));
}

export function toRGBA(color: ColorFormat): ColorRGBA {
  if (typeof color === 'string') {
    return hexToRGBA(color);
  }

  if ('a' in color) {
    const { a, ...rgb } = color;
    return rgbToRGBA(rgb, a);
  }

  return rgbToRGBA(color);
}

export function toRGB(color: ColorFormat): ColorRGB {
  if (typeof color === 'string') {
    return hexToRGB(color);
  }

  return 'a' in color ? rgbaToRGB(color) : color;
}

export function toHex(color: ColorFormat): ColorHex {
  if (typeof color === 'string') {
    if (!isValidHexColor(color)) {
      throw new Error(`Invalid hex color: "${color}"`);
    }
    return color.toLowerCase() as ColorHex;
  }

  return 'a' in color ? rgbaToHex(color) : rgbToHex(color);
}
