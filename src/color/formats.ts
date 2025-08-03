export type ColorHex = `#${string}`;

export interface ColorRGBA {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
  a?: number; // 0-1
}

export type ColorFormat = ColorHex | ColorRGBA;
