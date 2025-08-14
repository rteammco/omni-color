import { clampValue } from '../utils';
import {
  ColorCMYK,
  ColorFormat,
  ColorFormatType,
  ColorHex,
  ColorHSL,
  ColorHSLA,
  ColorHSV,
  ColorHSVA,
  ColorLCH,
  ColorOKLCH,
  ColorRGB,
  ColorRGBA,
  getColorFormatType,
} from './formats';
import { validateColorOrThrow } from './validations';

function rgbToRGBA(color: ColorRGB, alpha?: number): ColorRGBA {
  const { r, g, b } = color;
  return alpha === undefined ? { r, g, b, a: 1 } : { r, g, b, a: alpha };
}

function rgbaToRGB(color: ColorRGBA): ColorRGB {
  const { r, g, b } = color;
  return { r, g, b };
}

function hexOrHex8ToRGBA(hex: ColorHex): ColorRGBA {
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

  return a === undefined ? { r, g, b, a: 1 } : { r, g, b, a: +a.toFixed(3) };
}

function hexOrHex8ToRGB(hex: ColorHex): ColorRGB {
  const { r, g, b } = hexOrHex8ToRGBA(hex);
  return { r, g, b };
}

function numToHex(value: number): string {
  return value.toString(16).padStart(2, '0');
}

function rgbaToHex8(color: ColorRGBA): ColorHex {
  const { r, g, b, a } = color;
  const alphaHex = a !== undefined ? numToHex(Math.round(a * 255)) : 'ff';
  return `#${numToHex(r)}${numToHex(g)}${numToHex(b)}${alphaHex}`.toLowerCase() as ColorHex;
}

function rgbaToHex(color: ColorRGBA): ColorHex {
  const { r, g, b } = color;
  return `#${numToHex(r)}${numToHex(g)}${numToHex(b)}`.toLowerCase() as ColorHex;
}

function rgbToHex(color: ColorRGB): ColorHex {
  return rgbaToHex8(rgbToRGBA(color)).substring(0, 7) as ColorHex;
}

function rgbToHex8(color: ColorRGB): ColorHex {
  return `${rgbToHex(color)}ff` as ColorHex;
}

function rgbToHSL(color: ColorRGB): ColorHSL {
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

function rgbaToHSLA(color: ColorRGBA): ColorHSLA {
  const hsl = rgbToHSL(color);
  return { ...hsl, a: color.a };
}

function hslToRGB(color: ColorHSL): ColorRGB {
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

function hslaToRGBA(color: ColorHSLA): ColorRGBA {
  const { a, ...hsl } = color;
  const rgb = hslToRGB(hsl);
  return rgbToRGBA(rgb, a);
}

function hsvaToRGBA(color: ColorHSVA): ColorRGBA {
  const { a, ...hsv } = color;
  const rgb = hsvToRGB(hsv);
  return rgbToRGBA(rgb, a);
}

function rgbToHSV(color: ColorRGB): ColorHSV {
  const r = color.r / 255;
  const g = color.g / 255;
  const b = color.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  const s = max === 0 ? 0 : d / max;
  const v = max;
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
  };
}

function rgbaToHSVA(color: ColorRGBA): ColorHSVA {
  const hsv = rgbToHSV(color);
  return { ...hsv, a: color.a };
}

function hsvToRGB(color: ColorHSV): ColorRGB {
  const h = (((color.h % 360) + 360) % 360) / 60;
  const s = color.s / 100;
  const v = color.v / 100;
  const c = v * s;
  const x = c * (1 - Math.abs((h % 2) - 1));
  const m = v - c;
  let r1 = 0;
  let g1 = 0;
  let b1 = 0;
  if (0 <= h && h < 1) {
    r1 = c;
    g1 = x;
  } else if (1 <= h && h < 2) {
    r1 = x;
    g1 = c;
  } else if (2 <= h && h < 3) {
    g1 = c;
    b1 = x;
  } else if (3 <= h && h < 4) {
    g1 = x;
    b1 = c;
  } else if (4 <= h && h < 5) {
    r1 = x;
    b1 = c;
  } else {
    r1 = c;
    b1 = x;
  }
  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}

function hsvToRGBA(color: ColorHSV, alpha?: number): ColorRGBA {
  const rgb = hsvToRGB(color);
  return rgbToRGBA(rgb, alpha);
}

function rgbToCMYK(color: ColorRGB): ColorCMYK {
  const r = color.r / 255;
  const g = color.g / 255;
  const b = color.b / 255;
  const k = 1 - Math.max(r, g, b);
  const denom = 1 - k;
  const c = denom === 0 ? 0 : (1 - r - k) / denom;
  const m = denom === 0 ? 0 : (1 - g - k) / denom;
  const y = denom === 0 ? 0 : (1 - b - k) / denom;
  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100),
  };
}

function cmykToRGB(color: ColorCMYK): ColorRGB {
  const c = color.c / 100;
  const m = color.m / 100;
  const y = color.y / 100;
  const k = color.k / 100;
  const r = 255 * (1 - c) * (1 - k);
  const g = 255 * (1 - m) * (1 - k);
  const b = 255 * (1 - y) * (1 - k);
  return { r: Math.round(r), g: Math.round(g), b: Math.round(b) };
}

