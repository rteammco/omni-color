import type { CaseInsensitive } from '../utils';

export type ColorHex = `#${string}`;

export interface ColorRGB {
  r: number; // 0-255 (fractional values allowed internally)
  g: number; // 0-255 (fractional values allowed internally)
  b: number; // 0-255 (fractional values allowed internally)
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

export interface ColorHWB {
  h: number; // 0-360
  w: number; // 0-100
  b: number; // 0-100
}

export interface ColorHWBA extends ColorHWB {
  a: number; // 0-1
}

export interface ColorCMYK {
  c: number; // 0-100
  m: number; // 0-100
  y: number; // 0-100
  k: number; // 0-100
}

export interface ColorLAB {
  l: number; // 0-100
  a: number; // unbounded
  b: number; // unbounded
  // Internal hint used for format disambiguation.
  format?: CaseInsensitive<'LAB'>;
}

export interface ColorOKLAB {
  l: number; // 0-1
  a: number; // unbounded
  b: number; // unbounded
  // Internal hint used for format disambiguation.
  format?: CaseInsensitive<'OKLAB'>;
}

export interface ColorLCH {
  l: number; // 0-100
  c: number; // >=0
  h: number; // 0-360
  // Internal hint used for format disambiguation.
  format?: CaseInsensitive<'LCH'>;
}

export interface ColorOKLCH {
  l: number; // 0-1
  c: number; // >=0
  h: number; // 0-360
  // Internal hint used for format disambiguation.
  format?: CaseInsensitive<'OKLCH'>;
}

export type ColorFormat =
  | ColorHex
  | ColorRGB
  | ColorRGBA
  | ColorHSL
  | ColorHSLA
  | ColorHSV
  | ColorHSVA
  | ColorHWB
  | ColorHWBA
  | ColorCMYK
  | ColorLAB
  | ColorOKLAB
  | ColorLCH
  | ColorOKLCH;
