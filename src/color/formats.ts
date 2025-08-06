export type ColorHex = `#${string}`;

export interface ColorRGB {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

export interface ColorRGBA extends ColorRGB {
  a?: number; // 0-1
}

export interface ColorHSL {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

export interface ColorHSLA extends ColorHSL {
  a?: number; // 0-1
}

export interface ColorHSV {
  h: number; // 0-360
  s: number; // 0-100
  v: number; // 0-100
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
  | ColorCMYK
  | ColorLCH
  | ColorOKLCH;

export enum ColorFormatType {
  HEX = 'hex',
  RGB = 'rgb',
  RGBA = 'rgba',
  HSL = 'hsl',
  HSLA = 'hsla',
  HSV = 'hsv',
  CMYK = 'cmyk',
  LCH = 'lch',
  OKLCH = 'oklch',
}

export type TypedColorFormat =
  | { formatType: ColorFormatType.HEX; value: ColorHex }
  | { formatType: ColorFormatType.RGB; value: ColorRGB }
  | { formatType: ColorFormatType.RGBA; value: ColorRGBA }
  | { formatType: ColorFormatType.HSL; value: ColorHSL }
  | { formatType: ColorFormatType.HSLA; value: ColorHSLA }
  | { formatType: ColorFormatType.HSV; value: ColorHSV }
  | { formatType: ColorFormatType.CMYK; value: ColorCMYK }
  | { formatType: ColorFormatType.LCH; value: ColorLCH }
  | { formatType: ColorFormatType.OKLCH; value: ColorOKLCH };

export function getColorFormat(color: ColorFormat): TypedColorFormat {
  if (typeof color === 'string') {
    return { formatType: ColorFormatType.HEX, value: color };
  }

  if ('c' in color && 'm' in color && 'y' in color && 'k' in color) {
    return { formatType: ColorFormatType.CMYK, value: color };
  }

  if ('h' in color) {
    if ('s' in color && 'v' in color) {
      return { formatType: ColorFormatType.HSV, value: color };
    }

    if ('s' in color && 'l' in color) {
      return 'a' in color
        ? { formatType: ColorFormatType.HSLA, value: color }
        : { formatType: ColorFormatType.HSL, value: color };
    }

    if ('l' in color && 'c' in color) {
      const { l, c, h } = color;
      if (l <= 1) {
        const oklch: ColorOKLCH = { l, c, h };
        return { formatType: ColorFormatType.OKLCH, value: oklch };
      }
      const lch: ColorLCH = { l, c, h };
      return { formatType: ColorFormatType.LCH, value: lch };
    }
  }

  if ('a' in color) {
    return { formatType: ColorFormatType.RGBA, value: color };
  }

  return { formatType: ColorFormatType.RGB, value: color };
}
