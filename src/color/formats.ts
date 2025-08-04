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

export type ColorFormat =
  | ColorHex
  | ColorRGB
  | ColorRGBA
  | ColorHSL
  | ColorHSLA;

export enum ColorFormatType {
  HEX = 'hex',
  RGB = 'rgb',
  RGBA = 'rgba',
  HSL = 'hsl',
  HSLA = 'hsla',
}

export type TypedColorFormat =
  | { formatType: ColorFormatType.HEX; value: ColorHex }
  | { formatType: ColorFormatType.RGB; value: ColorRGB }
  | { formatType: ColorFormatType.RGBA; value: ColorRGBA }
  | { formatType: ColorFormatType.HSL; value: ColorHSL }
  | { formatType: ColorFormatType.HSLA; value: ColorHSLA };

export function getColorFormat(color: ColorFormat): TypedColorFormat {
  if (typeof color === 'string') {
    return { formatType: ColorFormatType.HEX, value: color };
  }

  if ('h' in color) {
    return 'a' in color
      ? { formatType: ColorFormatType.HSLA, value: color }
      : { formatType: ColorFormatType.HSL, value: color };
  }

  if ('a' in color) {
    return { formatType: ColorFormatType.RGBA, value: color };
  }

  return { formatType: ColorFormatType.RGB, value: color };
}