function cmykToRGBA(color: ColorCMYK, alpha?: number): ColorRGBA {
  const rgb = cmykToRGB(color);
  return rgbToRGBA(rgb, alpha);
}

function pivotRGB(n: number): number {
  return n > 0.04045 ? Math.pow((n + 0.055) / 1.055, 2.4) : n / 12.92;
}

function unpivotRGB(n: number): number {
  return n > 0.0031308 ? 1.055 * Math.pow(n, 1 / 2.4) - 0.055 : 12.92 * n;
}

function rgbToLCH(color: ColorRGB): ColorLCH {
  const r = pivotRGB(color.r / 255);
  const g = pivotRGB(color.g / 255);
  const b = pivotRGB(color.b / 255);
  // sRGB to XYZ (D65)
  let x = r * 0.4124 + g * 0.3576 + b * 0.1805;
  let y = r * 0.2126 + g * 0.7152 + b * 0.0722;
  let z = r * 0.0193 + g * 0.1192 + b * 0.9505;
  // Normalize
  x /= 0.95047;
  y /= 1.0;
  z /= 1.08883;
  const fx = x > 0.008856 ? Math.cbrt(x) : 7.787 * x + 16 / 116;
  const fy = y > 0.008856 ? Math.cbrt(y) : 7.787 * y + 16 / 116;
  const fz = z > 0.008856 ? Math.cbrt(z) : 7.787 * z + 16 / 116;
  const l = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const b2 = 200 * (fy - fz);
  const c = Math.sqrt(a * a + b2 * b2);
  const h = (Math.atan2(b2, a) * 180) / Math.PI;
  return {
    l: +l.toFixed(3),
    c: +c.toFixed(3),
    h: +((h + 360) % 360).toFixed(3),
  };
}

function lchToRGB(color: ColorLCH): ColorRGB {
  const hRad = (color.h * Math.PI) / 180;
  const a = color.c * Math.cos(hRad);
  const b = color.c * Math.sin(hRad);
  const fy = (color.l + 16) / 116;
  const fx = a / 500 + fy;
  const fz = fy - b / 200;
  const fx3 = fx ** 3;
  const fy3 = fy ** 3;
  const fz3 = fz ** 3;
  let x = fx3 > 0.008856 ? fx3 : (fx - 16 / 116) / 7.787;
  let y = fy3 > 0.008856 ? fy3 : color.l / 903.3;
  let z = fz3 > 0.008856 ? fz3 : (fz - 16 / 116) / 7.787;
  x *= 0.95047;
  y *= 1.0;
  z *= 1.08883;
  const rLin = x * 3.2406 + y * -1.5372 + z * -0.4986;
  const gLin = x * -0.9689 + y * 1.8758 + z * 0.0415;
  const bLin = x * 0.0557 + y * -0.204 + z * 1.057;
  const r = clampValue(unpivotRGB(rLin), 0, 1);
  const g = clampValue(unpivotRGB(gLin), 0, 1);
  const b3 = clampValue(unpivotRGB(bLin), 0, 1);
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b3 * 255),
  };
}

function lchToRGBA(color: ColorLCH, alpha?: number): ColorRGBA {
  const rgb = lchToRGB(color);
  return rgbToRGBA(rgb, alpha);
}

function rgbToOKLCH(color: ColorRGB): ColorOKLCH {
  const r = pivotRGB(color.r / 255);
  const g = pivotRGB(color.g / 255);
  const b = pivotRGB(color.b / 255);
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const b2 = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
  const C = Math.sqrt(a * a + b2 * b2);
  const h = (Math.atan2(b2, a) * 180) / Math.PI;
  return {
    l: +L.toFixed(6),
    c: +C.toFixed(6),
    h: +((h + 360) % 360).toFixed(3),
  };
}

function oklchToRGB(color: ColorOKLCH): ColorRGB {
  const hRad = (color.h * Math.PI) / 180;
  const a = color.c * Math.cos(hRad);
  const b = color.c * Math.sin(hRad);
  const l_ = color.l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = color.l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = color.l - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;
  const rLin = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const gLin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bLin = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  const r = clampValue(unpivotRGB(rLin), 0, 1);
  const g = clampValue(unpivotRGB(gLin), 0, 1);
  const b3 = clampValue(unpivotRGB(bLin), 0, 1);
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b3 * 255),
  };
}

function oklchToRGBA(color: ColorOKLCH, alpha?: number): ColorRGBA {
  const rgb = oklchToRGB(color);
  return rgbToRGBA(rgb, alpha);
}

