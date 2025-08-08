export type ColorHex = `#${string}`;

export type ColorHex8 = `#${string}`;

export interface ColorRGB {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

export interface ColorRGBA extends ColorRGB {
  a: number; // 0-1
}

export interface ColorHSL {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

export interface ColorHSLA extends ColorHSL {
  a: number; // 0-1
}

export interface ColorHSV {
  h: number; // 0-360
  s: number; // 0-100
  v: number; // 0-100
}

export interface ColorHSVA extends ColorHSV {
  a: number; // 0-1
}

export interface ColorCMYK {
  c: number; // 0-100
  m: number; // 0-100
  y: number; // 0-100
  k: number; // 0-100
}

export interface ColorLCH {
  l: number; // 0-100
  c: number; // >=0
  h: number; // 0-360
}

export interface ColorOKLCH {
  l: number; // 0-1
  c: number; // >=0
  h: number; // 0-360
}

export type ColorFormat =
  | ColorHex
  | ColorRGB
  | ColorRGBA
  | ColorHSL
  | ColorHSLA
  | ColorHSV
  | ColorHSVA
  | ColorCMYK
  | ColorLCH
  | ColorOKLCH;

export enum ColorFormatType {
  HEX = 'hex',
  HEX8 = 'hex8',
  RGB = 'rgb',
  RGBA = 'rgba',
  HSL = 'hsl',
  HSLA = 'hsla',
  HSV = 'hsv',
  HSVA = 'hsva',
  CMYK = 'cmyk',
  LCH = 'lch',
  OKLCH = 'oklch',
}

type ColorFormatTypeAndValue =
  | { formatType: ColorFormatType.HEX; value: ColorHex }
  | { formatType: ColorFormatType.HEX8; value: ColorHex8 }
  | { formatType: ColorFormatType.RGB; value: ColorRGB }
  | { formatType: ColorFormatType.RGBA; value: ColorRGBA }
  | { formatType: ColorFormatType.HSL; value: ColorHSL }
  | { formatType: ColorFormatType.HSLA; value: ColorHSLA }
  | { formatType: ColorFormatType.HSV; value: ColorHSV }
  | { formatType: ColorFormatType.HSVA; value: ColorHSVA }
  | { formatType: ColorFormatType.CMYK; value: ColorCMYK }
  | { formatType: ColorFormatType.LCH; value: ColorLCH }
  | { formatType: ColorFormatType.OKLCH; value: ColorOKLCH };

export function getColorFormatType(color: ColorFormat): ColorFormatTypeAndValue {
  if (typeof color === 'string') {
    const lower = color.toLowerCase();
    if (lower.startsWith('#')) {
      if (lower.length === 4 || lower.length === 7) {
        return { formatType: ColorFormatType.HEX, value: lower as ColorHex };
      }
      if (lower.length === 9) {
        return { formatType: ColorFormatType.HEX8, value: lower as ColorHex8 };
      }
    }
    throw new Error(
      `[getColorFormatType] unknown color format: "${JSON.stringify(color)}"`,
    );
  }

  if ('c' in color && 'm' in color && 'y' in color && 'k' in color) {
    return { formatType: ColorFormatType.CMYK, value: color };
  }

  if ('h' in color && 's' in color && 'v' in color) {
    return 'a' in color
      ? { formatType: ColorFormatType.HSVA, value: color }
      : { formatType: ColorFormatType.HSV, value: color };
  }

  if ('h' in color && 's' in color && 'l' in color) {
    return 'a' in color
      ? { formatType: ColorFormatType.HSLA, value: color }
      : { formatType: ColorFormatType.HSL, value: color };
  }

  if ('h' in color && 'l' in color && 'c' in color) {
    const { l, c, h } = color;
    if (l <= 1) {
      const oklch: ColorOKLCH = { l, c, h };
      return { formatType: ColorFormatType.OKLCH, value: oklch };
    }
    const lch: ColorLCH = { l, c, h };
    return { formatType: ColorFormatType.LCH, value: lch };
  }

  if ('r' in color && 'g' in color && 'b' in color) {
    return 'a' in color
      ? { formatType: ColorFormatType.RGBA, value: color }
      : { formatType: ColorFormatType.RGB, value: color };
  }

  throw new Error(`[getColorFormatType] unknown color format: "${JSON.stringify(color)}"`);
}
