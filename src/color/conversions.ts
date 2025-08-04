import {
  ColorFormat,
  ColorHex,
  ColorRGB,
  ColorRGBA,
  ColorHSL,
  ColorHSLA,
} from './formats';
import {
  isValidHexColor,
  isValidRGBAColor,
  isValidHSLAColor,
} from './validations';

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

export function rgbToHSL(color: ColorRGB): ColorHSL {
  const { r, g, b } = color;
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function rgbaToHSL(color: ColorRGBA): ColorHSL {
  return rgbToHSL(color);
}

export function rgbaToHSLA(color: ColorRGBA): ColorHSLA {
  const hsl = rgbToHSL(color);
  return color.a === undefined ? hsl : { ...hsl, a: color.a };
}

export function hslToRGB(color: ColorHSL): ColorRGB {
  if (!isValidHSLAColor(color)) {
    throw new Error(`Invalid HSLA color: "${JSON.stringify(color)}"`);
  }

  const h = (((color.h % 360) + 360) % 360) / 360;
  const s = color.s / 100;
  const l = color.l / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
  const m = l - c / 2;

  let r1 = 0;
  let g1 = 0;
  let b1 = 0;

  if (0 <= h && h < 1 / 6) {
    r1 = c;
    g1 = x;
    b1 = 0;
  } else if (1 / 6 <= h && h < 1 / 3) {
    r1 = x;
    g1 = c;
    b1 = 0;
  } else if (1 / 3 <= h && h < 1 / 2) {
    r1 = 0;
    g1 = c;
    b1 = x;
  } else if (1 / 2 <= h && h < 2 / 3) {
    r1 = 0;
    g1 = x;
    b1 = c;
  } else if (2 / 3 <= h && h < 5 / 6) {
    r1 = x;
    g1 = 0;
    b1 = c;
  } else {
    r1 = c;
    g1 = 0;
    b1 = x;
  }

  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}

export function hslaToRGBA(color: ColorHSLA): ColorRGBA {
  const { a, ...hsl } = color;
  const rgb = hslToRGB(hsl);
  return rgbToRGBA(rgb, a);
}

export function toRGBA(color: ColorFormat): ColorRGBA {
  if (typeof color === 'string') {
    return hexToRGBA(color);
  }

  if ('h' in color) {
    return hslaToRGBA(color);
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

  if ('h' in color) {
    return hslToRGB(color);
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

  if ('h' in color) {
    return rgbToHex(hslToRGB(color));
  }

  return 'a' in color ? rgbaToHex(color) : rgbToHex(color);
}