export function toRGB(color: ColorFormat): ColorRGB {
  validateColorOrThrow(color);
  const { formatType, value } = getColorFormatType(color);
  switch (formatType) {
    case ColorFormatType.HEX:
    case ColorFormatType.HEX8:
      return hexOrHex8ToRGB(value);
    case ColorFormatType.RGB:
      return value;
    case ColorFormatType.RGBA:
      return rgbaToRGB(value);
    case ColorFormatType.HSL:
      return hslToRGB(value);
    case ColorFormatType.HSLA:
      return rgbaToRGB(hslaToRGBA(value));
    case ColorFormatType.HSV:
      return hsvToRGB(value);
    case ColorFormatType.HSVA:
      return rgbaToRGB(hsvaToRGBA(value));
    case ColorFormatType.CMYK:
      return cmykToRGB(value);
    case ColorFormatType.LCH:
      return lchToRGB(value);
    case ColorFormatType.OKLCH:
      return oklchToRGB(value);
    default:
      throw new Error(`[toRGB] unknown color format: ${formatType}`);
  }
}

export function toRGBA(color: ColorFormat): ColorRGBA {
  validateColorOrThrow(color);
  const { formatType, value } = getColorFormatType(color);
  switch (formatType) {
    case ColorFormatType.HEX:
    case ColorFormatType.HEX8:
      return hexOrHex8ToRGBA(value);
    case ColorFormatType.RGB:
      return rgbToRGBA(value);
    case ColorFormatType.RGBA:
      return value;
    case ColorFormatType.HSL:
      return rgbToRGBA(hslToRGB(value));
    case ColorFormatType.HSLA:
      return hslaToRGBA(value);
    case ColorFormatType.HSV:
      return hsvToRGBA(value);
    case ColorFormatType.HSVA:
      return hsvaToRGBA(value);
    case ColorFormatType.CMYK:
      return cmykToRGBA(value);
    case ColorFormatType.LCH:
      return lchToRGBA(value);
    case ColorFormatType.OKLCH:
      return oklchToRGBA(value);
    default:
      throw new Error(`[toRGBA] unknown color format: ${formatType}`);
  }
}

export function toHex(color: ColorFormat): ColorHex {
  validateColorOrThrow(color);
  const { formatType, value } = getColorFormatType(color);
  switch (formatType) {
    case ColorFormatType.HEX:
      return value;
    case ColorFormatType.HEX8:
      return value.substring(0, 7) as ColorHex;
    case ColorFormatType.RGB:
      return rgbToHex(value);
    case ColorFormatType.RGBA:
      return rgbaToHex(value);
    case ColorFormatType.HSL:
      return rgbToHex(hslToRGB(value));
    case ColorFormatType.HSLA:
      return rgbaToHex(hslaToRGBA(value));
    case ColorFormatType.HSV:
      return rgbToHex(hsvToRGB(value));
    case ColorFormatType.HSVA:
      return rgbaToHex(hsvaToRGBA(value));
    case ColorFormatType.CMYK:
      return rgbToHex(cmykToRGB(value));
    case ColorFormatType.LCH:
      return rgbToHex(lchToRGB(value));
    case ColorFormatType.OKLCH:
      return rgbToHex(oklchToRGB(value));
    default:
      throw new Error(`[toHex] unknown color format: ${formatType}`);
  }
}

export function toHex8(color: ColorFormat): ColorHex {
  validateColorOrThrow(color);
  const { formatType, value } = getColorFormatType(color);
  switch (formatType) {
    case ColorFormatType.HEX:
      return `${value}ff` as ColorHex;
    case ColorFormatType.HEX8:
      return value;
    case ColorFormatType.RGB:
      return rgbToHex8(value);
    case ColorFormatType.RGBA:
      return rgbaToHex8(value);
    case ColorFormatType.HSL:
      return rgbToHex8(hslToRGB(value));
    case ColorFormatType.HSLA:
      return rgbaToHex8(hslaToRGBA(value));
    case ColorFormatType.HSV:
      return rgbToHex8(hsvToRGB(value));
    case ColorFormatType.HSVA:
      return rgbaToHex8(hsvaToRGBA(value));
    case ColorFormatType.CMYK:
      return rgbToHex8(cmykToRGB(value));
    case ColorFormatType.LCH:
      return rgbToHex8(lchToRGB(value));
    case ColorFormatType.OKLCH:
      return rgbToHex8(oklchToRGB(value));
    default:
      throw new Error(`[toHex8] unknown color format: ${formatType}`);
  }
}

export function toHSL(color: ColorFormat): ColorHSL {
  validateColorOrThrow(color);
  return rgbToHSL(toRGB(color));
}

export function toHSLA(color: ColorFormat): ColorHSLA {
  validateColorOrThrow(color);
  return rgbaToHSLA(toRGBA(color));
}

export function toHSV(color: ColorFormat): ColorHSV {
  validateColorOrThrow(color);
  return rgbToHSV(toRGB(color));
}

export function toHSVA(color: ColorFormat): ColorHSVA {
  validateColorOrThrow(color);
  return rgbaToHSVA(toRGBA(color));
}

export function toCMYK(color: ColorFormat): ColorCMYK {
  validateColorOrThrow(color);
  return rgbToCMYK(toRGB(color));
}

export function toLCH(color: ColorFormat): ColorLCH {
  validateColorOrThrow(color);
  return rgbToLCH(toRGB(color));
}

export function toOKLCH(color: ColorFormat): ColorOKLCH {
  validateColorOrThrow(color);
  return rgbToOKLCH(toRGB(color));
}
