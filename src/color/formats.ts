export type ColorHex = `#${string}`;

export interface ColorRGB {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

export interface ColorRGBA extends ColorRGB {
  a?: number; // 0-1
}

export type ColorFormat = ColorHex | ColorRGB | ColorRGBA;
