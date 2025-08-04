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
